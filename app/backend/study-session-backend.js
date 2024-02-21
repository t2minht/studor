'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

function setDifference(setA, setB) {
  const difference = new Set(setA);
  for (const item of setB) {
    difference.delete(item);
  }
  return difference;
}


export async function retrieveProfileStudySession() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split('T')[0];
  const currentTime = currentDateTime.toTimeString().split(' ')[0];

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

export async function retrieveUserProfileInfo() {
  const supabase = createServerActionClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let metadata = user.user_metadata
  return metadata
}

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
        host_user_id: user.id
      }
    ])
    .select();

  // TODO: put into new function???
  const { data: returned_participant, data: error2 } = await supabase.from('participants_in_study_session')
    .insert([
      {
        user_id: user.id,
        study_session_id: returned_session[0].id
      }
    ])
}

export async function retrieveExistingNotJoinedSessions() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split('T')[0];
  const currentTime = currentDateTime.toTimeString().split(' ')[0];



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

export async function retrieveExistingJoinedSessions() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split('T')[0];
  const currentTime = currentDateTime.toTimeString().split(' ')[0];

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
      .order('date')
      .order('end_time');

    const { data: todaysData, error: error2 } = await supabase
      .from('study_sessions')
      .select()
      .eq('date', currentDate)
      .gte('end_time', currentTime)
      .in('id', participantSessionIds)
      .order('date')
      .order('end_time');

    const data = todaysData.concat(futureData);
    return data;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}



export async function joinSession(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();

  const { data: returned_participant, data: error } = await supabase.from('participants_in_study_session')
    .insert([
      {
        user_id: user.id,
        study_session_id: data.session_id
      }
    ])
}

