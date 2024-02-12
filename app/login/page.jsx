'use client'
import { BackgroundImage, Button, Center, Group, MantineProvider, Notification, Paper, Space, Stack, Text, TextInput, rem } from '@mantine/core'; // put this in layout.js???
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { redirect } from "next/navigation";
// import { cookies } from 'next/headers'
import AuthButtonClient from "../ui/auth-button-client";
import { useForm } from '@mantine/form';
import { IconArrowRight, IconCircleX } from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Notifications, notifications } from '@mantine/notifications';

export default function Login() {
    // const supabase = createServerComponentClient({ cookies });

    // const { data: { session } } = await supabase.auth.getSession();
    // if (session) {
    //     redirect("/")
    // };

    const form = useForm({
        validateInputOnChange: true,
        initialValues: {
        email: '',
        },

        validate: {
            email: (val) => (!(/\b\S+@tamu\.edu\b/.test(val)) ? 'Invalid email, must end with @tamu.edu' : null),
        },
    });

    const handleSubmitEmail = (event) => {
        event.preventDefault(); // Prevent default form submission
    
        if (!form.isValid()) {
          console.log(form.values)
          console.log('Form is invalid');
          notifications.show({
            withBorder: true,
            color: "red",
            radius: "md",
            icon: <IconCircleX style={{ width: rem(18), height: rem(18) }} />,
            title: "Incorrect Email",
            message: "Please make sure email is correctly formatted",
          });
          return;
        }

        notifications.show({
            withBorder: true,
            color: "green",
            radius: "md",
            icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
            title: 'Login Successful!',
            message: "Now redirecting to Landing Page",
        });
        window.location.href = '/';
    }

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
                        <Text size="lg" fw={500}>
                            Welcome to TAMU Studor!
                        </Text>
                        <Space h="md" />
                        <form onSubmit={handleSubmitEmail}>
                            <Stack>
                            <TextInput 
                                required
                                label="Email"
                                description="Please log in with your TAMU email"
                                placeholder="yourNetID@tamu.edu"
                                value={form.values.email}
                                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                error={form.errors.email && 'Invalid email'}
                                radius="md"
                            />
                            </Stack>

                            <Group justify="center" mt="md">
                                <Button color="#800000" type="submit" radius="xl" rightSection={<IconArrowRight style={{ width: rem(18) }} />}
                                {...form.getInputProps('email')}
                                >
                                    Login
                                </Button>
                            </Group>
                        </form>
                    </Paper>
                </Center>
            </BackgroundImage>
        </MantineProvider>
    )
}