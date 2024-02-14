'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'


export async function submitSessionData(data) {

  const supabase = createServerActionClient({ cookies })
  const {data: {user} } = await supabase.auth.getUser();
  

  await supabase.from('study_sessions').insert([
    { topic : data.title, 
      department : data.department,
      course_number : data.courseNumber,
      section : data.courseSection,
      location : data.location,
      date : data.dateAndTime,
      start_time : data.dateAndTime,
      end_time : data.dateAndTime,
      max_group_size : data.groupSize,
      noise_level : data.noiseLevel,
      host_user_id : user.id
    }
  ]);
  console.log(data);
}

