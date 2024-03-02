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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getParticipants = async () => {
    var { data: result, error } =
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
        <Text td="underline" c="blue" fw={700} size="xl" ta="center">
          {session.current.topic}
        </Text>

        <Group justify="center" gap={75} p={20}>
          <Stack>
            <Text fw={700}>
              <b>Class:</b>{" "}
              {session.current.department +
                " " +
                session.current.course_number +
                (session.current.section
                  ? " - " + session.current.section
                  : "")}{" "}
            </Text>
            <Text mt={-15}><b>Location:</b> {session.current.location}</Text>
            <Text mt={-15}><b>Date:</b> {session.current.date}</Text>
            <Text mt={-15}>
              <b>Time:</b> {session.current.start_time} - {session.current.end_time}
            </Text>
            <Text mt={-15}>
              <b>Available:</b> {session.current.max_group_size - session.current.current_group_size} /{" "}
              {session.current.max_group_size}{" "}
            </Text>
            <Text mt={-15}><b>Description:</b> {session.current.description}</Text>
            <Group>
              <Text mt={-15}><b>Noise Level:</b></Text>
              <Badge mt={-15} color="#800000" size="lg">{session.current.noise_level}</Badge>
            </Group>
          </Stack>

          <Stack>
            <Text fw={700} mt={-75} ml={5}>Participants:</Text>
              {participants.map((participant) => (
                <>
                  <Group ml={25} mt={-8}>
                    <Stack>
                      <Avatar
                        size={30}
                      />
                    </Stack>
                    <Stack mt={10} ml={-10} align="center">
                      <Text key={participant?.users?.id} mt={-15}>{participant?.users?.full_name}</Text>
                    </Stack>
                  </Group>
                </>
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
