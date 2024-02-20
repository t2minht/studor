'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

export async function retrieveProfileStudySession() {
  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('study_sessions')
    .select()
    .eq('host_user_id', user.id)

  if (error) {
    console.error(error);
    throw new Error("Error fetching study sessions");
  }

  return data;
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

export async function retrieveExistingSessions() {

  const supabase = createServerActionClient({ cookies })

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split('T')[0];
  const currentTime = currentDateTime.toTimeString().split(' ')[0];



  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select()
      .gte('date', currentDate)
      .gte('end_time', currentTime)
      .order('date')
      .order('end_time');


    return data;

  }
  catch (error) {
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

