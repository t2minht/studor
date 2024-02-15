'use client'

import { Center, Group, MantineProvider, Stack, TextInput, Autocomplete, NumberInput, Button, Textarea, Space, rem } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { submitTutorSessionData } from '../../backend/newSession';

let formValues = {};

export default function Page() {

  const departmentData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const courseNumberData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const courseSectionData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { title: '', description: '', department: '', courseNumber:'', courseSection:'', location:'', groupSize:1, date:new Date(), startTime:'', endTime:''},

    validate: {
      title: (value) => (value.length < 2 ? 'Must have at least 2 characters' : null),
      department: (value) => ((value.length !== 4 || !(/^[a-zA-Z]+$/.test(value))) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      location: (value) => (value.length < 2 ? 'Invalid Location' : null),
      groupSize: (value) => ((value >= 1 && value <= 20) ? null : 'Invalid Group Size'),

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

    form.values.date = form.values.date.toJSON().substring(0,10);
    form.values.startTime = form.values.startTime + ':00';
    form.values.endTime = form.values.endTime + ':00';


    formValues = form.values;
    submitTutorSessionData(formValues);    
  
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
              placeholder="Title of Session"
              required
              {...form.getInputProps('title')}
            />
            <Textarea
              label="Description"
              placeholder="Write a description of the session here"
              mt={15}
              {...form.getInputProps('description')}
            />
            <Group grow mt={15}>
              <Autocomplete
                label="Department"
                placeholder="Enter Four Letters"
                data={departmentData}
                maxDropdownHeight={200}
                required
                {...form.getInputProps('department')}
              />
              <Autocomplete
                label="Course Number"
                placeholder="Enter Three Numbers"
                data={courseNumberData}
                maxDropdownHeight={200}
                required
                {...form.getInputProps('courseNumber')}
              />
              <Autocomplete
                label="Course Section"
                placeholder="Enter Three Numbers"
                data={courseSectionData}
                maxDropdownHeight={200}
                {...form.getInputProps('courseSection')}
              />
            </Group>
            <TextInput
              label="Location"
              placeholder="Location of Session"
              mt={15}
              required
              {...form.getInputProps('location')}
            />
            <Group grow mt={15}>
              <NumberInput
                  label="Group Size"
                  placeholder="Enter a Value 1-20"
                  description="Don't include yourself"
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
      <Space h='xl'/>
    </MantineProvider>
  )
}