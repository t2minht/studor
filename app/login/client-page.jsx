'use client'
import { BackgroundImage, Button, Center, Group, MantineProvider, Notification, Paper, Space, Stack, Text, TextInput, rem } from '@mantine/core'; // put this in layout.js???
import { useForm } from '@mantine/form';
import { IconArrowRight, IconCircleX } from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Notifications, notifications } from '@mantine/notifications';
import LoginButtonClient from '../ui/login-button-client';

export default function ClientPage() {

    return (
        <MantineProvider>
            <Notifications position="top-right" />
            {/* <AuthButtonClient session={session} /> */}
            <BackgroundImage
                src="https://i.ytimg.com/vi/9L0haqIcUmQ/maxresdefault.jpg"
                radius="sm"
            >
                <Center style={{ height: '100vh' }}>
                    <Paper mx={50} shadow="lg" radius="md" p="xl" withBorder style={{ maxWidth: '500px' }}>
                        <Text ta="center" size="lg" fw={500}>
                            Welcome to TAMU Studor!
                        </Text>
                        <Text ta="center" size="sm">
                            Please log in with your TAMU email.
                        </Text>
                        <Space h="xs" />
                         <Group justify="center" mt="md">
                             <LoginButtonClient />
                         </Group>
                    </Paper>
                </Center>
            </BackgroundImage>
        </MantineProvider>
    )

}