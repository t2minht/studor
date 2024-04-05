'use server'
import { NextResponse } from "next/server";
import path from "path";
import { exit } from "process";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import { error } from "console";

export async function sendManualClasses(data) {                      // deletes all current events for user and replaces them with calendar
    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
  
    console.log(data);
  
    // const { data: returned_data, data: error1 } = await supabase.from("calendar")
    //   .delete()
    //   .eq('user_id', user.id)
    // // console.log(error1);
    
    // check if user has a calendar entry
      const { data: classes } = await supabase
      .from('manual_classes')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // if user does not have a calendar entry, create one
    if (!classes) {
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
        console.log("error2: " + JSON.stringify(error2));
      }
    else {
        // if user has a calendar entry, update the events
        const {error: error3 } = await supabase
          .from('manual_classes')
          .update({
            classes: data
          })
          .eq('user_id', user.id);
          console.log("error3: " + error3);
      
    }
}




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