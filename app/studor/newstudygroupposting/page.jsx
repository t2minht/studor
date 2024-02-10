'use client'
import { Center, Group, MantineProvider, Stack, TextInput, CloseButton, Autocomplete, NumberInput, Button, Textarea, Space, rem, SegmentedControl, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { submitSessionData } from '../../backend/newSession';

let values = {};

export default function Page() {
  const [titleValue, setTitleValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  var today = new Date();
  var dd = String(today.getDate());
  var mm = String(today.getMonth());
  var yyyy = today.getFullYear();
  const dateTimeRegex = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0[1-9]|[1-2][0-9]|3[01]) \d{4} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9] GMT[+-]\d{4} \([A-Za-z ]+\)$/;
  
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
    initialValues: { title: '', description: '', department: '', courseNumber:'', courseSection:'', location:'', groupSize:'', dateAndTime:today, noiseLevel:'1'},

    validate: {
      title: (value) => (value.length < 2 ? 'Must have at least 2 characters' : null),
      department: (value) => ((value.length != 4 || /^[^a-zA-Z]*$/.test(value)) ? 'Invalid Department' : null),
      courseNumber: (value) => ((value.length != 3 || !(/^\d*$/.test(value))) ? 'Invalid Course Number' : null),
      courseSection: (value) => ((value.length != 3 || !(/^\d*$/.test(value))) ? 'Invalid Course Section' : null),
      location: (value) => (value.length < 2 ? 'Invalid Location' : null),
      groupSize: (value) => ((value > 1 || value < 20) ? null : 'Invalid Group Size'),
      dateAndTime: (value) => (dateTimeRegex.test(value) ? null : 'Invalid date and time'),
      noiseLevel: (value) => ((value.length != 1 || !(/^\d*$/.test(value)) || value > 5 || value < 1) ? 'Invalid Noise Level' : null),
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
  
    const checkingValues = event.target;
    if (!checkingValues.checkValidity()) {
      return console.log('Form is invalid');
    }

    values = form.values; // Get form values
    // console.log('Form values:', values); // Log form values
    submitSessionData(values);    
  
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
        <h1>Create a Session</h1>
      </Center>

      <Center mx={25}>
        <Stack>
          <form onSubmit={handleSubmit}>
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
              value={locationValue}
              mt={15}
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
              <DateTimePicker
                allowDeselect
                valueFormat="DD MMM YYYY hh:mm A"
                label="Date and Time"
                description="Include if AM or PM"
                placeholder="Select a Date and Time"
                minDate={new Date(yyyy, mm, dd)}
                required
                {...form.getInputProps('dateAndTime')}
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