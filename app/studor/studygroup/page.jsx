import { retrieveExistingNotJoinedSessions, updateAllSessionSizes, retrieveExistingJoinedSessions as getJoinedStudySessions, retrieveFutureHostedSessions as getHostedStudySessions  } from "@/app/backend/study-session-backend"
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { retrieveUserEvents } from "../../backend/calendar-backend";


export default async function Page() {
  const possible_study_sessions = await retrieveExistingNotJoinedSessions();
  const fetchedEvents = await retrieveUserEvents();

  const hosted_study_sessions = await getHostedStudySessions();
  const joined_study_sessions = await getJoinedStudySessions();
  

  const study_sessions = {};
  study_sessions.hosted = hosted_study_sessions;
  study_sessions.joined = joined_study_sessions;

  return (
    <MantineProvider>
      <ClientPage possible_study_sessions={possible_study_sessions} events = {fetchedEvents} study_sessions = {study_sessions}></ClientPage>
    </MantineProvider>
  )
}