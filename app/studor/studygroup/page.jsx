import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { MantineProvider } from "@mantine/core";
import ClientPage from './client-page'
import { retrieveExistingSessions } from '../../backend/study-session-backend'
import StudySessions from "./study-sessions";


export default async function Page() {
    const supabase = createServerComponentClient({ cookies });

    const study_sessions = await retrieveExistingSessions();

    return (
        <MantineProvider>
            {/* <ClientPage /> */}
            <StudySessions study_sessions={study_sessions} />
            
        </MantineProvider>
    )


}