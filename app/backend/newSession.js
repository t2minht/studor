'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'


export async function submitStudyGroupSessionData(data) {

  const supabase = createServerActionClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser();


  const { returned_data, error } = await supabase.from('study_sessions').insert([
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
  ]).select();
  // console.log('error', error);
  // console.log('returned_data', returned_data);


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

    if (error) {
      console.error(error);
      throw new Error("Error fetching study sessions");
    }

    return data;

  }
  catch (error) {
    console.log('error', error);
    throw error;
  }
}

// export function submitTutorSessionData(data) {
//   console.log(data);
// }