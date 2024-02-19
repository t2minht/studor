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
  FileButton,
  Checkbox,
  rem
} from "@mantine/core";
import { IconAt, IconPencil, IconPhone, IconUpload } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react';
import { retrieveProfileStudySession } from "@/app/backend/study-session-backend";
import cx from 'clsx';

const data = [
  {
    id: '1',
    department: 'CSCE',
    courseNumber: '482',
    section: '600',
  },
  {
    id: '2',
    department: 'CSCE',
    courseNumber: '656',
    section: '600',
  },
  {
    id: '3',
    department: 'CSCE',
    courseNumber: '713',
    section: '600',
  },
  {
    id: '4',
    department: 'CSCE',
    courseNumber: '681',
    section: '600',
  },
  {
    id: '5',
    department: 'CSCE',
    courseNumber: '451',
    section: '600',
  },
];

export default function Page() {
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const [studySessions, setStudySessions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await retrieveProfileStudySession();
        setStudySessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchData();
  }, []);

  const sessionHistoryRows = studySessions.map((session) => (
    <Table.Tr key={session.id}>
      <Table.Td>{session.topic}</Table.Td>
      <Table.Td> {session?.department + ' ' + session?.course_number + (session.section ? ' - ' + session?.section : '')}</Table.Td>
      <Table.Td>{session.date}</Table.Td>
    </Table.Tr>
  ));

  const coursesRows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({ selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>{item.department}</Table.Td>
        <Table.Td>{item.courseNumber}</Table.Td>
        <Table.Td>{item.section}</Table.Td>
      </Table.Tr>
    );
  });


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
                <Text fw={700}>Jane Doe</Text>
              </Group>
              <Group justify="center">
                <IconAt size={16} />
                <Text>janedoe@tamu.edu</Text>
              </Group>
              <Group justify="center">
                <IconPhone size={16} />
                <Text>(123) 456-7890</Text>
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
          <Text ta="center" size="lg" fw={700}>My Courses</Text>
          <ScrollArea h={250}>
            <Table stickyHeader striped withTableBorder highlightOnHover>
              <Table.Thead style={{ color: 'white' }} bg='#800000'>
                <Table.Tr>
                  <Table.Th style={{ width: rem(40) }}>
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === data.length}
                      indeterminate={selection.length > 0 && selection.length !== data.length}
                    />
                  </Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Course Number</Table.Th>
                  <Table.Th>Section</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{coursesRows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
        <Stack mt={50} mx={50}>
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
              <Table.Tbody>{sessionHistoryRows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
        <Space h='xl' />
      </MantineProvider>
    </>
  )
}