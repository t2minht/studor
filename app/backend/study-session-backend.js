'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Function to convert time to 12-hour format
function convertTo12HourFormat(timeString) {
  // Split the string into hours and minutes
  var parts = timeString.split(":");
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);

  // Convert hours to 12-hour format
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Construct the new time string
  var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

  return formattedTime;
}
// Function to format date
function formatDate(inputDate) {
  // Create a new Date object from the input string
  var dateObj = new Date(inputDate);
  dateObj.setDate(dateObj.getDate() + 1);
  // Format the date using options
  var options = { month: 'long', day: '2-digit', year: 'numeric' };
  var formattedDate = dateObj.toLocaleDateString('en-US', options);

  return formattedDate;
}
// Function to send email to all participants when a session has been updated by the creator
function sendEmailOnUpdate(participantEmail, sessionInfo) {
  const msg = {
    to: participantEmail,
    from: 'studorcapstone@gmail.com',
    subject: 'One Of Your Study Sessions Has Been Updated!',
    html: `The following study session you joined has been updated on Studor:<br><br>
           <b>Topic:</b> ${sessionInfo.title}<br>
           <b>Description:</b> ${sessionInfo.description || 'N/A'} <br>
           <b>Department:</b> ${sessionInfo.department}<br>
           <b>Course Number:</b> ${sessionInfo.courseNumber}<br>
           <b>Section:</b> ${sessionInfo.courseSection || 'N/A'}<br>
           <b>Location:</b> ${sessionInfo.location}<br>
           <b>Date:</b> ${formatDate(sessionInfo.date)}<br>
           <b>Start Time:</b> ${convertTo12HourFormat(sessionInfo.startTime)}<br>
           <b>End Time:</b> ${convertTo12HourFormat(sessionInfo.endTime)}<br>
           <b>Max Group Size:</b> ${sessionInfo.groupSize}<br>
           <b>Noise Level:</b> ${sessionInfo.noiseLevel}<br>`
  }


  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error.response.body.errors)
    })
}

// Function to send email to all participants when a session has been deleted by the creator
function sendEmailOnDelete(participantEmail, sessionInfo) {
  const msg = {
    to: participantEmail,
    from: 'studorcapstone@gmail.com',
    subject: 'One Of Your Study Sessions Has Been Deleted!',
    html: `The following study session you joined has been removed on Studor:<br><br>
            <b>Title:</b> ${sessionInfo.topic}<br>
            <b>Description:</b> ${sessionInfo.description || 'N/A'} <br>
            <b>Department:</b> ${sessionInfo.department}<br>
            <b>Course Number:</b> ${sessionInfo.course_number}<br>
            <b>Section:</b> ${sessionInfo.section || 'N/A'}<br>
            <b>Location:</b> ${sessionInfo.location}<br>
            <b>Date:</b> ${formatDate(sessionInfo.date)}<br>
            <b>Start Time:</b> ${convertTo12HourFormat(sessionInfo.start_time)}<br>
            <b>End Time:</b> ${convertTo12HourFormat(sessionInfo.end_time)}<br>
            <b>Max Group Size:</b> ${sessionInfo.max_group_size}<br>`
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error.response.body.errors)
    })
}
// helper function to find the difference between two sets to show only the sessions that the user has not joined
function setDifference(setA, setB) {
  const difference = new Set(setA);
  for (const item of setB) {
    difference.delete(item);
  }
  return difference;
}
// code that allows for exporting certain functions when running tests
if (process.env.NODE_ENV === 'TEST') {
  module.exports = {
    setDifference,
    convertTo12HourFormat,
    formatDate,
    sendEmailOnUpdate,
    sendEmailOnDelete
  };
}


