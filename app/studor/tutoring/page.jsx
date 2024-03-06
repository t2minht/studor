
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getExistingNotJoinedSessions } from "@/app/backend/tutoring-backend";

export default async function Page() {
  const tutor_sessions = await getExistingNotJoinedSessions();


  return (
    <MantineProvider>
      <ClientPage tutor_sessions={tutor_sessions}></ClientPage>
    </MantineProvider>
  )
}