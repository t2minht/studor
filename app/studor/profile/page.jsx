import { MantineProvider } from "@mantine/core"
import ClientPage from "./client-page"
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";

export default async function Page() {
  const sessions = await retrieveProfileStudySession();
  const user = await retrieveUserProfileInfo();
  return (
    <div>
      <MantineProvider>
        <ClientPage sessions={sessions} user={user} />
      </MantineProvider>

    </div>
  )
};