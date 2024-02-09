'use client'
import { Center, Group, MantineProvider, Stack, TextInput, CloseButton, Autocomplete, NumberInput, Button, Textarea, Space } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons-react';
import { useForm } from '@mantine/form';


export default function Page() {
  const [titleValue, setTitleValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  var today = new Date();
  var dd = String(today.getDate());
  var mm = String(today.getMonth());
  var yyyy = today.getFullYear();

  const departmentData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const courseNumberData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { title: '', description: '', department: '', courseNumber:'', location:'', groupSize:1, dateAndTime:''},

    validate: {
      title: (value) => (value.length < 1 ? 'Title must have at least 1 character' : null),
      department: (value) => ((value.length != 4 || /^[^a-zA-Z]*$/.test(value)) ? 'Invalid format of Department' : null),
      courseNumber: (value) => ((value.length != 3 || /^[^\d]*$/.test(value)) ? 'Invalid format of Course Number' : null),
      groupSize: (value) => ((value.length < 1 || value.length < 20) ? 'Invalid number in Group Size' : null),
    },
  });

  // const handleError = (errors) => {
  //   if (errors.title) {
  //     notifications.show({ message: 'Please fill title field', color: 'red' });
  //   } else if (errors.department) {
  //     notifications.show({ message: 'Please provide a valid email', color: 'red' });
  //   }
  //   else {
  //     notifications.show({
  //       withBorder: true,
  //       title: 'Session Created!',
  //       message: 'Your new session was successfully created',
  //       color: 'green',
  //       icon: <IconCircleCheck />,
  //       withCloseButton: true,
  //       loading: false,
  //     })
  //   }
  // };

  return (
    <MantineProvider>
      <Center>
        <h1>Create a Session</h1>
      </Center>

      <Center mx={25}>
        <Stack>
          <form onSubmit={form.onSubmit(console.log)}>
            <TextInput
              label="Title"
              placeholder="Title of Session"
              value={titleValue}
              onChange={(event) => setTitleValue(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setTitleValue('')}
                  style={{ display: titleValue ? undefined : 'none' }}
                />
              }
              required
              {...form.getInputProps('title')}
            />
            <Textarea
              label="Description"
              placeholder="Write a description of the session here"
              {...form.getInputProps('description')}
            />
            <Group grow>
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
            </Group>
            <TextInput
              label="Location"
              placeholder="Location of Session"
              value={locationValue}
              onChange={(event) => setLocationValue(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setLocationValue('')}
                  style={{ display: locationValue ? undefined : 'none' }}
                />
              }
              required
              {...form.getInputProps('location')}
            />
            <Group grow>
              <NumberInput
                  label="Group Size"
                  placeholder="Enter a Value 1-20"
                  description="Don't include yourself."
                  min={1}
                  max={20}
                  required
                  {...form.getInputProps('groupSize')}
                />
              <DateTimePicker
                allowDeselect
                clearable
                valueFormat="DD MMM YYYY hh:mm A"
                label="Date and Time"
                description="Include if AM or PM."
                placeholder="Select a Date and Time"
                value={dateValue}
                onChange={setDateValue}
                minDate={new Date(yyyy, mm, dd)}
                required
                {...form.getInputProps('dateAndTime')}
              />
            </Group>
            <Button 
              type='submit'
              mt="md" 
              variant="filled" 
              color='#800000' 
              radius="xl" 
              >
              Post Session
            </Button>
          </form>
        </Stack>
      </Center>
      <Space h='xl'/>
    </MantineProvider>
  )
}