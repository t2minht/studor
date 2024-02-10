'use client'

import {
    Button
} from '@mantine/core';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';

export default function LoginButtonClient() {

    const supabase = createClientComponentClient()
    const router = useRouter();


    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
            }
        })
    };

    return (
        <Button variant="outline" color="rgba(255, 255, 255, 1)" radius="xl" onClick={handleSignIn}>Login</Button>
    )
}