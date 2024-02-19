'use client'
import {
  MantineProvider,
  Group,
  Center,
  Stack,
  Avatar,
  Input,
  Button,
  Table,
  ScrollArea,
  Space,
  Text,
  FileButton
} from "@mantine/core";
import { IconAt, IconPencil, IconPhone, IconUpload } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react';
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";


export default function Page() {
  const [studySessions, setStudySessions] = useState([]);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await retrieveProfileStudySession();
        const user = await retrieveUserProfileInfo();
        setStudySessions(sessions);
        setUserData(user)
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchData();
  }, []);

  const rows = studySessions.map((session) => (
    <Table.Tr key={session.id}>
      <Table.Td>{session.topic}</Table.Td>
      <Table.Td> {session?.department + ' ' + session?.course_number + (session.section ? ' - ' + session?.section : '')}</Table.Td>
      <Table.Td>{session.date}</Table.Td>
    </Table.Tr>
  ));



  const [file, setFile] = useState(null);
  const resetRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  return (
    <>
      <MantineProvider>
        <Center>
          <h1>Profile</h1>

        </Center>

        <Center>
          <Group gap="xl" justify="center">
            <Stack>
              <Avatar
                size={200}
              />
            </Stack>
            <Stack>
              <Group justify="center">
                <IconPencil size={16} />
                <Text fw={700}>{userData.name}</Text>
              </Group>
              <Group justify="center">
                <IconAt size={16} />
                <Text>{userData.email}</Text>
              </Group>

              <Group justify="center">
                <FileButton color='#800000' leftSection={<IconUpload size={16} />} resetRef={resetRef} onChange={setFile} accept="application/pdf">
                  {(props) => <Button {...props}>Upload Transcript</Button>}
                </FileButton>
                <Button disabled={!file} color="red" onClick={clearFile}>
                  Reset
                </Button>
              </Group>
              {file && (
                <Text size="sm" ta="center" mt="sm">
                  Picked file: {file.name}
                </Text>
              )}
            </Stack>
          </Group>
        </Center>
        <Stack mt={75} mx={50}>
          <Text ta="center" size="lg" fw={700}>Session History</Text>
          <ScrollArea h={250}>
            <Table stickyHeader striped withTableBorder highlightOnHover>
              <Table.Thead style={{ color: 'white' }} bg='#800000'>
                <Table.Tr>
                  <Table.Th>Topic</Table.Th>
                  <Table.Th>Course</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
        <Space h='xl' />
      </MantineProvider>
    </>
  )
}