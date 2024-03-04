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
} from "@mantine/core";
import { IconXboxX, IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modalview from "../../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { joinSession } from "@/app/backend/study-session-backend";
import Calendar from "@/app/ui/calendar";

export default function ClientPage(data) {
    const [opened, { open, close }] = useDisclosure(false);
    const { height, width } = useViewportSize();
    const [checked, setChecked] = useState(true);

    const [study_sessions, setStudySessions] = useState(data.study_sessions);

    const joinHandler = async (session) => {

        await joinSession(data = { session });
        const updatedSessions = study_sessions.filter((item) => item.id !== session.id);
        setStudySessions(updatedSessions);

    }

    const handleRemoveSession = (session) => {
        // const updatedSessions = study_sessions.filter((item) => item.id !== session.id);
        console.log('howdy')
        // Log the updated study_sessions
        // console.log("Updated study_sessions:", updatedSessions);

        // // Update the state with the filtered sessions
        // setStudySessions(updatedSessions);
    }

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
            <Center>
                <h1>Study Groups</h1>
            </Center>



            <Grid overflow="hidden">
                <Grid.Col span="content" mt={30} mr={70}>
                    <Drawer
                        opened={opened}
                        onClose={close}
                        title="Filter"
                        closeButtonProps={{
                            icon: <IconXboxX size={20} stroke={1.5} />,
                        }}
                    >
                        Filters coming soon
                    </Drawer>
                    <Stack pl={20}>
                        <ActionIcon
                            onClick={open}
                            variant="filled"
                            size="xl"
                            color="#800000"
                            aria-label="Filter"
                        >
                            <IconFilter style={{ width: "90%", height: "90%" }} stroke={2} />
                        </ActionIcon>
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

                <Grid.Col span="auto" order={{ base: 3 }}>
                    <Group miw={200}>
                        <ScrollArea h={height - 160}>
                            <Group>
                                {study_sessions
                                    .filter((session) => session.current_group_size < session.max_group_size)
                                    .map((session) => (
                                        <Group p={30} key={session.topic} maw={400}>
                                            <Stack>
                                                <Avatar size={100} />
                                            </Stack>
                                            <Stack maw={210}>
                                                <Stack>
                                                    <Text fw={700} size="xl">
                                                        {session.topic}
                                                    </Text>
                                                    <Text mt={-10} fw={700}>
                                                        Class: {session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}
                                                    </Text>
                                                    <Text mt={-15}>Location: {session.location}</Text>
                                                    <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                                                    <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                                                    <Text mt={-15}>Available: {session.max_group_size - session.current_group_size} / {session.max_group_size} </Text>
                                                </Stack>
                                                <Group align="center">
                                                    <Modalview current={session}/>
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




                                    ))}
                            </Group>
                        </ScrollArea>
                    </Group>
                </Grid.Col>

                {checked && (
                    <Grid.Col span={6} order={{ base: 2 }}>
                        <Calendar></Calendar>
                    </Grid.Col>
                )}
            </Grid>
        </MantineProvider>
    );
}