'use client'
import { MantineProvider, 
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
  FileButton} from "@mantine/core";
import { IconAt, IconPencil, IconPhone, IconUpload } from '@tabler/icons-react';
import React, { useRef, useState } from 'react';


const sessions = [
  { id: 1, topic: "430 Cry - Session", course: "CSCE 430", date: "January 18. 2024" },
  { id: 2, topic: "I can't read...", course: "ENGL 210", date: "January 21, 2024" },
  { id: 3, topic: "Data Structs", course: "CSCE 221", date: "January 25, 2024" },
  { id: 4, topic: "151 HELP on HW", course: "MATH 152", date: "January 29, 2024" },
  { id: 5, topic: "430 Cry - Session", course: "CSCE 430", date: "January 18. 2024" },
  { id: 6, topic: "I can't read...", course: "ENGL 210", date: "January 21, 2024" },
  { id: 7, topic: "Data Structs", course: "CSCE 221", date: "January 25, 2024" },
  { id: 8, topic: "151 HELP on HW", course: "MATH 152", date: "January 29, 2024" },
];


export default function Page() {
  const [file, setFile] = useState(null);
  const resetRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  const rows = sessions.map((session) => (
    <Table.Tr key={session.id}>
      <Table.Td>{session.topic}</Table.Td>
      <Table.Td>{session.course}</Table.Td>
      <Table.Td>{session.date}</Table.Td>
    </Table.Tr>
  ));

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
          <Text ta="center" size="lg" fw={700}>Session History</Text>
          <ScrollArea h={250}>
            <Table stickyHeader striped withTableBorder highlightOnHover>
              <Table.Thead style={{color:'white'}} bg='#800000'>
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
        <Space h='xl'/>
      </MantineProvider>
    </>
  )
}