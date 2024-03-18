import { MantineProvider } from "@mantine/core"
import ClientPage from "./client-page"
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";
import cx from 'clsx';
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import Modalview from "../../ui/modalview";


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
  const user = await retrieveUserProfileInfo();
  return (
    <div>
      <MantineProvider>
        <ClientPage sessions={sessions} user={user} />
      </MantineProvider>

    </div>
  )
};
