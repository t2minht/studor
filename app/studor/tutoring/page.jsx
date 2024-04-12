
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getDepartmentNames, getExistingNotJoinedSessions, retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";
import { retrieveProfileStudySession} from "@/app/backend/study-session-backend";
import { retrieveUserEvents, getColorPref } from "@/app/backend/calendar-backend";

export default async function Page() {

  const tutor_sessions = await getExistingNotJoinedSessions();
  
  const fetchedEvents = await retrieveUserEvents();
  const fetchedStudySessions = await retrieveProfileStudySession();
  const fetchedTutorSessions = await retrieveProfileTutoringSessions();
  const fetchedColors = await getColorPref();

  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);
  
  return (
    <MantineProvider>
      <ClientPage tutor_sessions={tutor_sessions} events = {fetchedEvents} all_study_sessions = {fetchedStudySessions} all_tutoring = {fetchedTutorSessions} departments={departmentsAndNull} colors={fetchedColors}></ClientPage>
    </MantineProvider>
  )
}