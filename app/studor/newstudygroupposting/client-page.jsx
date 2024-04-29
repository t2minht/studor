'use client'
import { Center, Group, MantineProvider, Stack, TextInput, Autocomplete, NumberInput, Button, Textarea, Space, rem, SegmentedControl, Text, NativeSelect, Tooltip, Modal } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX, IconClock, IconInfoCircle, IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { submitStudyGroupSessionData } from '../../backend/study-session-backend';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Image from 'next/image';
import logo from '@/app/ui/zoom_logo.gif';

let formValues = {};

export default function ClientPage(data) {
    const { height, width } = useViewportSize();
    const supabase = createClientComponentClient();
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
    const [selectedCourseSection, setSelectedCourseSection] = useState('');
    const [courseNumbers, setCourseNumbers] = useState([]);
    const [courseSections, setCourseSections] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);


    // when the page loads, updates the departments with the list of departments in the database
    useEffect(() => {
        const fetchData = async () => {
            const numbers = await getCourseNumbers(selectedDepartment);
            const allNumbers = [''].concat(numbers);
            setCourseNumbers(allNumbers);
        };

        fetchData();

        form.values.department = selectedDepartment;
    }, [selectedDepartment]);

    // helper to update possible course numbers when the department is selected
    useEffect(() => {
    }, [courseNumbers]);

    // updates form value when the course number is selected
    useEffect(() => {
        form.values.courseNumber = selectedCourseNumber;
    }, [selectedCourseNumber]);

    // updates the course section in the form when the user selects one
    useEffect(() => {
        form.values.courseSection = selectedCourseSection;
    }, [selectedCourseSection]);

    // client-side database call that retrieves the possible section numbers for a selected class 
    const getSectionNumbers = async (courseNumber) => {
        try {
            const { data: returned_data, error } = await supabase.from("course_catalog")
                .select('SectionNum',)
                .eq('Department', selectedDepartment)
                .eq('CourseNum', courseNumber)
                .order('SectionNum', { ascending: true });


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

    // client-side database call that retrieves the possible course numbers when a department is selected 
    const getCourseNumbers = async (department) => {
        try {
            const { data: returned_data, error: error1 } = await supabase.from("course_catalog")
                .select('CourseNum',)
                .eq('Department', department)
                .order('CourseNum', { ascending: true });

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

    // when a new department is selected, this pulls the possible course numbers from the database and updates the state variable
    const handleDepartmentChange = async (selectedDepartment) => {
        try {
            const numbers = await getCourseNumbers(selectedDepartment);
            setCourseNumbers(numbers);
        } catch (error) {
            console.error('Error updating course numbers:', error);
        }
    }

    // when a new course number is selected, this pulls the possible course sections from the database and updates the state variable
    const handleCourseNumberChange = async (selectedCourseNumber) => {
        try {
            const sections = await getSectionNumbers(selectedCourseNumber);
            const allSections = [''].concat(sections);
            setCourseSections(allSections);
        } catch (error) {
            console.error('Error updating course sections:', error);
        }
    }

    // Form validation for input fields
    const form = useForm({
        validateInputOnChange: true,
        initialValues: { title: '', description: '', department: '', courseNumber: '', courseSection: '', location: '', groupSize: 2, date: new Date(), startTime: '', endTime: '', noiseLevel: '3' },

        // Below are the rules/parameters the input fields need to follow before being submitted
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
            groupSize: (value) => ((value >= 2 && value <= 20) ? null : 'Invalid Group Size'),
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

    // Submits all of the data properly formatted to the backend
    const handleSubmit = (event) => {
        // Prevent default form submission
        event.preventDefault(); 

        // refuses to submit form if inputs are invalid
        if (!form.isValid()) {

            // console.log(form.values)
            // console.log('Form is invalid');
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

        // properly formats dates and time before submitting to backend
        form.values.date = form.values.date.toJSON().substring(0, 10);
        form.values.startTime = form.values.startTime + ':00';
        form.values.endTime = form.values.endTime + ':00';

        formValues = form.values;
        submitStudyGroupSessionData(formValues);

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
        }, 1000);
    };

    // UI components to render on the page using Mantine library
    // Purpose is form submission to create a new study group session
    // Input fields include: Title, Description, Department, Course #, Course Section, Location, Group Size, Date, Start Time, End Time, and Noise Level
    return (
        <MantineProvider>
            <Center pl={50} pr={50}>
                <h1>Create a Study Group Session</h1>
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
                                placeholder="Select a Department"
                                data={data.departments.map((department) => ({ value: department, label: department }))}
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
                                defaultValue={new Date()}
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
                            <Group justify='center'>
                                <Text mr={-10} ta="center" size="sm" fw={500}>Noise Level</Text>
                                <Tooltip label="How loud sessions are. 1=mostly quiet; occasional questions. 5=constant discussions.">
                                    <IconInfoCircle />
                                </Tooltip>
                            </Group>
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
                            <Modal opened={opened} onClose={close} withCloseButton={false} centered>
                                <stack>
                                    <Text ta="center">Session has been created! </Text>
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
                                mt="md"
                                variant="filled"
                                color='#800000'
                                radius="xl"
                                onClick={open}
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