import React, { useState, useEffect, useRef } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const Calendar = () => {

    const calendarRef = useRef();

    const [config, setConfig] = useState({
        viewType: "Week",
        headerDateFormat:"ddd \n MM/dd/yyyy"
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

    //   useEffect(() => {
    //     const events = [
    //         {
    //             id: 1,
    //             text: "Event 1",
    //             start: "2024-03-20T10:30:00",
    //             end: "2024-03-20T13:00:00"
    //         },
    //         {
    //             id: 2,
    //             text: "Event 2",
    //             start: "2024-03-21T09:30:00",
    //             end: "2024-03-21T11:30:00",
    //             backColor: "#6aa84f"
    //         },
    //         {
    //             id: 3,
    //             text: "Event 3",
    //             start: "2024-03-21T12:00:00",
    //             end: "2024-03-21T15:00:00",
    //             backColor: "#f1c232"
    //         },
    //         {
    //             id: 4,
    //             text: "Event 4",
    //             start: "2024-03-22T11:30:00",
    //             end: "2024-03-22T14:30:00",
    //             backColor: "#cc4125"
    //         }
    //     ];
    
    //     const startDate = "2024-03-17";
    
    //     calendarRef.current.control.update({startDate, events});
    //   }, []);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from an API or database
        const fetchedEvents = [
        { id: 1, text: 'Event 1', start: '2024-03-20T10:00:00', end: '2024-03-20T12:00:00' },
        { id: 2, text: 'Event 2', start: '2024-03-21T14:00:00', end: '2024-03-21T16:00:00' },
        ];

        setEvents(fetchedEvents);
    }, []);


    return (
        <div>
            <div>
                <button onClick={handlePreviousWeek}>Previous Week</button>
                <button onClick={handleNextWeek}>Next Week</button>
            </div>
            <DayPilotCalendar {...config} events={events} startDate = {startDate}/>
        </div>
    );
}

export default Calendar;