import { MantineProvider } from "@mantine/core"
import ClientPage from "./client-page"
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";
import cx from 'clsx';
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import Modalview from "../../ui/modalview";
import { retrieveProfileTutoringSessions } from "@/app/backend/tutoring-backend";


let formValues = {};

const departmentData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

const courseNumberData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

const courseSectionData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

export default async function Page() {
  const sessions = await retrieveProfileStudySession();
  const tutor_sessions = await retrieveProfileTutoringSessions();
  const user = await retrieveUserProfileInfo();
  return (
    <div>
      <MantineProvider>
        <ClientPage sessions={sessions} user={user} tutor_sessions={tutor_sessions} />
      </MantineProvider>

    </div>
  )
};
