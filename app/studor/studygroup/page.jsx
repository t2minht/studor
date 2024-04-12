import { retrieveExistingNotJoinedSessions, updateAllSessionSizes, retrieveExistingJoinedSessions as getJoinedStudySessions, retrieveFutureHostedSessions as getHostedStudySessions, retrieveProfileStudySession   } from "@/app/backend/study-session-backend"
import { retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getDepartmentNames } from "@/app/backend/tutoring-backend";
import { retrieveUserEvents, getColorPref } from "../../backend/calendar-backend";


export default async function Page() {
  const study_sessions = await retrieveExistingNotJoinedSessions();
  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);

  const fetchedEvents = await retrieveUserEvents();
  const fetchedStudySessions = await retrieveProfileStudySession();
  const fetchedTutorSessions = await retrieveProfileTutoringSessions();
  const fetchedColors = await getColorPref();

  return (
    <MantineProvider>
      <ClientPage study_sessions={study_sessions} events = {fetchedEvents} all_study_sessions = {fetchedStudySessions} all_tutoring = {fetchedTutorSessions} departments={departmentsAndNull} colors={fetchedColors}></ClientPage>
    </MantineProvider>
  )
}