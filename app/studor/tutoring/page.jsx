
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getExistingNotJoinedSessions, retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";
import { retrieveProfileStudySession} from "@/app/backend/study-session-backend";
import { retrieveUserEvents } from "@/app/backend/calendar-backend";

export default async function Page() {
  const tutor_sessions = await getExistingNotJoinedSessions();
  
  const fetchedEvents = await retrieveUserEvents();
  const fetchedStudySessions = await retrieveProfileStudySession();
  const fetchedTutorSessions = await retrieveProfileTutoringSessions();

  return (
    <MantineProvider>
      <ClientPage tutor_sessions={tutor_sessions} events = {fetchedEvents} all_study_sessions = {fetchedStudySessions} all_tutoring = {fetchedTutorSessions}></ClientPage>
    </MantineProvider>
  )
}