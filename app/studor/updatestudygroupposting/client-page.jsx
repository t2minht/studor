'use client'
import { Center, Group, MantineProvider, Stack, TextInput, Autocomplete, NumberInput, Button, Textarea, Space, rem, SegmentedControl, Text, Modal, NativeSelect } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX, IconClock, IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { updateStudyGroupSessionData } from '../../backend/study-session-backend';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import Modaldelete from "../updatestudygroupposting/modalfordelete";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import logo from '@/app/ui/floaty_logo_m.gif';

let formValues = {};

export default function Page(data) {

  const { height, width } = useViewportSize();
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);

  const supabase = createClientComponentClient();
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department'));
  const [selectedCourseNumber, setSelectedCourseNumber] = useState(searchParams.get('course_number'));
  const [selectedCourseSection, setSelectedCourseSection] = useState(fix_section);
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [courseSections, setCourseSections] = useState([]);
  console.log(searchParams.get('date'));

  useEffect(() => {
    const getSectionsInitial = async () => {
      const sections = await getSectionNumbers(selectedCourseNumber);
      setCourseSections(sections);
    }
    getSectionsInitial();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const numbers = await getCourseNumbers(selectedDepartment);
      const allNumbers = [''].concat(numbers);
      setCourseNumbers(allNumbers);
    };

    fetchData();

    form.values.department = selectedDepartment;
  }, [selectedDepartment]);

  useEffect(() => {
  }, [courseNumbers]);

  useEffect(() => {
    form.values.courseNumber = selectedCourseNumber;
  }, [selectedCourseNumber]);

  useEffect(() => {
    form.values.courseSection = selectedCourseSection;
  }, [selectedCourseSection]);

  if (searchParams.get('topic') == null) {
    window.location.href = '/';
    return;
  }



  const departmentData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

  const courseNumberData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

  const courseSectionData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  var date = new Date((searchParams.get('date') + "T00:00:00").replace(/-/g, '/').replace(/T.+/, ''));

  var description_details = searchParams.get('description') || '';
  var fix_start_time = searchParams.get('start_time').slice(0, 5);
  var fix_end_time = searchParams.get('end_time').slice(0, 5);
  var fix_section = "";
  var current_group_size = searchParams.get('current_group_size');

  if (searchParams.get('section') == "0") {
    fix_section = "";
  }
  else {
    fix_section = searchParams.get('section');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    validateInputOnChange: true,

    initialValues: { id: searchParams.get('id'), title: searchParams.get('topic'), description: description_details, department: searchParams.get('department'), courseNumber: searchParams.get('course_number'), courseSection: fix_section, location: searchParams.get('location'), groupSize: Number(searchParams.get('max_group_size')), date: date, startTime: fix_start_time, endTime: fix_end_time, noiseLevel: searchParams.get('noise_level') },

    validate: {
      title: (value) => ((value.length < 2 || value.length > 40) ? 'Must be between 2-40 characters' : null),
      description: (value, allValues) => (
        allValues.description && (value.length > 500) ? 'Invalid Description' : null
      ),
      department: (value) => ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      location: (value) => ((value.length < 2 || value.length > 40) ? 'Invalid Location (Limit of 40 characters)' : null),
      groupSize: (value) => ((value >= current_group_size && value <= 20) ? null : 'Invalid Group Size'),
      noiseLevel: (value) => ((value > 5 || value < 1) ? 'Invalid Noise Level' : null),
      date: (value) => {

        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear, currentDate.getMonth(), currentDate.getDate());

        if (value < today) {
          return 'Date must be in the future';
        }
        return null;
      },
      startTime: (value, allValues) => {
        const selectedDate = new Date(allValues.date);
        const selectedTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), ...value.split(':').map(Number));
        // Construct Date object for the selected time
        if (selectedTime < new Date()) { // Check if selected time is in the past
          return 'Start time must be in the future'; // Return error message if it is
        }
        return null; // Return null if start time is valid
      },
      endTime: (value, allValues) => (
        allValues.startTime && value && value <= allValues.startTime ? 'End time must be after start time' : null
      ),

    },
  });

  const handleDelete = () => {
    { console.log(1) }
  }

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
        message: "Please make sure all inputs are correctly formatted",
      });
      return;
    }


    form.values.date = form.values.date.toJSON().substring(0, 10);
    form.values.startTime = form.values.startTime + ':00';
    form.values.endTime = form.values.endTime + ':00';

    formValues = form.values;
    console.log(form.values);
    updateStudyGroupSessionData(formValues);

    notifications.show({
      withBorder: true,
      color: "green",
      radius: "md",
      icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
      title: 'Session Updated! Redirecting...',
      message: "Now redirecting to Landing Page",
    });

    // Redirect to the new page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };






  const getSectionNumbers = async (courseNumber) => {
    try {
      const { data: returned_data, error } = await supabase.from("course_catalog")
        .select('SectionNum',)
        .eq('Department', selectedDepartment)
        .eq('CourseNum', courseNumber);

      if (error) {
        console.error("Error fetching course sections:", error);
        return [];
      }

      const sectionNumSet = new Set(returned_data.map(entry => entry.SectionNum));
      const sectionNums = Array.from(sectionNumSet);
      return sectionNums;

    } catch (error) {
      console.error('Error fetching course sections:', error);
      return [];
    }

  }

  const getCourseNumbers = async (department) => {
    try {
      const { data: returned_data, error: error1 } = await supabase.from("course_catalog")
        .select('CourseNum',)
        .eq('Department', department);

      if (error1) {
        console.error('Error fetching course numbers:', error1);
        return [];
      }

      const courseNumSet = new Set(returned_data.map(entry => entry.CourseNum));
      const courseNums = Array.from(courseNumSet);
      return courseNums;

    } catch (error) {
      console.error('Error fetching course numbers:', error);
      return [];
    }
  }

  const handleDepartmentChange = async (selectedDepartment) => {
    try {
      const numbers = await getCourseNumbers(selectedDepartment);
      setCourseNumbers(numbers);
    } catch (error) {
      console.error('Error updating course numbers:', error);
    }
  }

  const handleCourseNumberChange = async (selectedCourseNumber) => {
    try {
      const sections = await getSectionNumbers(selectedCourseNumber);
      const allSections = [''].concat(sections);
      setCourseSections(allSections);
    } catch (error) {
      console.error('Error updating course sections:', error);
    }
  }


  return (
    <MantineProvider>
      <Center pl={50} pr={50}>
        <h1>Update a Study Group Session</h1>
      </Center>

      <Center mx={25}>
        <Stack miw={(width > 754) ? 680 : null}>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              description="Limit of 40 characters"
              placeholder="Title of Session"
              required
              {...form.getInputProps('title')}
            />
            <Textarea
              label="Description"
              description="Limit of 500 characters"
              placeholder="Write a description of the session here"
              mt={15}
              {...form.getInputProps('description')}
            />
            <Group grow mt={15}>
              <NativeSelect
                label="Department"
                placeholder="Enter Four Letters"
                data={data.departments.map((department) => ({ value: department, label: department }))}
                maxDropdownHeight={200}
                required
                {...form.getInputProps('department')}
                onChange={(event) => { handleDepartmentChange(event.currentTarget.value); setSelectedDepartment(event.currentTarget.value) }}

              />
              <NativeSelect
                label="Course #"
                placeholder="Enter Three Numbers"
                data={courseNumbers.map((courseNumber) => ({ value: courseNumber, label: courseNumber }))}
                maxDropdownHeight={200}
                disabled={!selectedDepartment}
                required
                {...form.getInputProps('courseNumber')}
                onChange={(event) => { handleCourseNumberChange(event.currentTarget.value); setSelectedCourseNumber(event.currentTarget.value) }}
                value={selectedCourseNumber}
              />
              <NativeSelect
                label="Course Section"
                placeholder="Enter Three Numbers"
                data={courseSections.map((courseSection) => ({ value: courseSection, label: courseSection }))}
                maxDropdownHeight={200}
                disabled={!selectedCourseNumber}
                {...form.getInputProps('courseSection')}
              />
            </Group>
            <TextInput
              label="Location"
              description="Limit of 40 characters"
              placeholder="Location of Session"
              mt={15}
              required
              {...form.getInputProps('location')}
            />
            <Group grow mt={15}>
              <NumberInput

                label="Group Size"
                placeholder="Enter a Value 2-20"
                description="Include yourself"
                min={1}
                max={20}
                required
                {...form.getInputProps('groupSize')}
              />
              <DatePickerInput
                allowDeselect
                valueFormat="YYYY MMM DD"
                label="Date"
                description="Select Date"
                minDate={new Date()}
                firstDayOfWeek={0}
                required
                {...form.getInputProps('date')}

              />
            </Group >
            <Group grow mt={15}>
              <TimeInput
                leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                label="Start Time"
                withAsterisk
                description="Enter AM or PM"
                required
                {...form.getInputProps('startTime')}
              />
              <TimeInput
                leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                label="End Time"
                withAsterisk
                description="Enter AM or PM"
                required
                {...form.getInputProps('endTime')}
              />
            </Group>
            <Stack mt={20}>
              <Text mb={-15} ta="center" size="sm" fw={500}>Noise Level</Text>
              <SegmentedControl color="#800000" data={[
                {
                  value: '1',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconVolumeOff style={{ width: rem(16), height: rem(16) }} />
                      <span>1</span>
                    </Center>
                  ),
                },
                {
                  value: '2',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <span>2</span>
                    </Center>
                  ),
                },
                {
                  value: '3',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconVolume2 style={{ width: rem(16), height: rem(16) }} />
                      <span>3</span>
                    </Center>
                  ),
                },
                {
                  value: '4',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <span>4</span>
                    </Center>
                  ),
                },
                {
                  value: '5',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconVolume style={{ width: rem(16), height: rem(16) }} />
                      <span>5</span>
                    </Center>
                  ),
                },
              ]}
                {...form.getInputProps('noiseLevel')} />
            </Stack>
            <Stack align="center" mt={20}>
              <Group mt='md'>
                <Modaldelete id={searchParams.get('id')} />
                <Modal opened={opened} onClose={close} withCloseButton={false} centered>
                  <stack>
                    <Text ta="center">Session has been updated! </Text>
                  <Center>
                    <Image
                    src={logo}
                    alt='studor logo'
                    width={200}
                    height={200}
                    />
                  </Center>
                  <Text ta="center">Redirecting to home page...</Text>
                  </stack>
                </Modal>
                <Button
                  type='submit'
                  variant="filled"
                  color='blue'
                  radius="xl"
                  onClick={open}
                >
                  Update Session
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Center>
      <Space h='xl' />
    </MantineProvider>
  )
}
