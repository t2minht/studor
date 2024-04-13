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
  Title,
  Space,
  Divider,
} from "@mantine/core";
import { IconXboxX, IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modalview from "../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { leaveSession } from "../backend/study-session-backend";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Landingsg({ study_sessions, sendDataToParent }) {
  const router = useRouter();
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  const [study_sessions_hosted, setHostedStudySessions] = useState(study_sessions.hosted);
  const [study_sessions_joined, setJoinedStudySessions] = useState(study_sessions.joined);

  if (study_sessions === null) {
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }

  const leaveHandler = async (session) => {
    await leaveSession(session);
    const updatedSessions = study_sessions_joined.filter((item) => item.id !== session.id);
    setJoinedStudySessions(updatedSessions);
    sendDataToParent(session.id);
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
      <ScrollArea h={height - 120}>
        <Title order={1} pl={50} pr={50} pt={20} pb={10} fw={700}>Your Posts</Title>
        <Group pl={50} pr={50}>
          {study_sessions_hosted.map((session) => (
            <Paper shadow="md" radius="xl" p="xl" style={{ borderColor: '#800000', borderWidth: '3px' }} withBorder key={session.topic}>
              <Group pb={3} pt={3} pl={3} pr={3} miw={350} mih={300}>
                <Stack>
                  <Avatar size={100} src={session.host_avatar_url} />
                </Stack>
                <Stack maw={210}>
                  <Stack>
                    <Text fw={700} size="xl">
                      {session.topic}
                    </Text>
                    <Text mt={-10} fw={700}>
                      Class:{" "}
                      {session.department +
                        " " +
                        session.course_number +
                        (session.section ? " - " + session.section : "")}{" "}
                    </Text>
                    <Text aria-label="Location" mt={-15}>Location: {session.location}</Text>
                    <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                    <Text mt={-15}>
                      Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}
                    </Text>
                    <Text mt={-15}>
                      Remaining: {session.max_group_size - session.current_group_size} /{" "}
                      {session.max_group_size}{" "}
                    </Text>
                  </Stack>
                  <Group>
                    <Modalview current={session} />
                    <Link
                      href={{
                        pathname: "/studor/updatestudygroupposting",
                        query: session
                      }}
                    ><Button color="yellow" radius="xl">Edit</Button></Link>
                  </Group>
                </Stack>
              </Group>
            </Paper>
          ))}
        </Group>
        <Space h="md" />
        <Space h="md" />
        <Divider my="md" size="md" />
        <Title order={1} pl={50} pr={50} pt={20} pb={10} fw={700}>Joined Sessions</Title>
        <Group pl={50} pr={50}>
          {study_sessions_joined.map((session) => (
            <Paper shadow="md" radius="xl" p="xl" style={{ borderColor: '#800000', borderWidth: '3px' }} withBorder key={session.topic}>
              <Group p={5} pl={10} pr={10} miw={350} mih={250}>
                <Stack>
                  <Avatar size={100} src={session.host_avatar_url} />
                </Stack>
                <Stack maw={210}>
                  <Stack>
                    <Text fw={700} size="xl">
                      {session.topic}
                    </Text>
                    <Text mt={-10} fw={700}>
                      Class:{" "}
                      {session.department +
                        " " +
                        session.course_number +
                        (session.section ? " - " + session.section : "")}{" "}
                    </Text>
                    <Text mt={-15}>Location: {session.location}</Text>
                    <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                    <Text mt={-15}>
                      Time: {convertTo12HourFormat(session.start_time)} -{" "}
                      {convertTo12HourFormat(session.end_time)}
                    </Text>
                    <Text mt={-15}>
                      Remaining: {session.max_group_size - session.current_group_size} /{" "}
                      {session.max_group_size}{" "}
                    </Text>
                  </Stack>
                  <Group>
                    <Modalview current={session} />
                    <Button color="red" radius="xl" onClick={() => leaveHandler(session)}>Leave</Button>
                  </Group>
                </Stack>
              </Group>
            </Paper>
          ))}
        </Group>
      </ScrollArea>
    </MantineProvider>
  );
}