// Function to retrieve all study sessions that the user has participated in
export async function retrieveProfileStudySession() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();


  try {
    const participantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .eq('user_id', user.id);

    const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

    if (participantSessionsError) {
      throw participantSessionsError;
    }

    const participantSessionIds = participantSessionsData.map(entry => entry.study_session_id);

    const { data, error } = await supabase
      .from('study_sessions')
      .select()
      .in('id', participantSessionIds)
      .order('date', { ascending: false })
      .order('end_time', { ascending: false });

    return data;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// Function to retrieve metadata of the user to display on the profile page
export async function retrieveUserProfileInfo() {
  const supabase = createServerActionClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let metadata = user.user_metadata
  metadata.id = user.id
  return metadata
}

// Function to submit a new study session to the database
export async function submitStudyGroupSessionData(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();


  const { data: returned_session, error: error1 } = await supabase
    .from('study_sessions')
    .insert([
      {
        topic: data.title,
        department: data.department,
        course_number: data.courseNumber,
        section: data.courseSection || 0,
        location: data.location,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        max_group_size: data.groupSize,
        noise_level: data.noiseLevel,
        host_user_id: user.id,
        description: data.description,
        host_avatar_url: user.user_metadata.avatar_url
      }
    ])
    .select();

  // adds the user to the participants table for that session
  const { data: returned_participant, data: error2 } = await supabase.from('participants_in_study_session')
    .insert([
      {
        user_id: user.id,
        study_session_id: returned_session[0].id
      }
    ])
}

// Function to update a study session in the database
export async function updateStudyGroupSessionData(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();

  const { data: returned_session, error: error1 } = await supabase
    .from('study_sessions')
    .update([
      {
        topic: data.title,
        department: data.department,
        course_number: data.courseNumber,
        section: data.courseSection || 0,
        location: data.location,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        max_group_size: data.groupSize,
        noise_level: data.noiseLevel,
        host_user_id: user.id,
        description: data.description

      }
    ])
    .eq('id', data.id)
    .select();

  // sends an email to all participants in the session
  const { data: participantsData, error: participantsError } = await supabase
    .from('participants_in_study_session')
    .select('users(email)')
    .eq('study_session_id', data.id);

  const participantEmails = participantsData.map(entry => entry.users.email);
  for (const email of participantEmails) {
    sendEmailOnUpdate(email, data);
  }
}
/* 
If I click "Update"
then I'm redirected to the update page
when I input "Updated Session" in the topic field
then I click "Update"
then I should get a notification that the session was updated
then I should be redirected to the landing page
then I should see the updated session called "Updated Session"
*/

// Function to retrieve all future study sessions that the user has not joined
export async function retrieveExistingNotJoinedSessions() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const options = { timeZone: 'America/Chicago' }; // Central Time
  const currentDate = currentDateTime.toLocaleDateString('en-US', options);
  const currentTime = currentDateTime.toLocaleTimeString('en-US', options).split(' ')[0];



  try {
    const notParticipantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .neq('user_id', user.id);

    const { data: notParticipantSessionsData, error: notParticipantSessionsError } = await notParticipantSessionsQuery;
    const notParticipantSessionIdsSet = new Set(notParticipantSessionsData.map(entry => entry.study_session_id));

    const participantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .eq('user_id', user.id);

    const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;
    const participantSessionIdsSet = new Set(participantSessionsData.map(entry => entry.study_session_id));

    const notInSessionsSet = setDifference(notParticipantSessionIdsSet, participantSessionIdsSet);
    const notInSessionsArray = Array.from(notInSessionsSet);


    const { data: futureData, error: error1 } = await supabase
      .from('study_sessions')
      .select()
      .gt('date', currentDate)
      .in('id', notInSessionsArray)
      .order('date')
      .order('end_time');

    const { data: todaysData, error: error2 } = await supabase
      .from('study_sessions')
      .select()
      .eq('date', currentDate)
      .gte('end_time', currentTime)
      .in('id', notInSessionsArray)
      .order('date')
      .order('end_time');

    const data = todaysData.concat(futureData);
    return data;


  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// Function to retrieve all future study sessions that the user has joined
export async function retrieveExistingJoinedSessions() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const options = { timeZone: 'America/Chicago' }; // Central Time
  const currentDate = currentDateTime.toLocaleDateString('en-US', options);
  const currentTime = currentDateTime.toLocaleTimeString('en-US', options).split(' ')[0];

  try {
    const participantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .eq('user_id', user.id);

    const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

    if (participantSessionsError) {
      throw participantSessionsError;
    }

    const participantSessionIds = participantSessionsData.map(entry => entry.study_session_id);

    const { data: futureData, error: error1 } = await supabase
      .from('study_sessions')
      .select()
      .gt('date', currentDate)
      .in('id', participantSessionIds)
      .neq('host_user_id', user.id)
      .order('date')
      .order('end_time');


    const { data: todaysData, error: error2 } = await supabase
      .from('study_sessions')
      .select()
      .eq('date', currentDate)
      .gte('end_time', currentTime)
      .in('id', participantSessionIds)
      .neq('host_user_id', user.id)
      .order('date')
      .order('end_time');

    const data = todaysData.concat(futureData);
    return data;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// Function to delete a study session from the database
export async function deleteSession(id) {
  const supabase = createServerActionClient({ cookies });

  const { data: sessionData } = await supabase.from('study_sessions').select().eq('id', id).single();

  const { data: returned_participants, error: error2 } = await supabase
    .from('participants_in_study_session')
    .select('users(email)')
    .eq('study_session_id', id);

  const participants = returned_participants.map(entry => entry.users.email);
  for (const participant of participants) {
    sendEmailOnDelete(participant, sessionData);
  }

  const { data: returned_data, data: error1 } = await supabase.from("study_sessions")
    .delete()
    .eq('id', id)
}
/*
if I click "Delete Session" 
then click "Yes"
then the session will be removed from the landing page
*/

// Function to allow  auser to join a session in the database
export async function joinSession(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();

  // need to check if session is full first
  const { data: sessionData, error: sessionError } = await supabase
    .from('study_sessions')
    .select('current_group_size, max_group_size')
    .eq('id', data.session.id);


  if (sessionData[0].current_group_size >= sessionData[0].max_group_size) {
    return false
  }

  const { data: returned_participant, data: error } = await supabase.from('participants_in_study_session')
    .insert([
      {
        user_id: user.id,
        study_session_id: data.session.id
      }
    ])

  const { data: returned_data, data: error1 } = await supabase.from("study_sessions")
    .update({ current_group_size: data.session.current_group_size + 1 })
    .eq('id', data.session.id)

  return true
}

// Function to allow a user to leave a session in the database
export async function leaveSession(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();


  const { data: returned_participant, data: error } = await supabase.from('participants_in_study_session')
    .delete()
    .eq('user_id', user.id)
    .eq('study_session_id', data.id)

  const { data: returned_data, data: error1 } = await supabase.from("study_sessions")
    .update({ current_group_size: data.current_group_size - 1 })
    .eq('id', data.id)
}
/*
if I click leave session
then session will be removed from the landing page
then current group size decrements by 1
then participant is removed from the database
then session reappears on the study session page
*/

// Function to retrieve all future study sessions that the user has hosted for the landing page
export async function retrieveFutureHostedSessions() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const options = { timeZone: 'America/Chicago' }; // Central Time
  const currentDate = currentDateTime.toLocaleDateString('en-US', options);
  const currentTime = currentDateTime.toLocaleTimeString('en-US', options).split(' ')[0];

  try {


    const { data: futureData, error: error1 } = await supabase
      .from('study_sessions')
      .select()
      .eq('host_user_id', user.id)
      .gt('date', currentDate)
      .order('date')
      .order('end_time');


    const { data: todaysData, error: error2 } = await supabase
      .from('study_sessions')
      .select()
      .eq('host_user_id', user.id)
      .eq('date', currentDate)
      .gte('end_time', currentTime)
      .order('date')
      .order('end_time');

    const data = todaysData.concat(futureData);
    return data;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// Helper function to get all participants in a session, used to send emails on update or delete
export async function getParticipantsInSession(sessionId) {

  const supabase = createServerActionClient({ cookies });

  const participantSessionsQuery = supabase
    .from('participants_in_study_session')
    .select('user_id, users(last_name, first_name)')
    .eq('study_session_id', sessionId);

  const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

  const names = participantSessionsData.map(entry => entry.users.full_name);

  if (participantSessionsError) {
    throw participantSessionsError;
  }

  return names;

}

// Fuction that gets all participants in all sessions
export async function getParticipantsInAllSessions() {

  const supabase = createServerActionClient({ cookies });

  const participantSessionsQuery = supabase
    .from()
    .select()
    .join();

  const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

  const names = participantSessionsData.map(entry => entry.users.full_name);

  if (participantSessionsError) {
    throw participantSessionsError;
  }

  return names;

}