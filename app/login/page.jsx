// import { BackgroundImage, Button, Center, Group, MantineProvider, Notification, Paper, Space, Stack, Text, TextInput, rem } from '@mantine/core'; // put this in layout.js???
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { MantineProvider } from "@mantine/core";
import ClientPage from './client-page'

export default async function Login() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        redirect("/")
    };

    return (
        <MantineProvider>
            <ClientPage />
        </MantineProvider>
    )


}