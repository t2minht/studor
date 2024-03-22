import React, { useState, useEffect, useRef } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { MantineProvider, Container} from "@mantine/core";
import { retrieveUserEvents } from '../backend/calendar-backend';

const Calendar = ({events}) => {

    const calendarRef = useRef();

    const [config, setConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        headerDateFormat:"ddd \n MM/dd/yyyy",
        useEventBoxes: "Never",
        snapToGrid: false
    });

    const [startDate, setStartDate] = useState(new Date()); // Initial date for the calendar

    const handlePreviousWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7); // Go back one week
        setStartDate(newStartDate);
    };

    const handleNextWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + 7); // Go forward one week
        setStartDate(newStartDate);
    };

    function getDatesForWeek() {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    
        const datesForWeek = [];
        for (let i = 0; i < 7; i++) {
            const diff = i - currentDay;
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + diff);
            datesForWeek[days[i]] = date;
        }
    
        return datesForWeek;
    }

    const [calendarEvents, setEvents] = useState([]);

    // console.log(events.events);
    // setEvents(events.events);

    useEffect(() => {
        let parser = JSON.parse(events.events);
        console.log(parser[1]);
        let id = 1;
        console.log(startDate);

        // var pre = 
        // startDate.getFullYear().toString() +
        // ((startDate.getMonth() + 1)<10? "0" + (startDate.getMonth() + 1).toString():(startDate.getMonth() + 1).toString()) + 
        // ((startDate.getDate() + 1)<10? "0" + startDate.getDate().toString():startDate.getDate().toString());

        // var post = (startDate.getHours()).toString().padStart(2, '0') + startDate.getMinutes().toString().padStart(2, '0') + "00";

        // console.log(startDate.getHours());
        // console.log(startDate.getMinutes());
        // console.log(pre + "T" + post + "Z");

        let eventsList = [];

        for(let i = 0; i < parser.length; i++){
            if(parser[i].RRULE != ""){  // recursion rule exists -> ics/class data
                let temp = parser[i].DTSTART
                let dateString = temp.substr(0,4) + "-" + temp.substr(4,2) + "-" + temp.substr(6,5) + ":" + temp.substr(11,2) + ":" + temp.substr(13,2) + ".000Z";
                let semesterStartDate = new Date(dateString);

                temp = parser[i].RRULE;
                temp = temp.substr(temp.search("UNTIL") + 6, 16)
                dateString = temp.substr(0,4) + "-" + temp.substr(4,2) + "-" + temp.substr(6,5) + ":" + temp.substr(11,2) + ":" + temp.substr(13,2) + ".000Z";
                let semesterEndDate = new Date(dateString);

                if(startDate > semesterStartDate && startDate < semesterEndDate){
                    temp = parser[i].DTSTART;
                    // console.log(parser[i].SUMMARY);
                    // console.log( temp.substr(8,3) );
                    let dtstart = "T" + ( ( Number(temp.substr(9,2) ) - 6 ) + "" ).padStart(2, '0') + ":" + temp.substr(11,2) + ":" + temp.substr(13,3);
                    temp = parser[i].DTEND;
                    let dtend = "T" + ( ( Number( temp.substr(9,2) ) - 6 ) + "" ).padStart(2, '0') + ":" + temp.substr(11,2) + ":" + temp.substr(13,3);
                    // console.log(dtstart);
                    // console.log(dtend);

                    temp = parser[i].RRULE;
                    let dates = getDatesForWeek();
                    // console.log(dates);
                    temp.substring(temp.search("BYDAY") + 6).split(",").map((day) => {
                        // console.log("Day: " + dates[day]);
                        // console.log("Month: " + (dates[day].getMonth() + 1) );
                        // console.log(typeof dates[day].getMonth());
                        let year = dates[day].getFullYear() + "";
                        let month = dates[day].getMonth() + 1 + "";
                        let dy = dates[day].getDate() + "";
                        let DoWday = year.padStart(2,'0') + "-" + month.padStart(2, '0') + "-" + dy.padStart(2,'0');
                        // console.log("DoWDay: " + DoWday);
                        eventsList.push({id: id++, text: dtstart, start: DoWday + dtstart, end: DoWday + dtend});
                        // console.log({id: id++, text: parser[i].SUMMARY, start: DoWday + dtstart, end: DoWday + dtend});

                        // console.log(parser[i].SUMMARY + " " + day);
                        // console.log(DoWday + dtstart);

                        // console.log(new Date(DoWday + dtstart));
                        // console.log(eventsList);
                    });
                    
                }
            }
            // console.log(eventsList);
        }
        console.log(eventsList);
        setEvents(eventsList);
    }, []);


    /*
    useEffect(async() => {
        // Fetch events from an API or database
        // let events = retrieveUserEvents();
        // console.log(events);
        // setEvents(retrieveUserEvents());
        const fetchedEvents = await retrieveUserEvents();
        console.log(fetchedEvents);
        // const fetchedEvents = [
        // { id: 1, text: 'Event 1', start: '2024-03-20T10:00:00', end: '2024-03-20T12:00:00' },
        // { id: 2, text: 'Event 2', start: '2024-03-21T14:00:00', end: '2024-03-21T16:00:00' },
        // ];

        // setEvents(fetchedEvents);
    }, []);

    */

    return (
        <div>
            <div>
                <button onClick={handlePreviousWeek}>Previous Week</button>
                <button onClick={handleNextWeek}>Next Week</button>
            </div>j
            <DayPilotCalendar
             {...config} 
                events={calendarEvents} 
                startDate = {startDate} 
                useEventBoxes={"Never"}
                snapToGrid={false}
            />
        </div>
    );
}

export default Calendar;