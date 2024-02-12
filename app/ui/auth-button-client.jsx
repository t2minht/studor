'use client'

import {
    Button
} from '@mantine/core';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';

export default function AuthButtonClient({ session }) {

    const supabase = createClientComponentClient()
    const router = useRouter();


    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();

    };

    const handleSignIn = async () => {
        const redirectPath = '/auth/callback'; // Adjust the path as needed
        const redirectTo = `${window.location.origin}${redirectPath}`;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            //         provider: "github",
            options: {
                redirectTo: redirectTo
            }
        })
    };

    return session ? (
        <Button variant="outline" color="rgba(255, 255, 255, 1)" radius="xl" onClick={handleSignOut}>Logout</Button>
    ) : (
        <Button variant="outline" radius="xl" onClick={handleSignIn}>Login</Button>
    )
}