"use client";
import {
  Center,
  MantineProvider,
  Rating,
  Stack,
  Avatar,
  Group,
  Text,
  Button,
  Modal,
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

// pop up modal that showcases all details of the tutoring session including other participants
export default function Modaltutor(session) {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClientComponentClient();
  const [participants, setParticipants] = useState([]);
  const [avgRating, setAvgRating] = useState(session.current.averageRating);
  useEffect(() => {
    getParticipants();
  }, []);
 
  // gets participants for a given tutoring session
  const getParticipants = async () => {
    var { data: result, error } =
      await supabase
        .from('participants_in_tutor_session')
        .select('users(*)')
        .eq('tutoring_session_id', session.current.id)
        .neq('users.id', session.current.tutor_user_id);

    setParticipants(result);
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

  // Mantine UI components for the Modal
  return (
    <MantineProvider>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Group>

          <Stack align="center">
            <Stack ml={35}>
              <Avatar size={100} src={session.current.tutor_avatar_url} />
            </Stack>
            <Stack ml={30}>
              <Text fw={700} td="underline" c="blue" size="xl" ta="center">
                {session.current.title}
              </Text>
              <Text mt={-10}>
                <b>Class:</b>{" "}
                {session.current.department +
                  " " +
                  session.current.course_number +
                  (session.current.section
                    ? " - " + session.current.section
                    : "")}{" "}
              </Text>
              <Text mt={-15}><b>Location:</b> {session.current.location}</Text>
              <Text mt={-15}><b>Date:</b> {formatDate(session.current.date)}</Text>
              <Text mt={-15}><b>Time:</b> {convertTo12HourFormat(session.current.start_time)} - {convertTo12HourFormat(session.current.end_time)}</Text>
              <Text mt={-15}> <b>Remaining:</b> {session.current.max_group_size - session.current.current_group_size} /{" "}
                {session.current.max_group_size - 1}{" "}</Text>
              <Text mt={-15}><b>Description:</b> {session.current.description}</Text>
              <Group mt={-15}>
                <Text><b>Tutor:</b> {session.current.users.full_name}</Text>
                {session.current.verified && <IconDiscountCheckFilled style={{ color: "#228be6", marginLeft: "-10" }} />}
              </Group>
              <Group mt={-15}>

                {avgRating ? <Text><b>Tutor Rating:</b> {avgRating}</Text> : <Text> <b>Tutor Rating:</b> No Rating</Text>}
                {avgRating && <Rating value={avgRating} fractions={4} ml={-10} readOnly />}
              </Group>
            </Stack>
          </Stack>



          <Stack ml={27}>
            {participants.length > 1 && (
              <Text fw={700} ml={5}>Participants:</Text>
            )}
            {participants
              .map((participant) => {
                if (!participant.users) return null;
                return (
                  <>
                    <Group ml={25} mt={-8}>
                      <Stack>
                        <Avatar
                          size={30} src={participant?.users?.avatar_url}
                        />
                      </Stack>
                      <Stack mt={10} ml={-10} align="center">
                        <Text key={participant?.users?.id} mt={-15}>{participant?.users?.full_name}</Text>
                      </Stack>
                    </Group>
                  </>
                )
              })}
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
    </MantineProvider >
  );
}
