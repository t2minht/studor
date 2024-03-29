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
import { useState } from "react";
import Calendar from "@/app/ui/calendar";
import { joinSession } from "@/app/backend/tutoring-backend";
import Modaltutor from "@/app/ui/modaltutor";

export default function ClientPage(data) {
  const [opened, { open, close }] = useDisclosure(false);
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  const [tutor_sessions, setTutorSessions] = useState(data.tutor_sessions);


  const joinHandler = async (session) => {
    const joined = await joinSession(data = { session });
    if (!joined) {
      alert("Tutoring Session is full, sorry")
    } else {
      const updatedSessions = tutor_sessions.filter((item) => item.id !== session.id);
      setTutorSessions(updatedSessions);
    }

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

  if (data.tutor_sessions === null) {
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }

  return (
    <MantineProvider>
      <Center>
        <h1>Tutoring</h1>
      </Center>

      <Grid overflow="hidden">
        <Grid.Col span="content">
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
                href="/studor/newtutorposting"
                color="#800000"
              >
                New Tutor Post
              </Button>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto" order={{ base: 3 }}>
          <Group miw={200}>
            <ScrollArea h={height - 180}>
              <Group>

                {tutor_sessions
                  .filter((session) => session.current_group_size < session.max_group_size)
                  .map((session) => (
                    <Group p={30} key={session.id}>
                      <Stack>
                        <Avatar size={100} src={session.tutor_avatar_url} />
                      </Stack>
                      <Stack>
                        <Stack>
                          <Text fw={700} size="xl">
                            {session.title}
                          </Text>
                          <Text mt={-10} fw={700}>
                            Class: {session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}
                          </Text>
                          <Text mt={-15}>Location: {session.location}</Text>
                          <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                          <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                          <Text mt={-15}>Remaining: {session.max_group_size - session.current_group_size} / {session.max_group_size-1}</Text>
                          <Group mt={-15}>
                            <Text>Tutor: {session.users.full_name}</Text>
                            {session.verified && <IconDiscountCheckFilled style={{ color: "#228be6", marginLeft:"-10" }} />}
                          </Group>
                          <Group mt={-15}>
                            <Text>Tutor Rating: 3.5</Text>
                            <Rating value={3.5} fractions={2} ml={-10} readOnly />
                          </Group>
                        </Stack>
                        <Group>
                          <Modaltutor current={session} />
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
          <Grid.Col span={6} order={{ base: 2 }} mt={30} maw={600} miw={600}>
            <Calendar events = {data.events} study_sessions={data.all_study_sessions} tutoring = {data.all_tutoring}></Calendar>
          </Grid.Col>
        )}
      </Grid>
    </MantineProvider>
  );
}
