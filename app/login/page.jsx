import { Anchor, Button, Checkbox, Divider, Group, MantineProvider, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core'; // put this in layout.js???
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import AuthButtonClient from "../ui/auth-button-client";
import { useForm } from '@mantine/form';

export default async function Login() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        redirect("/")
    };

    const form = useForm({
        initialValues: {
        email: '',
        },

        validate: {
            email: (val) => (/\b\S+@tamu\.edu\b/.test(val) ? null : 'Invalid email, must end with @tamu.edu'),
        },
    });

    return (
        <MantineProvider>
            <AuthButtonClient session={session} />
            <Paper radius="md" p="xl" withBorder {...props}>
                <Text size="lg" fw={500}>
                    Welcome to TAMU Studor, {type} with your TAMU email
                </Text>

                <form onSubmit={form.onSubmit(console.log('logging in'))}>
                    <Stack>
                    <TextInput 
                        required
                        label="Email"
                        placeholder="yourNetID@tamu.edu"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                    <Button type="submit" radius="xl">
                        {upperFirst(type)}
                    </Button>
                    </Group>
                </form>
            </Paper>
        </MantineProvider>
    )
}