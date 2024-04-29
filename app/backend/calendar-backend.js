// Import necessary modules
'use server'
import { NextResponse } from "next/server";
import path from "path";
import { exit } from "process";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import { error } from "console";

// deletes all current events for user and replaces them with calendar
export async function sendEvents(data) {                      
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // check if user has a calendar entry
    const { data: userCalendar } = await supabase
    .from('calendar')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  // if user does not have a calendar entry, create one
  if (!userCalendar) {
    const {error: error2 } = await supabase
      .from('calendar')
      .insert([
        {
          user_id: user.id,
          events: data,
        }
      ])
      .eq("user_id", user.id)
      .select();
    }
    else {
      // if user has a calendar entry, update the events
      const {error: error3 } = await supabase
        .from('calendar')
        .update({
          events: data
        })
        .eq('user_id', user.id);
    
    }
}

// deletes all current events for user and replaces them with calendar
export async function sendManualClasses(data) {                      
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  // check if user has a calendar entry
    const { data: userCalendar } = await supabase
    .from('manual_classes')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  // if user does not have a calendar entry, create one
  if (!userCalendar) {
    const {error: error2 } = await supabase
      .from('manual_classes')
      .insert([
        {
          user_id: user.id,
          classes: data,
        }
      ])
      .eq("user_id", user.id)
      .select();
    }
    else {
      // if user has a calendar entry, update the events
      const {error: error3 } = await supabase
        .from('calendar')
        .update({
          classes: data
        })
        .eq('user_id', user.id);
    
    }
}

// 
export async function retrieveClassTimes(course_info) {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const userEventsQuery = supabase
      .from('course_catalog')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: data1, error: error1 } = await userEventsQuery;

    // if (error1) {
    //   const blank_data = {};
    //   blank_data.events = JSON.stringify([{}]);
    //   return blank_data
    // }

    // console.log(data1);

    return data1;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// retrieves user's events from calendar
export async function retrieveUserEvents() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const userEventsQuery = supabase
      .from('calendar')
      .select('events')
      .eq('user_id', user.id)
      .single();

    const { data: data1, error: error1 } = await userEventsQuery;

    if (error1) {
      const blank_data = {};
      blank_data.events = JSON.stringify([{}]);
      return blank_data
    }

    // console.log(data1);

    return data1;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

// sets color for studysessions 
export async function setStudySessionColor(value) {

  const supabase = createServerActionClient({ cookies });

  const { data: {user} } = await supabase.auth.getUser();

  // check if user has a calendar entry
  const { data: userCalendar } = await supabase
    .from('calendar')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
    // if user does not have a calendar entry, create one
  if (!userCalendar) {
    const { data: returned_data, error: error } = await supabase
      .from('calendar')
      .insert([
        {
          user_id: user.id,
          study_session_color: value
        }
      ])
      .eq('user_id', user.id);
    }
  else {
    // if user has a calendar entry, update the study session color
    const { data: returned_data, error: error } = await supabase
    .from('calendar')
    .update({
      study_session_color: value
    })
    .eq('user_id', user.id);
  }


}

// sets color for tutorsessions
export async function setTutorSessionColor(value) {

  const supabase = createServerActionClient({ cookies });

  const { data: {user} } = await supabase.auth.getUser();

  // check if user has a calendar entry
  const { data: userCalendar } = await supabase
    .from('calendar')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  // if user does not have a calendar entry, create one
  if (!userCalendar) {
    const { data: returned_data, error: error } = await supabase
      .from('calendar')
      .insert([
        {
          user_id: user.id,
          tutor_session_color: value
        }
      ])
      .eq('user_id', user.id);
    }
  else {
    // if user has a calendar entry, update the study session color
    const { data: returned_data, error: error } = await supabase
      .from('calendar')
      .update({
        tutor_session_color: value
      })
      .eq('user_id', user.id);
  }


}

// gets study and tutor session colors
export async function getColorPref() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const getColorPrefs = supabase
      .from('calendar')
      .select('study_session_color, tutor_session_color')
      .eq('user_id', user.id)
      .single();

    const {data: colorPrefs, error: error1} = await getColorPrefs;

    return colorPrefs || {study_session_color: "#FFFFFF", tutor_session_color: "#FFFFFF"};

  } catch (error) {
    throw error;
  }
}