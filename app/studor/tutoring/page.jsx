
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getExistingNotJoinedSessions } from "@/app/backend/tutoring-backend";
import { retrieveExistingJoinedSessions as getJoinedStudySessions, retrieveFutureHostedSessions as getHostedStudySessions } from "@/app/backend/study-session-backend";
import { retrieveUserEvents } from "@/app/backend/calendar-backend";

export default async function Page() {
  const tutor_sessions = await getExistingNotJoinedSessions();
  const hosted_study_sessions = await getHostedStudySessions();
  const joined_study_sessions = await getJoinedStudySessions();
  

  const study_sessions = {};
  study_sessions.hosted = hosted_study_sessions;
  study_sessions.joined = joined_study_sessions;

  const fetchedEvents = await retrieveUserEvents();

  return (
    <MantineProvider>
      <ClientPage tutor_sessions={tutor_sessions} events = {fetchedEvents} study_sessions={study_sessions}></ClientPage>
    </MantineProvider>
  )
}