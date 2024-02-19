'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconBrandGoogle } from '@tabler/icons-react';
import { Button, rem } from '@mantine/core';




export default function LoginButtonClient() {

    const supabase = createClientComponentClient()
    const router = useRouter();


    const handleSignIn = async () => {

        await supabase.auth.signInWithOAuth({
            provider: "google",
            //         provider: "github",
            options: {
                redirectTo: `${location.origin}/auth/callback`

            }
        })
    };

    return (
        <Button color="#800000" radius="xl" leftSection={<IconBrandGoogle style={{ width: rem(18) }} />} onClick={handleSignIn}> Gmail</Button>
    )
}