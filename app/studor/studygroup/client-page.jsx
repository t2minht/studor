"use client";
import {
    Center,
    MantineProvider,
    Drawer,
    ActionIcon,
    Switch,
    Grid,
    Stack,
    Avatar,
    Group,
    Text,
    Button,
    ScrollArea,
    Paper,
    Space,
} from "@mantine/core";
import { IconXboxX, IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modalview from "../../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { joinSession } from "@/app/backend/study-session-backend";
import Calendar from "@/app/ui/calendar";
import Filter from "@/app/studor/studygroup/filter"
import { handleSubmit } from "./filter"

export default function ClientPage(data) {
    const [opened, { open, close }] = useDisclosure(false);
    const { height, width } = useViewportSize();
    const [checked, setChecked] = useState(true);

    const [study_sessions, setStudySessions] = useState(data.study_sessions);
    const [update_events, setUpdateEvents] = useState(false);
    const [dataFromChild, setDataFromChild] = useState(data.study_sessions);

    const [calendarKey, setCalendarKey] = useState(0);
    const [all_study_sessions, setAllStudySessions] = useState(data.all_study_sessions);


    function handleDataFromChild(filtered_posts) {
        setDataFromChild(filtered_posts);
    }

    const joinHandler = async (session) => {
        setUpdateEvents(true);
        const joined = await joinSession(data = { session });
        if (!joined) {
            alert("Study session is currently full, sorry!")
        } else {
            const updatedSessions = study_sessions.filter((item) => item.id !== session.id);
            console.log('updatedSessions')
            setStudySessions(updatedSessions);
            setDataFromChild(updatedSessions);

            const updatedAllStudySessions = [...all_study_sessions, session];
            setAllStudySessions(updatedAllStudySessions);
        }
        setUpdateEvents(false);

    }

    const handleRemoveSession = (session) => {
        // const updatedSessions = study_sessions.filter((item) => item.id !== session.id);
        // console.log('howdy')
        // Log the updated study_sessions
        // console.log("Updated study_sessions:", updatedSessions);

        // // Update the state with the filtered sessions
        // setStudySessions(updatedSessions);
    }

    useEffect(() => {
        // Update the calendar key to force re-render when tutoring sessions change
        setCalendarKey(calendarKey + 1);
    }, [all_study_sessions]);

    if (study_sessions === null) {
        return (

            (
                <Group>
                    <Text>Nothing to see here</Text>
                </Group>
            )
        )
    }

    function convertTo12HourFormat(timeString) {
        // Split the string into hours and minutes
        var parts = timeString.split(":");
        var hours = parseInt(parts[0]);
        var minutes = parseInt(parts[1]);

        // Convert hours to 12-hour format
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)

        // Construct the new time string
        var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

        return formattedTime;
    }

    function formatDate(inputDate) {
        // Create a new Date object from the input string
        var dateObj = new Date(inputDate);
        dateObj.setDate(dateObj.getDate() + 1);
        // Format the date using options
        var options = { month: 'long', day: '2-digit', year: 'numeric' };
        var formattedDate = dateObj.toLocaleDateString('en-US', options);

        return formattedDate;
    }


    return (
        <MantineProvider>
            <Center pl={50} pr={50}>
                <h1>Study Groups</h1>
            </Center>

            <Grid overflow="hidden">
                <Grid.Col span="content" mt={30} mr={70}>
                    <Stack pl={20}>
                        <Filter departments={data.departments} study_sessions={data.study_sessions} sendDataToParent={handleDataFromChild} />
                        <Switch
                            checked={checked}
                            onChange={(event) => setChecked(event.currentTarget.checked)}
                            defaultChecked
                            color="#800000"
                            label="Show calendar"
                            mb={20}
                        />
                        <Group>
                            <Button
                                variant="filled"
                                component="a"
                                href="/studor/newstudygroupposting"
                                color="#800000"
                            >
                                New Study Group Post
                            </Button>
                        </Group>
                    </Stack>
                </Grid.Col>

                <Grid.Col span="auto" order={{ base: 3 }} miw={485}>
                    <Group miw={200}>
                        <ScrollArea h={height - 160}>
                            <Group pl={50} pr={50}>
                                {dataFromChild
                                    .filter((session) => session.current_group_size < session.max_group_size)
                                    .map((session) => (
                                        <Paper shadow="xl" radius="xl" p="xl" withBorder key={session.topic}>
                                            <Group pb={3} pt={3} pl={3} pr={3} miw={350} mih={300}>
                                                <Stack>
                                                    <Avatar size={100} src={session.host_avatar_url} />
                                                </Stack>
                                                <Stack maw={210}>
                                                    <Stack>
                                                        <Text fw={700} size="xl" style={{ wordWrap: "break-word" }}>
                                                            {session.topic}
                                                        </Text>
                                                        <Text mt={-10} fw={700}>
                                                            Class: {session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}
                                                        </Text>
                                                        <Text mt={-15}>Location: {session.location}</Text>
                                                        <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                                                        <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                                                        <Text mt={-15}>Remaining: {session.max_group_size - session.current_group_size} / {session.max_group_size} </Text>
                                                    </Stack>
                                                    <Group align="center">
                                                        <Modalview current={session} />
                                                        {/* <JoinSessionButton session={session} onClick={() => handleRemoveSession(session)} /> */}
                                                        <Button
                                                            variant="filled"
                                                            size="sm"
                                                            color="#009020"
                                                            radius="xl"
                                                            onClick={() => joinHandler(session)}
                                                        >
                                                            Join
                                                        </Button>
                                                    </Group>
                                                </Stack>
                                            </Group>
                                        </Paper>




                                    ))}
                            </Group>
                        </ScrollArea>
                    </Group>
                </Grid.Col>

                {checked && (
                    <Grid.Col span="content" order={{ base: 2 }} maw={700} miw={600}>
                        <Calendar key={calendarKey} events={data.events} study_sessions={all_study_sessions} tutoring={data.all_tutoring}colors={data.colors}></Calendar>
                    </Grid.Col>
                )}
            </Grid>
            <Space h="md" />
        </MantineProvider>
    );
}