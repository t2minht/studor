import { ActionIcon, Autocomplete, Button, Center, Checkbox, Drawer, Group, NumberInput, SegmentedControl, Stack, Text, rem } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck, IconCircleX, IconClock, IconFilter, IconVolume, IconVolume2, IconVolumeOff, IconXboxX } from "@tabler/icons-react";

const departmentData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

const courseNumberData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

const courseSectionData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

export default function Filter(data) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { department: '', courseNumber: '', courseSection: '', groupSize: 2, startDate: '', endDate:'', startTime: '', endTime: '', noiseLevel: '' },

    validate: {
      department: (value) => ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      groupSize: (value) => ((value >= 2 && value <= 20) ? null : 'Invalid Group Size'),
      noiseLevel: (value) => (( value > 5 || value < 1) ? 'Invalid Noise Level' : null),
      date: (value) => {

        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear, currentDate.getMonth(), currentDate.getDate());
        
        if (value < today){
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
  }

  return(
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
            <Autocomplete
              label="Department"
              placeholder="4 Letters"
              data={departmentData}
              maxDropdownHeight={200}
              required
              {...form.getInputProps('department')}
            />
            <Autocomplete
              label="Course #"
              placeholder="3 Numbers"
              data={courseNumberData}
              maxDropdownHeight={200}
              required
              {...form.getInputProps('courseNumber')}
            />
            <Autocomplete
              label="Course Section"
              placeholder="3 Numbers"
              data={courseSectionData}
              maxDropdownHeight={200}
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
              defaultValue={new Date()}
              minDate={new Date()}
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
              description="Include yourself"
              min={1}
              max={20}
              maw={150}
              {...form.getInputProps('minGroupSize')}
             />
             <NumberInput
              label="Max Group Size"
              placeholder="Enter a value"
              description="Include yourself"
              min={1}
              max={20}
              maw={150}
              {...form.getInputProps('maxGroupSize')}
             />
          </Group>

          <Text fw={700} mt={30}>Noise Level</Text>
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