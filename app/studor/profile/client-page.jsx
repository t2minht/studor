'use client'
import {
    MantineProvider,
    Group,
    Center,
    Stack,
    Avatar,
    Input,
    Button,
    Table,
    ScrollArea,
    Space,
    Text,
    FileButton,
    Checkbox,
    rem,
    Autocomplete
} from "@mantine/core";
import { IconAt, IconCalendarPlus, IconCircleCheck, IconCircleX, IconPencil, IconUpload } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react';
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

export default function ClientPage({ sessions, user, tutor_sessions }) {
    const [data, setData] = useState([]);

    const [selection, setSelection] = useState([]);
    const toggleRow = (id) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

    const [studySessions, setStudySessions] = useState(sessions);
    const [userData, setUserData] = useState(user);

    const sessionHistoryRows = studySessions.map((session) => (
        <Table.Tr key={session.id}>
            <Table.Td>{session.topic}</Table.Td>
            <Table.Td> {session?.department + ' ' + session?.course_number + (session.section ? ' - ' + session?.section : '')}</Table.Td>
            <Table.Td>{session.date}</Table.Td>
            <Table.Td> <Modalview current={session} /> </Table.Td>
        </Table.Tr>
    ));

    const tutoringHistoryRows = tutor_sessions.map((session) => (
        <Table.Tr key={session.id}>
            <Table.Td>{session.title}</Table.Td>
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

    return (
        <>
            <MantineProvider>
                <Center>
                    <h1>Profile</h1>
                </Center>

                <Center>
                    <Group gap="xl" justify="center">
                        <Stack>
                            <Avatar
                                size={200}
                                src={userData.avatar_url}
                            />
                        </Stack>
                        <Stack>
                            <Group justify="center">
                                <IconPencil size={16} />
                                <Text fw={700}>{userData.name}</Text>
                            </Group>
                            <Group justify="center">
                                <IconAt size={16} />
                                <Text>{userData.email}</Text>
                            </Group>
                            <Group justify="center">
                                <FileButton color="indigo" leftSection={<IconCalendarPlus size={16} />} resetRef={resetSchedule} onChange={setSchedule} accept=".ics">
                                    {(props) => <Button {...props}>Import Schedule (*.ics)</Button>}
                                </FileButton>
                                <Button disabled={!schedule} color="red" onClick={clearSchedule}>
                                    Reset
                                </Button>
                            </Group>
                            {schedule && (
                                <Text size="sm" mt={-10} ta="center">
                                    Selected file: {schedule.name}
                                </Text>
                            )}
                            <Group justify="center">
                                <FileButton color="violet" leftSection={<IconUpload size={16} />} resetRef={resetTranscript} onChange={setTranscript} accept="application/pdf">
                                    {(props) => <Button {...props}>Upload Transcript</Button>}
                                </FileButton>
                                <Button disabled={!transcript} color="red" onClick={clearTranscript}>
                                    Reset
                                </Button>
                            </Group>
                            {transcript && (
                                <Text size="sm" mt={-10} ta="center">
                                    Selected file: {transcript.name}
                                </Text>
                            )}
                        </Stack>
                    </Group>
                </Center>
                <Stack mt={60} mx={50}>
                    <Text ta="center" size="lg" fw={700}>My Courses</Text>
                    <form onSubmit={handleSubmit}>
                        <Group grow mt={0}>
                            <Stack>
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
                                    required
                                    {...form.getInputProps('courseSection')}
                                />
                                <Stack align="center">
                                    <Button
                                        type='submit'
                                        mt="md"
                                        variant="filled"
                                        color='#800000'
                                        radius="xl"
                                    >
                                        Add Course
                                    </Button>
                                </Stack>
                            </Stack>

                            <Stack>
                                <ScrollArea mb={-20} h={225}>
                                    <Table stickyHeader striped withTableBorder highlightOnHover>
                                        <Table.Thead style={{ color: 'white' }} bg='#800000'>
                                            <Table.Tr>
                                                <Table.Th style={{ width: rem(40) }}>
                                                    <Checkbox
                                                        onChange={toggleAll}
                                                        checked={selection.length === data.length}
                                                        indeterminate={selection.length > 0 && selection.length !== data.length}
                                                    />
                                                </Table.Th>
                                                <Table.Th>Department</Table.Th>
                                                <Table.Th>Course Number</Table.Th>
                                                <Table.Th>Section</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>{coursesRows}</Table.Tbody>
                                    </Table>
                                </ScrollArea>
                                <Stack align="center">
                                    <Button
                                        variant="filled"
                                        color='#800000'
                                        mt="md"
                                        radius="xl"
                                        disabled={(selection == undefined || selection.length == 0) ? true : false}
                                        onClick={handleDelete}
                                    >
                                        Delete Course
                                    </Button>
                                </Stack>
                            </Stack>
                        </Group>
                    </form>
                </Stack>

                <Group grow>
                    <Stack mt={50} pl={50}>
                        <Text ta="center" size="lg" fw={700}>Study Group History</Text>
                        <ScrollArea h={250}>
                            <Table stickyHeader striped withTableBorder highlightOnHover>
                                <Table.Thead style={{ color: 'white' }} bg='#800000'>
                                    <Table.Tr>
                                        <Table.Th>Topic</Table.Th>
                                        <Table.Th>Course</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Details</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{sessionHistoryRows}</Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                    <Stack mt={50} pr={50}>
                        <Text ta="center" size="lg" fw={700}>Tutoring History</Text>
                        <ScrollArea h={250}>
                            <Table stickyHeader striped withTableBorder highlightOnHover>
                                <Table.Thead style={{ color: 'white' }} bg='#800000'>
                                    <Table.Tr>
                                        <Table.Th>Topic</Table.Th>
                                        <Table.Th>Course</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Details</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{tutoringHistoryRows}</Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Group>
                <Space h='xl' />
            </MantineProvider>
        </>
    )
}