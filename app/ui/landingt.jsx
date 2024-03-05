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
import {
  IconXboxX,
  IconFilter,
  IconDiscountCheckFilled,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modaltutor from "../ui/modaltutor";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { leaveSession } from "../backend/tutoring-backend";

export default function Landingsg(data) {
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  const [tutoring_sessions_hosted, setHostedTutoringSessions] = useState(data.tutoring.hosted);
  const [tutoring_sessions_joined, setJoinedTutoringSessions] = useState(data.tutoring.joined);

  if (data.tutoring === null) {
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }

  const leaveHandler = async (session) => {
    await leaveSession(data = { session });
    const updatedSessions = tutoring_sessions_joined.filter((item) => item.id !== session.id);
    setJoinedTutoringSessions(updatedSessions);
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
      <Group miw={200}>
        <ScrollArea h={height - 120}>
          <h1>Your Posts</h1>
          <Group>
            {tutoring_sessions_hosted.map((session) => (
              <Group p={30} key={session.title} maw={400}>
                <Stack>
                  <Avatar size={100} src={session.tutor_avatar_url} />
                </Stack>
                <Stack maw={210}>
                  <Stack>
                    <Text fw={700} size="xl">
                      {session.title}
                    </Text>
                    <Text mt={-10} fw={700}>
                      Class: {" "}
                      {session.department +
                        " " +
                        session.course_number +
                        (session.section ? " - " + session.section : "")}{" "}
                    </Text>
                    <Text mt={-15}>Location: {session.location}</Text>
                    <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                    <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                    <Text mt={-15}>
                      Available: {session.max_group_size - session.current_group_size} /{" "}
                      {session.max_group_size}{" "}
                    </Text>
                  </Stack>
                </Stack>
              </Group>
            ))}
          </Group>
          <h1>Joined Sessions</h1>
          <Group>
            {tutoring_sessions_joined.map((session) => (
              <Group p={30} key={session.topic} maw={400}>
                <Stack>
                  <Avatar size={100} src={session.tutor_avatar_url} />
                </Stack>
                <Stack maw={210}>
                  <Stack>
                    <Text fw={700} size="xl">
                      {session.topic}
                    </Text>
                    <Text mt={-10} fw={700}>
                      Class: {" "}
                      {session.department +
                        " " +
                        session.course_number +
                        (session.section ? " - " + session.section : "")}{" "}
                    </Text>
                    <Text mt={-15}>Location: {session.location}</Text>
                    <Text mt={-15}>Date: {formatDate(session.date)}</Text>
                    <Text mt={-15}>Time: {convertTo12HourFormat(session.start_time)} - {convertTo12HourFormat(session.end_time)}</Text>
                    <Text mt={-15}>
                      Available: {session.max_group_size - session.current_group_size} /{" "}
                      {session.max_group_size}{" "}
                    </Text>
                  </Stack>
                  <Group>
                    <Modaltutor current={session} />
                    <Button color="red" radius='xl' onClick={() => leaveHandler(session)}>Leave</Button>
                  </Group>
                </Stack>
              </Group>
            ))}
          </Group>
        </ScrollArea>
      </Group>
    </MantineProvider>
  );
}
