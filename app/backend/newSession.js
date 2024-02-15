'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'


export async function submitStudyGroupSessionData(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();

  const { data : returned_session, error : error1 } = await supabase
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
  const { data : returned_participant, data : error2 } = await supabase.from('participants_in_study_session')
  .insert([
    {
      user_id: user.id,
      study_session_id: returned_session[0].id
    }
  ])
}