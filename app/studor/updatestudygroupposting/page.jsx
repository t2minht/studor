import { retrieveExistingNotJoinedSessions } from "@/app/backend/study-session-backend"
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";

export default async function Page() {

  return (
    <MantineProvider>
      <ClientPage></ClientPage>
    </MantineProvider>
  )
}