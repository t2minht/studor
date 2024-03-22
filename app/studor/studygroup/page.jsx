import { retrieveExistingNotJoinedSessions, updateAllSessionSizes } from "@/app/backend/study-session-backend"
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { retrieveUserEvents } from "../../backend/calendar-backend";


export default async function Page() {
  const study_sessions = await retrieveExistingNotJoinedSessions();
  const fetchedEvents = await retrieveUserEvents();

  return (
    <MantineProvider>
      <ClientPage study_sessions={study_sessions} events = {fetchedEvents} ></ClientPage>
    </MantineProvider>
  )
}