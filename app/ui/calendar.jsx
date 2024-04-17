import React, { useState, useEffect, useRef } from 'react';
import { DayPilotCalendar, DayPilot } from 'daypilot-pro-react';
import { MantineProvider, Container, Group, Button, Text, Stack, ColorPicker, Modal, Space} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { retrieveUserEvents, sendEvents} from '../backend/calendar-backend';
import './cells.css';

const Calendar = ({events, study_sessions, tutoring, colors}) => {

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    const [wed, setWed] = useState(new Date());
    const [sun, setSun] = useState(new Date());

    const [startDate, setStartDate] = useState(() => { // Initial date for the calendar or stored date
        const storedDate = sessionStorage.getItem("SelectedStartDate");
        return storedDate ? new Date(storedDate) : new Date();
      });

    const [isoEvents, setEvents] = useState(events.events);

    const handlePreviousWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7); // Go back one week
        setStartDate(newStartDate);
        getWed(newStartDate);
        sessionStorage.setItem("SelectedStartDate", newStartDate);
    };
    
    const handleNextWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + 7); // Go forward one week
        setStartDate(newStartDate);
        getWed(newStartDate);
        getSun(newStartDate);
        sessionStorage.setItem("SelectedStartDate", newStartDate);
    };
    
    const resetWeek = () => {
        const newStartDate = new Date();
        setStartDate(newStartDate);
        getWed(newStartDate);
        getSun(newStartDate);
        sessionStorage.setItem("SelectedStartDate", newStartDate);
    };

    const getWed = (date) =>{
        const currDate = date.getDay();
        // console.log(currDate);
        var diff = 3 - currDate;
        if (diff < 0) {
          diff += 7;
        }
        const wedDate = new Date(date);
        wedDate.setDate(date.getDate() + diff);
        // console.log(wedDate);
        setWed(wedDate);
    }
    const getSun = (date) =>{
        const currDate = date.getDay();
        // console.log(currDate);
        var diff = 0 - currDate;
        // if (diff < 0) {
        //   diff += 7;
        // }
        const sunDate = new Date(date);
        sunDate.setDate(date.getDate() - currDate);
        // console.log(wedDate);
        setSun(sunDate);
    }

    const getWeek = () =>{
        let sunday = sun;
        let saturday = new Date(sunday);
        saturday.setDate(saturday.getDate() + 6)
        let output = "" + monthNames[sunday.getMonth()] + " " + sunday.getDate();
        if(sunday.getFullYear() != saturday.getFullYear()){
            output+= ", " + sunday.getFullYear();
        }
        output += " - ";
        if(sunday.getMonth() != saturday.getMonth()){
            output += monthNames[saturday.getMonth()];
        }
        output += " " + saturday.getDate() + ", " + saturday.getFullYear();
        return output;
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
        let textColor = '#FFFFFF';
        // console.log(color);
        let lightColors = ['#FFFFFF', '#FFFF00', '#00FF00', '#00FFFF','#CCCCCC', '#F9CB9C', '#FFE599', '#D5A6BD'];
        // console.log(lightColors.includes(color));
        
        if(lightColors.includes(color)){
            // console.log("changing color");
            textColor = "#000000";
        }
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
                eventsList.push({id: id++, text: title, start: session.date + "T" + session.start_time, end: session.date + "T" + session.end_time, tags: event_tag, backColor: color, fontColor: textColor});
            // }
        });
        return eventsList, id;
    }

    const [calendarEvents, setCalendar] = useState([]);
    // const [id, setID] = useState(0);

    useEffect(() => {                               // displays events
        // console.log("events");
        let parser = JSON.parse(isoEvents);
        let id = 1;
        // console.log(parser);

        let eventsList = [];
        if (events.events != '[{}]' && events.events != null){
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

                            eventsList.push({id: id++, text: event.text, start: DoWday + event.start.substring(10), end: DoWday + event.end.substring(10), backColor: event.backColor, fontColor:event.fontColor, tags: "Class", bubbleHtml:"Click for more Information"});
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
        // console.log("colors");
        // console.log(colors);
        eventsList, id = addSession(eventsList, study_sessions, id, "Study Session", colors.study_session_color); // "#339af0"
        eventsList, id = addSession(eventsList, tutoring, id, "Tutoring", colors.tutor_session_color); // "#078787"
        // console.log(eventsList);
        getSun(startDate);
        getWed(startDate);
        setCalendar(eventsList);
    }, [startDate, isoEvents]);


    /*
    useEffect(async() => {
        // Fetch events from an API or database
        // let events = retrieveUserEvents();
        // console.log(events);
        // setCalendar(retrieveUserEvents());
        const fetchedEvents = await retrieveUserEvents();
        console.log(fetchedEvents);
        // const fetchedEvents = [
        // { id: 1, text: 'Event 1', start: '2024-03-20T10:00:00', end: '2024-03-20T12:00:00' },
        // { id: 2, text: 'Event 2', start: '2024-03-21T14:00:00', end: '2024-03-21T16:00:00' },
        // ];

        // setCalendar(fetchedEvents);
    }, []);

    */

    const [event, setEvent] = useState({event:"", id: 0});

    const [config, setConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        headerDateFormat:"ddd \n MM/dd",
        eventClickHandling: "Enabled",
        // dayBeginsHour: 8,
        // dayEndsHour:18,
        // watchWidthChanges: true,
        showCurrentTime: true,
        showCurrentTimeMode: "Full",
        businessBeginsHour: 8,
        onEventClick: (args) => {
            if(args.e.data.tags == "Class"){
                classHandler.open();
                handlers.open();
                setEvent({event: args.e.data.tags, id: args.e.data.id,text: args.e.data.text, start: args.e.data.start.value, end: args.e.data.end.value});

            }else{
                classHandler.close();
                handlers.open();
                console.log(args.e.data);
                setEvent({event: args.e.data.tags, id: args.e.data.id,text: args.e.data.text, start: args.e.data.start.value, end: args.e.data.end.value});
            }
        },
        eventHoverHandling: "Bubble",
        onBeforeCellRender: (args) => {
            if (args.cell.start.getDatePart().getTime() === new DayPilot.Date().getDatePart().getTime()) {
              args.cell.backColor = "#dddddd";
            }
        },

    });

    const calendarRef = useRef();


    const [opened, handlers] = useDisclosure(false);
    const [isClass, classHandler] = useDisclosure(false); 

    const [value, onChange] = useState("#FFFFFF");

    function colorChoice(color){
        let textColor = '#FFFFFF';
        // console.log(color);
        let lightColors = ['#FFFFFF', '#FFFF00', '#00FF00', '#00FFFF','#CCCCCC', '#F9CB9C', '#FFE599', '#D5A6BD'];
        // console.log(lightColors.includes(color));
        
        if(lightColors.includes(color)){
            // console.log("changing color");
            textColor = "#000000";
        }
        // console.log(calendarEvents);
        // console.log("isoEvents")
        // console.log(JSON.parse(isoEvents));
        let parser = JSON.parse(isoEvents);
        for(let i = 0; i < parser.length; i++){
            if(parser[i].text == event.event){
                parser[i].backColor = color;
                parser[i].fontColor = textColor;
                // calendarEvents[i].backColor = color;
                // calendarEvents[i].fontColor = textColor;
            }
        }
        for(let i = 0; i < calendarEvents.length; i++){
            if(calendarEvents[i].text == event.event){
                calendarEvents[i].backColor = color;
                calendarEvents[i].fontColor = textColor;
                // calendarEvents[i].backColor = color;
                // calendarEvents[i].fontColor = textColor;
            }
        }
        // console.log("parser")
        // console.log(parser)
        // calendarRef.current.control.update({startDate, events: calendarEvents});
        setEvents(JSON.stringify(parser));
        sendEvents(JSON.stringify(parser));
        handlers.close();
    }

    return (
        <>
            <Stack>
                <Group justify="space-between">
                    <Group>
                        <Button
                            type='submit'
                            variant="filled"
                            color='#800000'
                            onClick={handlePreviousWeek}
                        >
                            {"<"}
                        </Button>
                        <Button
                            type='submit'
                            variant="filled"
                            color='#800000'
                            onClick={handleNextWeek}
                        >
                            {">"}
                        </Button>
                    </Group>
                    {/* <Text fw={700} size='xl'>{monthNames[(new Date(wed)).getMonth()] + " " + (new Date(wed)).getFullYear()}</Text> */}
                    {/* <Text fw={700} size='xl'>{monthNames[(new Date(sun)).getMonth()] + " " + (new Date(sun)).getDate() + " " + (new Date(wed)).getFullYear()}</Text> */}
                    <Text fw={700} size='xl'>{getWeek()}</Text>
                    <Button
                        type='submit'
                        variant="filled"
                        color='#800000'
                        onClick={resetWeek}
                    >
                        Current Week
                    </Button>
                </Group>
                <Modal opened={opened} onClose={() => handlers.close()} title={event.event}>
                    <Stack align='center'>
                        <Text align='center'>
                            {event.text}
                            <br/>
                            Start Time: {new Date(event.start).toLocaleTimeString().substring(0, new Date(event.start).toLocaleTimeString().indexOf(" ") -3) + new Date(event.start).toLocaleTimeString().substr(-3)}
                            <br/>
                            End Time: {new Date(event.end).toLocaleTimeString().substring(0, new Date(event.end).toLocaleTimeString().indexOf(" ") -3) + new Date(event.end).toLocaleTimeString().substr(-3)}
                        </Text>
                        {/* <Text>{event.text}</Text>
                        <Text>Start Time: {new Date(event.start).toLocaleTimeString()}</Text>
                        <Text>End Time: {new Date(event.end).toLocaleTimeString()}</Text> */}
                        {isClass && (
                            <Text>Select a color</Text>
                        )}
                        {isClass && (
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
                        )}
                        
                    </Stack>
                </Modal>
                
                
                <DayPilotCalendar
                    {...config} 
                    events={calendarEvents} 
                    startDate = {startDate} 
                    useEventBoxes={"Never"}
                    ref={calendarRef}
                />
            </Stack>
        </>
    );
}

export default Calendar;
