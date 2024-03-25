
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getDepartmentNames, getExistingNotJoinedSessions, retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";
import { retrieveProfileStudySession} from "@/app/backend/study-session-backend";
import { retrieveUserEvents } from "@/app/backend/calendar-backend";

export default async function Page() {
  const tutor_sessions = await getExistingNotJoinedSessions();
  const hosted_study_sessions = await getHostedStudySessions();
  const joined_study_sessions = await getJoinedStudySessions();
  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);
  

  const study_sessions = {};
  study_sessions.hosted = hosted_study_sessions;
  study_sessions.joined = joined_study_sessions;

  const fetchedEvents = await retrieveUserEvents();
  const fetchedStudySessions = await retrieveProfileStudySession();
  const fetchedTutorSessions = await retrieveProfileTutoringSessions();

  return (
    <MantineProvider>
      <ClientPage tutor_sessions={tutor_sessions} events = {fetchedEvents} all_study_sessions = {fetchedStudySessions} all_tutoring = {fetchedTutorSessions} departments={departmentsAndNull}></ClientPage>
    </MantineProvider>
  )
}