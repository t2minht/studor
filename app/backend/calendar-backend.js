// Import necessary modules
'use server'
import { NextResponse } from "next/server";
import path from "path";
import { exit } from "process";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import { error } from "console";


// export async function calendarDataUpload() {
//   // console.log("arrived at function");
//   let reader = new FileReader();
//   reader.readAsText(data);
//   let results;
//   reader.onload = function() {
//     // console.log("results")
//     results = JSON.stringify(parseICS(reader.result))
//     // console.log(results);
//     sendEvents(results);
//   };

//   reader.onerror = function() {
//     console.log(reader.error);
//   };
// };

// function readable(data){
//   let events = []
//   for(let i = 0; i < data.length; i++){
//     console.log(data[i]);
//     events[i] = {};
//     events[i]["title"] = data[i]["SUMMARY"].substring(0,data[i]["SUMMARY"].lastIndexOf("-"));
//     events[i]["dtstart"] = data[i]["DTSTART"]
//     events[i]["dtend"] = data[i]["DTEND"]
//   }
//   return events;
// }

/*
function parseICS(icsString) { 
  const lines = icsString.split('\n'); 
  const events = []; 
  let event; 
  for (let i = 0; i < lines.length; i++) { 
    const line = lines[i].trim(); 
    if (line === 'BEGIN:VEVENT') { event = {}; } 
    else if (line === 'END:VEVENT') { events.push(event); } 
    else if (event) { const match = /^([A-Z]+):(.*)$/.exec(line); 
    if (match) { const [, key, value] = match; event[key] = value; } } 
  } 
  return events; 
}
*/
export async function sendEvents(data) {                      // deletes all current events for user and replaces them with calendar
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // console.log(data);

  // const { data: returned_data, data: error1 } = await supabase.from("calendar")
  //   .delete()
  //   .eq('user_id', user.id)
  // // console.log(error1);
  
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

// export async function deleteEvents() {
//   const supabase = createServerActionClient({ cookies });
  
//   const { data: { user } } = await supabase.auth.getUser();
// }

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