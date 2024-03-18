import { MantineProvider } from "@mantine/core";
import ClientPage from "./client-page";
import { getDepartmentNames, getTutorCourses } from "@/app/backend/tutoring-backend";

export default async function Page() {
  const possible_courses = await getTutorCourses();
  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);

  return (
    <MantineProvider>
      <ClientPage courses={possible_courses} departments={departmentsAndNull}></ClientPage>
    </MantineProvider>
  )
}