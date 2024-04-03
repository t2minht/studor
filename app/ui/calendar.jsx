import React, { useState, useEffect, useRef } from 'react';
import { DayPilotCalendar, DayPilot } from 'daypilot-pro-react';
import { MantineProvider, Container, Group, Button, Text, Stack, ColorPicker, Modal} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { retrieveUserEvents } from '../backend/calendar-backend';

const Calendar = ({events, study_sessions, tutoring}) => {

    const [calendar, setCalendar] = useState();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    const [sunday, setWed] = useState(new Date());

    const [startDate, setStartDate] = useState(new Date()); // Initial date for the calendar

    const handlePreviousWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7); // Go back one week
        setStartDate(newStartDate);
        getWed(newStartDate);

    };

    const handleNextWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + 7); // Go forward one week
        setStartDate(newStartDate);
        getWed(newStartDate);
    };

    const getWed = (date) =>{
        const currDate = date.getDay();
        console.log(currDate);
        var diff = 3 - currDate;
        if (diff < 0) {
          diff += 7;
        }
        const wedDate = new Date(date);
        wedDate.setDate(date.getDate() + diff);
        console.log(wedDate);
        setWed(wedDate);
    }

    function getDatesForWeek() {
        const currentDay = startDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    
        const datesForWeek = [];
        for (let i = 0; i < 7; i++) {
            const diff = i - currentDay;
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + diff);
            datesForWeek[days[i]] = date;
        }
    
        return datesForWeek;
    }

    function addSession(eventsList, sessions, id, event_tag, color){
        sessions.map((session) =>{
            // console.log(session.date + "T" + session.start_time);
            // console.log(session.date + "T" + session.end_time);
            let dateString = session.date + "T" + session.end_time;
            let eventDate = new Date(dateString);
            
            const newStartDate = new Date(startDate);
            newStartDate.setDate(newStartDate.getDate() + 7);
            let title = session.title;
            if(title === undefined){
                title = session.topic;
            }

            // if( startDate < eventDate && eventDate < newStartDate ){
                eventsList.push({id: id++, text: title, start: session.date + "T" + session.start_time, end: session.date + "T" + session.end_time, tags: event_tag, backColor: color});
            // }
        });
        return eventsList, id;
    }

    const [calendarEvents, setEvents] = useState([]);
    // const [id, setID] = useState(0);

    useEffect(() => {                               // displays events
        // console.log("events");
        // console.log(events);
        let parser = JSON.parse(events.events);
        let id = 1;
        console.log(parser);

        let eventsList = [];
        if (events.events != '[{}]' ){
            for(let i = 0; i < parser.length; i++){
                let event = parser[i];
                if('rrule' in event){

                    let semesterStartDate = new Date(event.start + ".000");

                    let temp = event.rrule;
                    temp = temp.substr(temp.search("UNTIL") + 6, 16)
                    let endString = temp.substr(0,4) + "-" + temp.substr(4,2) + "-" + temp.substr(6,5) + ":" + temp.substr(11,2) + ":" + temp.substr(13,2) + ".000";
                    let semesterEndDate = new Date(endString);

                    if(startDate > semesterStartDate && startDate < semesterEndDate){
                        let dates = getDatesForWeek();
                        event.rrule.substring( event.rrule.search("BYDAY") + 6).split(",").map((day) => {
                            let year = dates[day].getFullYear() + "";
                            let month = dates[day].getMonth() + 1 + "";
                            let dy = dates[day].getDate() + "";
                            let DoWday = year.padStart(2,'0') + "-" + month.padStart(2, '0') + "-" + dy.padStart(2,'0');

                            eventsList.push({id: id++, text: event.text, start: DoWday + event.start.substring(10), end: DoWday + event.end.substring(10), backColor: "#cccccc", tags: "Class"});
                        });
                    }

                }
            }

        }
        /*
        // if (events.events != '[{}]' ){
        //     for(let i = 0; i < parser.length; i++){   //adds ics and manually added classes
        //         console.log(parser[i]);
        //         if(parser[i].RRULE != ""){  // recursion rule exists -> ics/class data
        //             let temp = parser[i].DTSTART
        //             let dateString = temp.substr(0,4) + "-" + temp.substr(4,2) + "-" + temp.substr(6,5) + ":" + temp.substr(11,2) + ":" + temp.substr(13,2) + ".000Z";
        //             let semesterStartDate = new Date(dateString);
    
        //             temp = parser[i].RRULE;
        //             temp = temp.substr(temp.search("UNTIL") + 6, 16)
        //             dateString = temp.substr(0,4) + "-" + temp.substr(4,2) + "-" + temp.substr(6,5) + ":" + temp.substr(11,2) + ":" + temp.substr(13,2) + ".000Z";
        //             let semesterEndDate = new Date(dateString);
    
        //             if(startDate > semesterStartDate && startDate < semesterEndDate){
        //                 temp = parser[i].DTSTART;
        //                 let dtstart = "T" + ( ( Number(temp.substr(9,2) ) - 6 ) + "" ).padStart(2, '0') + ":" + temp.substr(11,2) + ":" + temp.substr(13,3);
        //                 temp = parser[i].DTEND;
        //                 let dtend = "T" + ( ( Number( temp.substr(9,2) ) - 6 ) + "" ).padStart(2, '0') + ":" + temp.substr(11,2) + ":" + temp.substr(13,3);
        //                 temp = parser[i].RRULE;
        //                 let dates = getDatesForWeek();
        //                 temp.substring(temp.search("BYDAY") + 6).split(",").map((day) => {
        //                     let year = dates[day].getFullYear() + "";
        //                     let month = dates[day].getMonth() + 1 + "";
        //                     let dy = dates[day].getDate() + "";
        //                     let DoWday = year.padStart(2,'0') + "-" + month.padStart(2, '0') + "-" + dy.padStart(2,'0');
        //                     eventsList.push({id: id++, text: parser[i].SUMMARY, start: DoWday + dtstart, end: DoWday + dtend});
        //                 });
                        
        //             }
        //         }
        //     }
        // }
        // eventsList, id = addSession(eventsList, study_sessions, id);
        // eventsList, id = addSession(eventsList, tutoring, id);
        */

        eventsList, id = addSession(eventsList, study_sessions, id, "Study Session", "#339af0");
        eventsList, id = addSession(eventsList, tutoring, id, "Tutoring", "#078787");
        console.log(eventsList);

        setEvents(eventsList);
    }, [startDate]);


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

    const [event, setEvent] = useState({event:"", id: 0});

    const [config, setConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        headerDateFormat:"ddd \n MM/dd",
        eventClickHandling: "Enabled",
        onEventClick: (args) => {
            console.log(args.e);
            console.log(args.e.data.tags);
            if(args.e.data.tags == "Class"){
                handlers.open();
                setEvent({event: args.e.data.text, id: args.e.data.id});

            }
        },
    });


    const [opened, handlers] = useDisclosure(false);

    const [value, onChange] = useState("#FFFFFF");

    function colorChoice(color){
        let textColor = "#000000";
        if(color in ['#FFFFFF', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#9900FF', '#FF00FF', 
        '#CCCCCC', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD']){
            textColor = "#FFFFFF";
        }
        
    }

    return (
        <>
            <Stack>
                <Group justify="space-between">
                    <Button
                        type='submit'
                        variant="filled"
                        color='#800000'
                        onClick={handlePreviousWeek}
                    >
                        Previous Week
                    </Button>
                    <Text fw={700} size='xl'>{monthNames[(new Date(sunday)).getMonth()] + " " + (new Date(sunday)).getFullYear()}</Text> 
                    <Button
                        type='submit'
                        variant="filled"
                        color='#800000'
                        onClick={handleNextWeek}
                    >
                        Next Week
                    </Button>
                </Group>
                <Modal opened={opened} onClose={() => handlers.close()} title={event.event}>
                    <Stack align='center'>
                        <Text>Select a color</Text>
                        <ColorPicker 
                            format="hex"
                            
                            value={value}
                            onChange={(color) => colorChoice(color)}
                            withPicker={false}
                            swatchesPerRow={9}
                            swatches={[
                                '#FFFFFF', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#9900FF', '#FF00FF', 
                                '#CCCCCC', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD', 
                                '#666666', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79', 
                                '#000000', '#990000', '#B45f06', '#BF9000', '#38761D', '#134F5C', '#114297', '#351C75', '#741B47', 
                            ]}
                        />
                    </Stack>
                </Modal>
                <DayPilotCalendar
                    {...config} 
                    events={calendarEvents} 
                    startDate = {startDate} 
                    useEventBoxes={"Never"}
                    controlRef= {setCalendar}
                />
            </Stack>
        </>
    );
}

export default Calendar;
