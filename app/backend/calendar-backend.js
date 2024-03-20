// Import necessary modules
import { NextResponse } from "next/server";
import path from "path";
import { exit } from "process";

export async function calendarDataUpload(data) {
  console.log("arrived at function");
  let reader = new FileReader();
  reader.readAsText(data);
  let results;
  reader.onload = function() {
    console.log("results")
    results = JSON.stringify(parseICS(reader.result))
    // console.log(readable(results));
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
};
/*
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
*/

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
export async function retrieveEvents() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split('T')[0];
  const currentTime = currentDateTime.toTimeString().split(' ')[0];



  try {
    const notParticipantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .neq('user_id', user.id);

    const { data: notParticipantSessionsData, error: notParticipantSessionsError } = await notParticipantSessionsQuery;
    const notParticipantSessionIdsSet = new Set(notParticipantSessionsData.map(entry => entry.study_session_id));

    const participantSessionsQuery = supabase
      .from('participants_in_study_session')
      .select('study_session_id')
      .eq('user_id', user.id);

    const { data: participantSessionsData, error: participantSessionsError } = await participantSessionsQuery;
    const participantSessionIdsSet = new Set(participantSessionsData.map(entry => entry.study_session_id));

    const notInSessionsSet = setDifference(notParticipantSessionIdsSet, participantSessionIdsSet);
    const notInSessionsArray = Array.from(notInSessionsSet);


    const { data: futureData, error: error1 } = await supabase
      .from('study_sessions')
      .select()
      .gt('date', currentDate)
      .in('id', notInSessionsArray)
      .order('date')
      .order('end_time');

    const { data: todaysData, error: error2 } = await supabase
      .from('study_sessions')
      .select()
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