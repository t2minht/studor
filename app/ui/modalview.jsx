'use client'
import { Center, 
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
  Modal
 } from "@mantine/core"
import { IconXboxX, IconFilter } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export default function Modalview() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <MantineProvider>
            <Modal opened={opened} onClose={close} withCloseButton={false}>
                Modal without header, press escape or click on overlay to close
            </Modal>
            <Button onClick={open} variant="filled" size="sm" color="#800000" radius="xl">View</Button>
        </MantineProvider>
    );
}