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
  Rating,
  Paper,
  Modal
} from "@mantine/core";
import {
  IconXboxX,
  IconFilter,
  IconDiscountCheckFilled,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Calendar from "@/app/ui/calendar";
import { joinSession } from "@/app/backend/tutoring-backend";
import Modaltutor from "@/app/ui/modaltutor";
import TutorFilter from "@/app/studor/tutoring/tutorFilter"
import Image from 'next/image';
import logo from '@/app/ui/floaty_logo_m.gif';

export default function ClientPage(data) {
  const [opened, handlers] = useDisclosure(false);
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(() => { return localStorage.getItem('checked') === 'true' });

  const [disabled, setDisabled] = useState(false)


  const [tutor_sessions, setTutorSessions] = useState(data.tutor_sessions);
  function handleDataFromChild(filtered_posts) {
    setTutorSessions(filtered_posts);
  }

  const [all_tutoring, setAllTutoring] = useState(data.all_tutoring);
  const [calendarKey, setCalendarKey] = useState(0);

  // joining study group post
  const joinHandler = async (session, handlers) => {
    setDisabled(true);
    const joined = await joinSession(data = { session });
    if (!joined) {
      alert("Tutoring Session is full, sorry")
    } else {
      const updatedSessions = tutor_sessions.filter((item) => item.id !== session.id);
      setTutorSessions(updatedSessions);
      const updatedAllTutoring = [...all_tutoring, session];
      setAllTutoring(updatedAllTutoring);
      handlers.open();
      // open modal if a user has not joined a session before, using localStorage, so it doesn't open every time, check if localStorage item exists or just open
      // if (!localStorage.getItem('joinedTutorSession') || localStorage.getItem('joinedTutorSession') === 'false') {
      //     handlers.open();
      //     localStorage.setItem('joinedTutorSession', 'true');
      // }
    }
    setDisabled(false)

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

  useEffect(() => {
    // Update the calendar when the tutoring sessions change
    setCalendarKey(calendarKey + 1);
  }, [all_tutoring])

  // used for toggling calendar on and off
  useEffect(() => {
    localStorage.setItem('checked', checked)
  }, [checked])

  // placeholder if tutoring sessions are not there
  if (data.tutor_sessions === null) {
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }


  // UI components for the tutoring page such as filtering, calendar, and posts
  return (
    <MantineProvider>
      <Center pl={50} pr={50}>
        <h1>Tutoring</h1>
      </Center>

      <Grid overflow="hidden">
        <Grid.Col span="content">
          <Stack pl={20}>
            <TutorFilter departments={data.departments} study_sessions={data.tutor_sessions} sendDataToParent={handleDataFromChild} />
            <Switch
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              defaultChecked
              color="#800000"
              label="Show calendar"
              mb={20}
            />
            <Button
              variant="filled"
              component="a"
              href="/studor/newtutorposting"
              color="#800000"
            >
              New Tutor Post
            </Button>
            <Button
              variant="filled"
              component="a"
              href="/studor/faqs"
              color="#EC407A"
            >
              FAQs
            </Button>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto" order={{ base: 3 }} miw={485}>
          <Group miw={200}>
            <ScrollArea h={height - 180}>
              <Group pl={50} pr={50}>

                {tutor_sessions
                  .filter((session) => session.current_group_size < session.max_group_size)
                  .map((session) => {

                    session.averageRating = session.users.tutor_rating;
                    return (
                      <Paper shadow="xl" radius="xl" p="xl" style={{ borderColor: '#0046AB', borderWidth: '3px' }} withBorder key={session.id}>
                        <Group pb={3} pt={3} pl={3} pr={3} miw={350} mih={300}>
                          <Stack>
                            <Avatar size={100} src={session.tutor_avatar_url} />
                          </Stack>
                          <Stack maw={210}>
                            <Stack>
                              <Text fw={700} size="xl" style={{ wordWrap: "break-word" }}>
                                {session.title}
                              </Text>
                              <Text mt={-10} fw={700}>
                                Class: {session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}
                              </Text>
                              <Text mt={-15}>Location: {session.location}</Text>
                              <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                              <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                              <Text mt={-15}>Remaining: {(session.max_group_size) - session.current_group_size} / {session.max_group_size - 1}</Text>
                              <Group mt={-15}>
                                <Text>Tutor: {session.users.full_name}</Text>
                                {session.verified && <IconDiscountCheckFilled style={{ color: "#228be6", marginLeft: "-10" }} />}
                              </Group>
                              <Group mt={-15}>
                                {session.averageRating ? <Text>Tutor Rating: {session.averageRating}</Text> : <Text>Tutor Rating: No Rating</Text>}

                                {session.averageRating && <Rating value={session.averageRating} fractions={4} ml={-10} readOnly />}
                              </Group>
                            </Stack>
                            <Group>
                              <Modaltutor current={session} />
                              <Button
                                variant="filled"
                                size="sm"
                                color="#009020"
                                radius="xl"
                                disabled={disabled}
                                onClick={() => joinHandler(session, handlers)}
                              >
                                Join
                              </Button>
                            </Group>
                          </Stack>
                        </Group>
                      </Paper>
                    )
                  })}
              </Group>
            </ScrollArea>
          </Group>
        </Grid.Col>

        {checked && (
          <Grid.Col span={6} order={{ base: 2 }} mt={30} maw={600} miw={600}>
            <Calendar key={calendarKey} events={data.events} colors={data.colors} study_sessions={data.all_study_sessions} tutoring={all_tutoring} />
          </Grid.Col>
        )}
      </Grid>
      <Modal opened={opened} onClose={handlers.close} withCloseButton={false} closeOnClickOutside={true} closeOnEscape={true} >
        <stack>
          <Text ta="center">Joined Session!</Text>
          <Center>
            <Image
              src={logo}
              alt='studor logo'
              width={200}
              height={200}
            />
          </Center>

          <Text ta="center">View joined sessions on the home page</Text>

        </stack>
      </Modal>
    </MantineProvider>
  );
}
