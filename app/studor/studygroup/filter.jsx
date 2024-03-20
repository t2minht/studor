import { ActionIcon, Autocomplete, Button, Center, Checkbox, Drawer, Group, NativeSelect, NumberInput, SegmentedControl, Stack, Text, rem } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconCircleCheck, IconCircleX, IconClock, IconFilter, IconVolume, IconVolume2, IconVolumeOff, IconXboxX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const departmentData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

const courseNumberData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

const courseSectionData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

export default function Filter({ departments }) {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClientComponentClient();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
  const [selectedCourseSection, setSelectedCourseSection] = useState('');
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [courseSections, setCourseSections] = useState([]);

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

  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  currentDate.setDate(currentDay + 1);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { department: '', courseNumber: '', courseSection: '', minGroupSize: null, maxGroupSize: null, startDate: new Date(), endDate: currentDate, startTime: '', endTime: '', noiseLevel: 'None' },

    validate: {
      department: (value, allValues) => allValues.department && ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value, allValues) => allValues.courseNumber && ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      minGroupSize: (value, allValues) => allValues.minGroupSize && ((allValues.minGroupSize >= 2 && allValues.minGroupSize <= 20) ? null : 'Invalid Group Size'),
      maxGroupSize: (value, allValues) => allValues.maxGroupSize && ((allValues.maxGroupSize >= 2 && allValues.maxGroupSize <= 20 && allValues.maxGroupSize >= allValues.minGroupSize) ? null : 'Invalid Group Size'),
      noiseLevel: (value) => ((value > 5 || value < 1 || value != '') ? 'Invalid Noise Level' : null),
      startDate: (value) => {

        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear, currentDate.getMonth(), currentDate.getDate());

        if (value < today) {
          return 'Date must be in the future';
        }
        return null;
      },
      endDate: (value, allValues) => {

        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear, currentDate.getMonth(), currentDate.getDate());

        if (value < today || value < allValues.startDate) {
          return 'Date must be in the future';
        }
        return null;
      },
      endTime: (value, allValues) => (
        allValues.startTime && allValues.endTime && allValues.endTime <= allValues.startTime ? 'End time must be after start time' : null
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

  const handleFilter = (event) => {
    event.preventDefault();
  }

  const handleReset = (event) => {
    event.preventDefault();

    form.reset();
    form.setFieldValue('department', '');
    form.setFieldValue('courseNumber', '');
    form.setFieldValue('courseSection', '');
    form.setInitialValues({ values: 'object' });
    form.setFieldValue('minGroupSize', '');
    form.setFieldValue('maxGroupSize', '');
    form.setFieldValue('startTime', '');
    form.setFieldValue('endTime', '');
    form.setFieldValue('noiseLevel', 'None');
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Filter"
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
      >
        <Text fw={700}>Courses</Text>
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="CSCE 472"
        />
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="ENGL 210"
        />
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="ITSV 308"
        />
        <form onSubmit={handleFilter}>
          <Group grow mt={15}>
            <NativeSelect
              label="Department"
              placeholder="Select a Department"
              data={departments.map((department) => ({ value: department, label: department }))}
              required
              {...form.getInputProps('department')}
              value={selectedDepartment}
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
          <Stack align="center" mt='sm'>
            <Button
              onClick={handleSubmit}
              variant="filled"
              color='#800000'
              radius="xl"
            >
              + Add Course
            </Button>
          </Stack>
          <Text fw={700} mt={20}>Dates</Text>
          <Group>
            <DatePickerInput
              allowDeselect
              valueFormat="YYYY MMM DD"
              label="Start Date"
              defaultValue={new Date()}
              minDate={new Date()}
              {...form.getInputProps('startDate')}
            />
            <Text>to</Text>
            <DatePickerInput
              allowDeselect
              valueFormat="YYYY MMM DD"
              label="End Date"
              defaultValue={currentDate}
              minDate={currentDate}
              {...form.getInputProps('endDate')}
            />
          </Group>
          <Text fw={700} mt={30}>Times</Text>
          <Group grow>
            <TimeInput
              leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              label="Start Time"
              maw={150}
              description="Enter AM or PM"
              {...form.getInputProps('startTime')}
            />
            <TimeInput
              leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              label="End Time"
              maw={150}
              description="Enter AM or PM"
              {...form.getInputProps('endTime')}
            />
          </Group>
          <Text fw={700} mt={30}>Group Sizes</Text>
          <Group>
            <NumberInput
              label="Min Group Size"
              placeholder="Enter a value"
              description="Include yourself (2-20)"
              min={2}
              max={20}
              maw={150}
              {...form.getInputProps('minGroupSize')}
            />
            <NumberInput
              label="Max Group Size"
              placeholder="Enter a value"
              description="Include yourself (2-20)"
              min={2}
              max={20}
              maw={150}
              {...form.getInputProps('maxGroupSize')}
            />
          </Group>

          <Text fw={700} mt={30}>Noise Level</Text>
          <SegmentedControl color="#800000" data={[
            {
              value: 'None',
              label: (
                <Center style={{ gap: 10 }}>
                  <IconVolumeOff style={{ width: rem(16), height: rem(16) }} />
                  <span>No Preference</span>
                </Center>
              ),
            },
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
          <Group justify="center" mt="lg">
            <Button
              onClick={handleReset}
              type='submit'
              variant="filled"
              color='red'
              radius="xl"
            >
              Reset
            </Button>
            <Button
              type='submit'
              variant="filled"
              color='#800000'
              radius="xl"
            >
              Apply Filters
            </Button>
          </Group>
        </form>
      </Drawer>

      <ActionIcon
        onClick={open}
        variant="filled"
        size="xl"
        color="#800000"
        aria-label="Filter"
      >
        <IconFilter style={{ width: "90%", height: "90%" }} stroke={2} />
      </ActionIcon>
    </>

  );
}