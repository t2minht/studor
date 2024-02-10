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


const elements = [
  { topic: "430 Cry - Session", course: "CSCE 430", date: "January 18. 2024" },
  { topic: "I can't read...", course: "ENGL 210", date: "January 21, 2024" },
  { topic: "Data Structs", course: "CSCE 221", date: "January 25, 2024" },
  { topic: "151 HELP on HW", course: "MATH 152", date: "January 29, 2024" },
  { topic: "430 Cry - Session", course: "CSCE 430", date: "January 18. 2024" },
  { topic: "I can't read...", course: "ENGL 210", date: "January 21, 2024" },
  { topic: "Data Structs", course: "CSCE 221", date: "January 25, 2024" },
  { topic: "151 HELP on HW", course: "MATH 152", date: "January 29, 2024" },
];


export default function Page() {
  const [file, setFile] = useState(null);
  const resetRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.topic}</Table.Td>
      <Table.Td>{element.course}</Table.Td>
      <Table.Td>{element.date}</Table.Td>
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
              <Input
                leftSection={<IconPencil size={16} />}
                variant="unstyled"
                placeholder="Your Name"
                disabled
              />
              <Input
                leftSection={<IconAt size={16} />}
                variant="unstyled"
                placeholder="Your Email"
                disabled
              />
              <Input
                leftSection={<IconPhone size={16} />}
                variant="unstyled"
                placeholder="Your Phone Number"
                disabled
              />
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