// wrapping client button with a server button so the button doesn't flash
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import AuthButtonClient from "./auth-button-client";

export default async function AuthButtonServer() {
    const supabase = createServerComponentClient({ cookies })
    const {
        data : {session}, 
    } = await supabase.auth.getSession()

    return <AuthButtonClient session={session} />

}