import { retrieveExistingNotJoinedSessions, updateAllSessionSizes } from "@/app/backend/study-session-backend"
import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getDepartmentNames } from "@/app/backend/tutoring-backend";

export default async function Page() {
  const study_sessions = await retrieveExistingNotJoinedSessions();
  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);

  return (
    <MantineProvider>
      <ClientPage study_sessions={study_sessions} departments={departmentsAndNull}></ClientPage>
    </MantineProvider>
  )
}