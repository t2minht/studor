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

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
function formatDate(inputDate) {
    // Create a new Date object from the input string
    var dateObj = new Date(inputDate);
    dateObj.setDate(dateObj.getDate() + 1);
    // Format the date using options
    var options = { month: 'long', day: '2-digit', year: 'numeric' };
    var formattedDate = dateObj.toLocaleDateString('en-US', options);

    return formattedDate;
}

function sendEmailOnUpdate(participantEmail, sessionInfo) {
    const msg = {
        to: participantEmail,
        from: 'studorcapstone@gmail.com',
        subject: 'One Of Your Tutoring Sessions Has Been Updated!',
        html: `The following study session you joined has been updated on Studor:<br><br>
              <b>Title:</b> ${sessionInfo.title}<br>
              <b>Description:</b> ${sessionInfo.description || 'N/A'} <br>
              <b>Department:</b> ${sessionInfo.department}<br>
              <b>Course Number:</b> ${sessionInfo.courseNumber}<br>
              <b>Section:</b> ${sessionInfo.courseSection || 'N/A'}<br>
              <b>Location:</b> ${sessionInfo.location}<br>
              <b>Date:</b> ${formatDate(sessionInfo.date)}<br>
              <b>Start Time:</b> ${convertTo12HourFormat(sessionInfo.startTime)}<br>
              <b>End Time:</b> ${convertTo12HourFormat(sessionInfo.endTime)}<br>
              <b>Max Group Size:</b> ${sessionInfo.groupSize}<br>`
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

function sendEmailOnDelete(participantEmail, sessionInfo) {
    const msg = {
        to: participantEmail,
        from: 'studorcapstone@gmail.com',
        subject: 'One Of Your Tutoring Sessions Has Been Deleted!',
        html: `The following tutoring session you joined has been removed on Studor:<br><br>
              <b>Title:</b> ${sessionInfo.title}<br>
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

export async function insertRatings(studentId, tutorId, sessionId, rating) {

    const supabase = createServerActionClient({ cookies });

    const { data: returned_data, error: error1 } = await supabase
        .from("tutor_ratings")
        .select()
        .eq('student_id', studentId)
        .eq('session_id', sessionId)


    if (returned_data.length === 0) {
        const { data, error } = await supabase.from("tutor_ratings")
            .insert([
                {
                    student_id: studentId,
                    tutor_id: tutorId,
                    session_id: sessionId,
                    rating: rating
                },

            ])
            .select();
    }
    else {
        const { data, error } = await supabase.from("tutor_ratings")
            .update({ rating: rating })
            .eq('student_id', studentId)
            .eq('session_id', sessionId)
            .select();
    }

    // in users table, update average rating for tutor
    const { data: tutorRatings, error: tutorRatingsError } = await supabase.from('tutor_ratings')
        .select('rating')
        .eq('tutor_id', tutorId)

    if (!tutorRatings) {
        const { data: returned_data2, error2 } = await supabase.from("users")
            .update({ tutor_rating: null })
            .eq('id', tutorId)
            .select();
        return
    } else {
        const ratings = tutorRatings.map(entry => entry.rating);
        const sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);
        const averageRating = sumOfRatings / ratings.length;

        const { data: returned_data2, error: error2 } = await supabase.from("users")
            .update({ tutor_rating: averageRating })
            .eq('id', tutorId)
            .select();

    }
}

export async function addTutorCourses(classes) {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user.id
    try {
        const { data: returned_data, error: error1 } = await supabase.from("tutor_courses")
            .delete()
            .eq('user_id', user_id)

    } catch (error) {
        console.log('error', error);
        throw error;
    }

    // need to get the course id for each className from tutor_course_catalog and then insert into tutor_courses table
    let array = []
    for (const className in classes) {
        const { data: courseID, error: courseError } = await supabase.from('tutor_course_catalog').
            select('id')
            .eq('coursecode', className)



        if (courseID.length === 0) {
            console.log("Course not found", className)
            const deptartment = className.split(' ')[0]
            const courseNumber = className.split(' ')[1]
            const { data, error } = await supabase.from("tutor_course_catalog")
                .insert([
                    {
                        Department: deptartment,
                        CourseNum: courseNumber,
                    }
                ]).select()

            const course_id = data[0].id
            array.push({ user_id, course_id })


        } else {
            const course_id = courseID[0].id
            array.push({ user_id, course_id })

        }
    }

    const { error } = await supabase.from("tutor_courses")
        .insert(array)

}

export async function retrieveProfileTutoringSessions() {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    try {
        const participantSessionsQuery = supabase
            .from('participants_in_tutor_session')
            .select('tutoring_session_id')
            .eq('user_id', user.id);

        const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

        if (participantSessionsError) {
            throw participantSessionsError;
        }

        const participantSessionIds = participantSessionsData.map(entry => entry.tutoring_session_id);

        const { data, error } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .in('id', participantSessionIds)
            .order('date', { ascending: false })
            .order('end_time', { ascending: false });

        return data;

    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export async function submitTutoringSession(data) {

    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();


    // check if tutor is verified for the course
    const department = data.department
    const courseNumber = data.courseNumber
    const courseCode = department + ' ' + courseNumber

    const { data: courseID, error: courseError } = await supabase.from('tutor_course_catalog').
        select('id')
        .eq('coursecode', courseCode)
    const course_id = courseID[0].id

    const { data: tutorCourseData, error: tutorCourseError } = await supabase.from('tutor_courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course_id)

    const verified = tutorCourseData.length !== 0;


    const { data: newTutoringSession, error } = await supabase.from('tutoring_sessions').insert([
        {
            title: data.title,
            description: data.description,
            department: data.department,
            course_number: data.courseNumber,
            section: data.courseSection || 0,
            location: data.location,
            max_group_size: data.groupSize,
            date: data.date,
            start_time: data.startTime,
            end_time: data.endTime,
            tutor_user_id: user.id,
            tutor_avatar_url: user.user_metadata.avatar_url,
            verified: verified
        }
    ])
        .select();


    const { data: returnedParticipant, error: participantError } = await supabase.from('participants_in_tutor_session').insert([
        {
            user_id: user.id,
            tutoring_session_id: newTutoringSession[0].id
        }

    ])

}

export async function retrieveFutureHostedSessions() {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const currentDateTime = new Date();
    const currentDate = currentDateTime.toDateString();
    const currentTime = currentDateTime.toTimeString().split(' ')[0];

    try {

        const { data: futureData, error: error1 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .eq('tutor_user_id', user.id)
            .gt('date', currentDate)
            .order('date')
            .order('end_time');

        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .eq('tutor_user_id', user.id)
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

export async function retrieveExistingJoinedSessions() {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const currentDateTime = new Date();
    const currentDate = currentDateTime.toDateString();
    const currentTime = currentDateTime.toTimeString().split(' ')[0];

    try {
        const participantSessionsQuery = supabase
            .from('participants_in_tutor_session')
            .select('tutoring_session_id')
            .eq('user_id', user.id);

        const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;

        if (participantSessionsError) {
            throw participantSessionsError;
        }

        const participantSessionIds = participantSessionsData.map(entry => entry.tutoring_session_id);

        const { data: futureData, error: error1 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .gt('date', currentDate)
            .in('id', participantSessionIds)
            .neq('tutor_user_id', user.id)
            .order('date')
            .order('end_time');

        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .eq('date', currentDate)
            .gte('end_time', currentTime)
            .in('id', participantSessionIds)
            .neq('tutor_user_id', user.id)
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

    const { data: sessionData, error: sessionError } = await supabase
        .from('tutoring_sessions')
        .select('current_group_size, max_group_size')
        .eq('id', data.session.id);


    if (sessionData[0].current_group_size >= sessionData[0].max_group_size) {
        return false
    }


    const { data: returned_participant, data: error } = await supabase.from('participants_in_tutor_session')
        .insert([
            {
                user_id: user.id,
                tutoring_session_id: data.session.id
            }
        ])
        .select()



    const { data: returned_data, data: error1 } = await supabase.from("tutoring_sessions")
        .update({ current_group_size: data.session.current_group_size + 1 })
        .eq('id', data.session.id)
        .select()


    return true

}

export async function getExistingNotJoinedSessions() {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const currentDateTime = new Date();
    const currentDate = currentDateTime.toDateString();
    const currentTime = currentDateTime.toTimeString().split(' ')[0];



    try {
        const notParticipantSessionsQuery = supabase
            .from('participants_in_tutor_session')
            .select('tutoring_session_id')
            .neq('user_id', user.id);

        const { data: notParticipantSessionsData, error: notParticipantSessionsError } = await notParticipantSessionsQuery;
        const notParticipantSessionIdsSet = new Set(notParticipantSessionsData.map(entry => entry.tutoring_session_id));

        const participantSessionsQuery = supabase
            .from('participants_in_tutor_session')
            .select('tutoring_session_id')
            .eq('user_id', user.id);

        const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;
        const participantSessionIdsSet = new Set(participantSessionsData.map(entry => entry.tutoring_session_id));

        const notInSessionsSet = setDifference(notParticipantSessionIdsSet, participantSessionIdsSet);
        const notInSessionsArray = Array.from(notInSessionsSet);



        const { data: futureData, error: error1 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .gt('date', currentDate)
            .in('id', notInSessionsArray)
            .order('date')
            .order('end_time');


        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name, tutor_rating)')
            .eq('date', currentDate)
            .gte('end_time', currentTime)
            .in('id', notInSessionsArray)
            .order('date')
            .order('end_time');

        const data = todaysData.concat(futureData);
        console.log("data", data)

        return data;


    } catch (error) {
        console.log('error', error);
        throw error;
    }
}

export async function deleteSession(id) {
    const supabase = createServerActionClient({ cookies });

    const { data: sessionData } = await supabase.from('tutoring_sessions').select().eq('id', id).single();

    const { data: returned_participants, error: error2 } = await supabase
        .from('participants_in_tutor_session')
        .select('users(email)')
        .eq('tutoring_session_id', id);

    const participants = returned_participants.map(entry => entry.users.email);
    for (const participant of participants) {
        sendEmailOnDelete(participant, sessionData);
    }

    const { data: returned_data, data: error1 } = await supabase.from("tutoring_sessions")
        .delete()
        .eq('id', id)
}

export async function leaveSession(data) {

    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser();


    const { data: returned_participant, data: error } = await supabase.from('participants_in_tutor_session')
        .delete()
        .eq('user_id', user.id)
        .eq('tutoring_session_id', data.session.id)

    const { data: returned_data, data: error1 } = await supabase.from("tutoring_sessions")
        .update({ current_group_size: data.session.current_group_size - 1 })
        .eq('id', data.session.id)
}

export async function updateTutoringSessionData(data) {

    const supabase = createServerActionClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser();

    const { data: returned_session, error: error1 } = await supabase
        .from('tutoring_sessions')
        .update([
            {
                title: data.title,
                department: data.department,
                course_number: data.courseNumber,
                section: data.courseSection || 0,
                location: data.location,
                date: data.date,
                start_time: data.startTime,
                end_time: data.endTime,
                max_group_size: data.groupSize,
                tutor_user_id: user.id,
                description: data.description

            }
        ])
        .eq('id', data.id)
        .select();

    const { data: returned_participants, error: error2 } = await supabase
        .from('participants_in_tutor_session')
        .select('users(email)')
        .eq('tutoring_session_id', data.id);

    const participants = returned_participants.map(entry => entry.users.email);
    for (const participant of participants) {
        sendEmailOnUpdate(participant, data);
    }

}


// get all courses that a tutor can tutor in
export async function getTutorCourses() {
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const { data: returned_data, error: error1 } = await supabase.from("tutor_courses")
        .select('tutor_course_catalog(Department, CourseNum)')
        .eq('user_id', user.id)


    return returned_data; // returns an array of format [{tutor_course_catalog: {CourseNum: 'XXX', Department: 'XXX'}}]
}

export async function getDepartmentNames() {
    const supabase = createServerActionClient({ cookies });
    const { data: returned_data, error: error1 } = await supabase.from("tutor_course_catalog")
        .select('Department',);


    // turn this into a set
    const departmentSet = new Set(returned_data.map(entry => entry.Department));
    const deptartments = Array.from(departmentSet);
    return deptartments;
}