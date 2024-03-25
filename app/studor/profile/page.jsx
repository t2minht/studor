import { MantineProvider } from "@mantine/core"
import ClientPage from "./client-page"
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";
import cx from 'clsx';
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import { calendarDataUpload } from '../../backend/calendar-backend';
import Modalview from "../../ui/modalview";
import { getDepartmentNames, getTutorCourses, retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";

export default async function Page() {
  const sessions = await retrieveProfileStudySession();
  const tutor_sessions = await retrieveProfileTutoringSessions();
  const user = await retrieveUserProfileInfo();

  const departments = await getDepartmentNames();
  const departmentsAndNull = [''].concat(departments);

  return (
    <div>
      <MantineProvider>
        <ClientPage sessions={sessions} user={user} tutor_sessions={tutor_sessions} departments={departmentsAndNull} />
      </MantineProvider>

    </div>
  )
};
