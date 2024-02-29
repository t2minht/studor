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
  Modal,
  SegmentedControl,
  rem,
  Badge
} from "@mantine/core";
import {
  IconXboxX,
  IconFilter,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconVolume,
  IconVolume2,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Modalview(session) {
  const supabase = createClientComponentClient();
  const [opened, { open, close }] = useDisclosure(false);

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    getParticipants();
  }, [] );

  const getParticipants = async () => {
    var {data : result, error} = 
    await supabase
    .from('participants_in_study_session')
    .select('users(*)')
    .eq('study_session_id', session.current.id);
    setParticipants(result);
    console.log(result)
  }

  return (
    <MantineProvider>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="auto"
      >
        <Text fw={700} size="xl" ta="center">
          {session.current.topic}
        </Text>

        <Group p={20}>
          <Stack>
            <Text mt={-10} fw={700}>
              Class:{" "}
              {session.current.department +
                " " +
                session.current.course_number +
                (session.current.section
                  ? " - " + session.current.section
                  : "")}{" "}
            </Text>
            <Text mt={-15}>Location: {session.current.location}</Text>
            <Text mt={-15}>Date: {session.current.date}</Text>
            <Text mt={-15}>
              Time: {session.current.start_time} - {session.current.end_time}
            </Text>
            <Text mt={-15}>
              Available: {session.current.current_group_size} /{" "}
              {session.current.max_group_size}{" "}
            </Text>
            <Text mt={-15}>Description: {session.current.description}</Text>
            <Group>
              <Text mt={-15}>Noise Level:</Text>
              <Badge mt={-15} color="#800000" size="lg">{session.current.noise_level}</Badge>
            </Group>
                        
            <Text mt={-10} fw={700}>Participants:</Text>
            {participants.map((participant) => (
              <Text mt={-15}>{participant?.users?.full_name}</Text>
              
            ))}
          
          </Stack>
        
        </Group>

      </Modal>
      <Button
        onClick={open}
        variant="filled"
        size="sm"
        radius="xl"
      >
        View
      </Button>
    </MantineProvider>
  );
}
