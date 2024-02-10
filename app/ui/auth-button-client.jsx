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
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
            }
        })
    };


    return session ? (
            <Button onClick={handleSignOut}>Logout</Button>
        ) : (
            <Button onClick={handleSignIn}>Login</Button>
    )
}