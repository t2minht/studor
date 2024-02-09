'use client'

import { MantineProvider, 
  Group, 
  Center, 
  Stack, 
  Avatar, 
  Input,
  Button,
  Text,
  useMantineTheme, 
  Table} from "@mantine/core";
import { IconAt, IconPencil, IconPhone, IconUpload } from '@tabler/icons-react';
import React, { useRef } from 'react';

export default function Page() {
  const openRef = useRef(null);

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
              <Button color='#800000' leftSection={<IconUpload size={16} />} onClick={() => openRef.current?.()}>
                Upload Transcript
              </Button>
            </Stack> 
          </Group> 
        </Center>  
        <Stack>
          <Table striped highlightOnHover withTableBorder>
            {/* {...rows} */}
          </Table>
        </Stack>  

      </MantineProvider>
    </>
  )
}