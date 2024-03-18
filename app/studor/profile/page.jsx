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

export default function Page() {
  const [data, setData] = useState([]);

  const [selection, setSelection] = useState([]);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const [studySessions, setStudySessions] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await retrieveProfileStudySession();
        const user = await retrieveUserProfileInfo();
        setUserData(user)
        setStudySessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchData();
  }, []);

  const sessionHistoryRows = studySessions.map((session) => (
    <Table.Tr key={session.id}>
      <Table.Td>{session.topic}</Table.Td>
      <Table.Td> {session?.department + ' ' + session?.course_number + (session.section ? ' - ' + session?.section : '')}</Table.Td>
      <Table.Td>{session.date}</Table.Td>
      <Table.Td> <Modalview current={session} /> </Table.Td>
    </Table.Tr>
  ));

  const coursesRows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <Table.Tr key={item.id} className={cx({ selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>{item.department}</Table.Td>
        <Table.Td>{item.courseNumber}</Table.Td>
        <Table.Td>{item.section}</Table.Td>
      </Table.Tr>
    );
  });


  const [transcript, setTranscript] = useState(null);
  const resetTranscript = useRef(null);

  const clearTranscript = () => {
    setTranscript(null);
    resetTranscript.current?.();
  };

  const [schedule, setSchedule] = useState(null);
  const resetSchedule = useRef(null);

  const clearSchedule = () => {
    setSchedule(null);
    resetSchedule.current?.();
  };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { department: '', courseNumber: '', courseSection: '' },

    validate: {
      department: (value) => ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),

    },
  });

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!form.isValid()) {

      console.log(form.values)
      console.log('Form is invalid');
      notifications.show({
        withBorder: true,
        color: "red",
        radius: "md",
        icon: <IconCircleX style={{ width: rem(18), height: rem(18) }} />,
        title: "Incorrect Inputs",
        message: "Please make sure all inputs are correctly filled and formatted",
      });
      return;
    }

    const newCourse = {
      department: form.values.department,
      courseNumber: form.values.courseNumber,
      section: form.values.courseSection,
    };

    // Check if the new course already exists in the data list
    const exists = data.some(course => (
      course.department === newCourse.department &&
      course.courseNumber === newCourse.courseNumber &&
      course.section === newCourse.section
    ));

    if (exists) {
      notifications.show({
        withBorder: true,
        color: "red",
        radius: "md",
        icon: <IconCircleX style={{ width: rem(18), height: rem(18) }} />,
        title: "Course Already Exists",
        message: "This course has already been added.",
      });
      return;
    }

    const newCourseWithId = {
      ...newCourse,
      id: (data.length + 1).toString(), // Generate new ID for the course
    };

    setData([...data, newCourseWithId]); // Update data with the new course

    form.reset(); // Reset form fields

    notifications.show({
      withBorder: true,
      color: "green",
      radius: "md",
      icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
      title: 'New Course Added!',
      message: "The table should now include your recent added course",
    });

  };

  const handleDelete = (event) => {
    event.preventDefault(); // Prevent default form submission

    const newData = data.filter((item) => !selection.includes(item.id));
    setData(newData);
    setSelection([]); // Clear selection

    notifications.show({
      withBorder: true,
      color: "green",
      radius: "md",
      icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
      title: 'Course(s) Deleted!',
      message: "The table should now reflect the changes",
    });

  };

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