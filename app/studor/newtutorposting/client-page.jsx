'use client'

import { Center, Group, MantineProvider, Stack, TextInput, Autocomplete, NumberInput, Button, Textarea, Space, rem, Select, NativeSelect } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { submitTutoringSession } from '../../backend/tutoring-backend';
import { useState } from 'react';

let formValues = {};

export default function ClientPage(data) {

  // const [courseNumbers, setCourseNumbers] = useState([]);
  // const handleDepartmentChange = (selectedDepartment) => {
  //   setCourseNumbers(getCourseNumbersFor(selectedDepartment));
  // }

  const courseNumberData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

  const courseSectionData = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { title: '', description: '', department: '', courseNumber: '', courseSection: '', location: '', groupSize: 2, date: new Date(), startTime: '', endTime: '' },

    validate: {
      title: (value) => ((value.length < 2 || value.length > 100) ? 'Must be between 2-100 characters' : null),
      description: (value, allValues) => (
        allValues.description && (value.length > 500) ? 'Invalid Description' : null
      ),
      department: (value) => ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      location: (value) => ((value.length < 2 || value.length > 100) ? 'Invalid Location' : null),
      groupSize: (value) => ((value >= 2 && value <= 20) ? null : 'Invalid Group Size'),
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
    submitTutoringSession(formValues);

    notifications.show({
      withBorder: true,
      color: "green",
      radius: "md",
      icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
      title: 'New Session Created! Redirecting...',
      message: "Now redirecting to Landing Page",
    });

    // Redirect to the new page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 5000);
  };

  return (
    <MantineProvider>
      <Center>
        <h1>Create a Tutoring Session</h1>
      </Center>

      <Center mx={25}>
        <Stack>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              description="Limit of 100 characters"
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
                placeholder="Select a Department"
                data={data.departments.map((department) => ({ value: department, label: department }))}
                required
                {...form.getInputProps('department')}
              />
              <NativeSelect
                label="Course Number"
                placeholder="Enter Three Numbers"
                data={courseNumberData}
                maxDropdownHeight={200}
                required
                {...form.getInputProps('courseNumber')}
              />
              <NativeSelect
                label="Course Section"
                placeholder="Enter Three Numbers"
                data={courseSectionData}
                maxDropdownHeight={200}
                {...form.getInputProps('courseSection')}
              />
            </Group>
            <TextInput
              label="Location"
              description="Limit of 100 characters"
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
                defaultValue={new Date()}
                minDate={new Date()}
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
            <Stack align="center" mt={20}>
              <Button
                type='submit'
                mt="md"
                variant="filled"
                color='#800000'
                radius="xl"
              >
                Post Session
              </Button>
            </Stack>
          </form>
        </Stack>
      </Center>
      <Space h='xl' />
    </MantineProvider>
  )
}