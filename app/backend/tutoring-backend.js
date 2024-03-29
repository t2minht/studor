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
            .select('*, users(full_name)')
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
    const currentDate = currentDateTime.toISOString().split('T')[0];
    const currentTime = currentDateTime.toTimeString().split(' ')[0];

    try {

        const { data: futureData, error: error1 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name)')
            .eq('tutor_user_id', user.id)
            .gt('date', currentDate)
            .order('date')
            .order('end_time');

        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name)')
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
    const currentDate = currentDateTime.toISOString().split('T')[0];
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
            .select('*, users(full_name)')
            .gt('date', currentDate)
            .in('id', participantSessionIds)
            .neq('tutor_user_id', user.id)
            .order('date')
            .order('end_time');


        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name)')
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
    const currentDate = currentDateTime.toISOString().split('T')[0];
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
            .select('*, users(full_name)')
            .gt('date', currentDate)
            .in('id', notInSessionsArray)
            .order('date')
            .order('end_time');

        const { data: todaysData, error: error2 } = await supabase
            .from('tutoring_sessions')
            .select('*, users(full_name)')
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

export async function deleteSession(id) {
    const supabase = createServerActionClient({ cookies });

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