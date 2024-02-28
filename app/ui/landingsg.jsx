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
import Modalview from "../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { leaveSession } from "../backend/study-session-backend";

export default function Landingsg(data) {
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  const [study_sessions_hosted, setHostedStudySessions] = useState(data.study_sessions.hosted);
  const [study_sessions_joined, setJoinedStudySessions] = useState(data.study_sessions.joined);

  if (data.study_sessions === null) {
    console.log("hi");
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }

  const deleteHandler = async (session) => {

    // await joinSession(data = { session });
    // const updatedSessions = study_sessions.filter((item) => item.id !== session.id);
    // setStudySessions(updatedSessions);

  }

  const leaveHandler = async (session) => {
    await leaveSession(data = { session });
    const updatedSessions = study_sessions_joined.filter((item) => item.id !== session.id);
    setJoinedStudySessions(updatedSessions);
  }

  return (
    <MantineProvider>
      <ScrollArea h={height - 120}>
        <h1>Your Posts</h1>
        <Group>
          {study_sessions_hosted.map((session) => (
            <Group p={30} key={session.topic}>
              <Stack>
                <Avatar size={100} />
              </Stack>
              <Stack>
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
                  <Text mt={-15}>Date: {session.date}</Text>
                  <Text mt={-15}>
                    Time: {session.start_time} - {session.end_time}
                  </Text>
                  <Text mt={-15}>
                    Available: {session.current_group_size} /{" "}
                    {session.max_group_size}{" "}
                  </Text>
                </Stack>
                <Group>
                  <Modalview current={session} />
                  <Button color="yellow" radius="xl">Edit</Button>
                </Group>
              </Stack>
            </Group>
          ))}
        </Group>
        <h1>Joined Sessions</h1>
        <Group>
          {study_sessions_joined.map((session) => (
            <Group p={30} key={session.topic}>
              <Stack>
                <Avatar size={100} />
              </Stack>
              <Stack>
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
                  <Text mt={-15}>Date: {session.date}</Text>
                  <Text mt={-15}>
                    Time: {session.start_time} - {session.end_time}
                  </Text>
                  <Text mt={-15}>
                    Available: {session.current_group_size} /{" "}
                    {session.max_group_size}{" "}
                  </Text>
                </Stack>
                <Group>
                  <Button color="red" radius="xl" onClick={ () => leaveHandler(session)}>Leave</Button>
                </Group>
              </Stack>
            </Group>
          ))}
        </Group>
      </ScrollArea>
    </MantineProvider>
  );
}
