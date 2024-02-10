'use client'

import {
    Button
  } from '@mantine/core';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';

export default function LogoutButtonClient() {

    const supabase = createClientComponentClient()
    const router = useRouter();


    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();

    };

    return (
            <Button variant="outline" color="rgba(255, 255, 255, 1)" radius="xl" onClick={handleSignOut}>Logout</Button>
    )
}