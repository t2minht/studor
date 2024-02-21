import { retrieveExistingNotJoinedSessions } from "@/app/backend/study-session-backend"
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";

export default async function Page() {
  const study_sessions = await retrieveExistingNotJoinedSessions();

  return (
    <MantineProvider>
      <ClientPage data={study_sessions}></ClientPage>
    </MantineProvider>
  )
}