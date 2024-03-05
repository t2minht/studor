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