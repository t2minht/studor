// Import necessary modules
'use server'
import { NextResponse } from "next/server";
import path from "path";
import { exit } from "process";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import { error } from "console";


export async function calendarDataUpload() {
  console.log("arrived at function");
  let reader = new FileReader();
  reader.readAsText(data);
  let results;
  reader.onload = function() {
    console.log("results")
    results = JSON.stringify(parseICS(reader.result))
    console.log(results);
    sendEvents(results);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
};

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

  

  const { data: returned_data, data: error1 } = await supabase.from("calendar")
    .delete()
    .eq('user_id', user.id)
  console.log(error1);

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

    console.log(error2);
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
      throw error1;
    }

    // console.log(data1);

    return data1;

  } catch (error) {
    console.log('error', error);
    throw error;
  }
}