'use client'
import { Center, Group, MantineProvider, Stack, TextInput, CloseButton, Autocomplete, NumberInput, Button } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates';
import { useState } from 'react';
export default function Page() {
  const [titleValue, titleSetValue] = useState('');
  const [locationValue, locationSetValue] = useState('');
  const departmentData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  const courseNumberData = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`);

  return (
    <MantineProvider>
      <Center>
        <h1>Create a Session</h1>
      </Center>

      <Center>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Title of Session"
            value={titleValue}
            onChange={(event) => titleSetValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => titleSetValue('')}
                style={{ display: titleValue ? undefined : 'none' }}
              />
            }
            required
          />
          <Group grow>
            <Autocomplete
              label="Department"
              placeholder="Enter Four Characters"
              data={departmentData}
              maxDropdownHeight={200}
              required
            />
            <Autocomplete
              label="Course Number"
              placeholder="Enter Three Numbers"
              data={courseNumberData}
              maxDropdownHeight={200}
              required
            />
          </Group>
          <TextInput
            label="Location"
            placeholder="Location of Session"
            value={locationValue}
            onChange={(event) => locationSetValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => locationSetValue('')}
                style={{ display: locationValue ? undefined : 'none' }}
              />
            }
            required
          />
          <Group grow>
            <NumberInput
                label="Group Size"
                placeholder="Enter a Value 1-20"
                min={1}
                max={20}
                required
              />
            <DateTimePicker
              clearable
              valueFormat="DD MMM YYYY hh:mm A"
              label="Date and Time"
              placeholder="Select a Date and Time"
              required
            />
          </Group>
          <Button mt="xl" variant="filled" color='#800000' radius="xl">Post Session</Button>
        </Stack>
      </Center>
    </MantineProvider>
  )
}