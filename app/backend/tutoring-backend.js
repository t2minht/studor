'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

export async function submitTutoringSession(data) {

    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const { data: newTutoringSession, error } = await supabase.from('tutoring_sessions').insert([
        {
            title: data.title,
            description: data.description,
            department: data.department,
            course_number: data.courseNumber,
            course_section: data.courseSection || 0,
            location: data.location,
            max_group_size: data.groupSize,
            date: data.date,
            start_time: data.startTime,
            end_time: data.endTime,
            tutor_user_id: user.id,
            tutor_avatar_url: user.user_metadata.avatar_url,
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
        .select()
        .eq('tutor_user_id', user.id)
        .gt('date', currentDate)
        .order('date')
        .order('end_time');
  
      const { data: todaysData, error: error2 } = await supabase
        .from('tutoring_sessions')
        .select()
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
        .select()
        .gt('date', currentDate)
        .in('id', participantSessionIds)
        .neq('tutor_user_id', user.id)
        .order('date')
        .order('end_time');
  
  
      const { data: todaysData, error: error2 } = await supabase
        .from('tutoring_sessions')
        .select()
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
  