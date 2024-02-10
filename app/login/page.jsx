import { MantineProvider } from '@mantine/core'; // put this in layout.js???
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import AuthButtonClient from "../ui/auth-button-client";

export default async function Login() {
    const supabase = createServerComponentClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        redirect("/")
    }

    return (
        <MantineProvider>
            <AuthButtonClient session={session} />
        </MantineProvider>
        )
}