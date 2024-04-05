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
    Autocomplete,
    NativeSelect,
    LoadingOverlay,
    Modal,
    ColorPicker
} from "@mantine/core";
import { IconAt, IconCalendarPlus, IconCircleCheck, IconCircleX, IconPencil, IconUpload } from '@tabler/icons-react';
import React, { useRef, useState, useEffect } from 'react';
import { retrieveProfileStudySession, retrieveUserProfileInfo } from "@/app/backend/study-session-backend";
import cx from 'clsx';
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import Modalview from "../../ui/modalview";
// import ModalColorPicker from "../../ui/modalcolorpicker";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { sendEvents } from '../../backend/calendar-backend';
import { setStudySessionColor, setTutorSessionColor } from '../../backend/calendar-backend';
import { sendManualClasses } from "@/app/backend/classes-backend";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import Modaltprofile from "@/app/ui/modaltprofile";
import { addTutorCourses } from "@/app/backend/tutoring-backend";

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

/*
// function parseICS(icsString) {
//     let reader = new FileReader();
//     reader.readAsText(icsString);
//     let results;
//     reader.onload = function () {
//         console.log("results");
//         console.log(reader.result);

//         // results = JSON.stringify(parseICS(reader.result))
//         const lines = reader.result.split('\n');
//         const events = [];
//         let event;
//         for (let i = 0; i < lines.length; i++) {
//             // console.log(lines[i]);
//             const line = lines[i].trim();
//             // console.log(line);
//             if (line === 'BEGIN:VEVENT') { event = {}; }
//             else if (line === 'END:VEVENT') { events.push(event); }
//             else if (event) {
//                 console.log("event: "  + JSON.stringify(event));
//                 console.log(line);
//                 const match = /^([A-Z]+):(.*)$/.exec(line);
//                 console.log(match);
//                 if (match) {const [, key, value] = match; event[key] = value; }
//             }
//         }
//         // return events; 
//         console.log(events);
//         results = JSON.stringify(events);

//         sendEvents(results);
//     };
//     reader.onerror = function () {
//         console.log(reader.error);
//     };
// };
*/

function parseICS(icsString) {
    let reader = new FileReader();
    reader.readAsText(icsString);
    reader.onload = function () {
        console.log(reader.result);
        const lines = reader.result.split("\n");
        const events = [];
        let event;
        lines.map((line) => {  // eventsList.push({id: id++, text: parser[i].SUMMARY, start: DoWday + dtstart, end: DoWday + dtend});
            line = line.trim();
            if (line === 'BEGIN:VEVENT') { event = {}; }
            else if (line === 'END:VEVENT') { event["backColor"] = "#CCCCCC"; event["fontColor"] = "#000000"; events.push(event); }
            else if (event) {
                if (line.includes("SUMMARY")) {
                    event["text"] = line.split("SUMMARY:")[1];
                } else if (line.toLowerCase().includes("dtstart")) {
                    let temp = line.split(":")[1];
                    if (temp.includes("Z")) {
                        let oldDate = new Date(temp.substr(0, 4) + "-" + temp.substr(4, 2) + "-" + temp.substr(6, 5) + ":" + temp.substr(11, 2) + ":" + temp.substr(13, 2) + ".000Z");
                        oldDate = new Date(oldDate.toLocaleString("en-US", { timeZone: 'America/Chicago' }));
                        temp = oldDate.getFullYear() + "-" + ((oldDate.getMonth() + 1) + "").padStart(2, '0') + "-" + (oldDate.getDate() + "").padStart(2, '0') + "T" + oldDate.toTimeString().substr(0, 8);
                    } else {
                        temp = temp.substr(0, 4) + "-" + temp.substr(4, 2) + "-" + temp.substr(6, 5) + ":" + temp.substr(11, 2) + ":" + temp.substr(13, 2);
                    }

                    event["start"] = temp;
                } else if (line.toLowerCase().includes("dtend")) {
                    let temp = line.split(":")[1];
                    if (temp.includes("Z")) {
                        let oldDate = new Date(temp.substr(0, 4) + "-" + temp.substr(4, 2) + "-" + temp.substr(6, 5) + ":" + temp.substr(11, 2) + ":" + temp.substr(13, 2) + ".000Z");
                        oldDate = new Date(oldDate.toLocaleString("en-US", { timeZone: 'America/Chicago' }));
                        temp = oldDate.getFullYear() + "-" + ((oldDate.getMonth() + 1) + "").padStart(2, '0') + "-" + (oldDate.getDate() + "").padStart(2, '0') + "T" + oldDate.toTimeString().substr(0, 8);
                    } else {
                        temp = temp.substr(0, 4) + "-" + temp.substr(4, 2) + "-" + temp.substr(6, 5) + ":" + temp.substr(11, 2) + ":" + temp.substr(13, 2);
                    }
                    event["end"] = temp;
                } else if (line.toLowerCase().includes("rrule")) {
                    event["rrule"] = line.split(":")[1];
                }
            }
        });
        console.log(events);
        let results = JSON.stringify(events);
        console.log("results");
        console.log(results);
        sendEvents(results);
    };
    reader.onerror = function () {
        console.log(reader.error);
    };
};

export default function ClientPage({ sessions, user, tutor_sessions, departments, colorPrefs }) {
    const { height, width } = useViewportSize();
    const [data, setData] = useState([]);


    // for color picking modal
    const [opened, handlers] = useDisclosure(false); 
    const [value, onChange] = useState(colorPrefs.study_session_color);

    const [visible, setVisible] = useState(false);

    function colorChoice(color){
        onChange(color);
        setStudySessionColor(color);
        handlers.close();
    }
    //////////////////////////////////////
    // for color picking modal 2
    const [opened2, handlers2] = useDisclosure(false); 
    const [value2, onChange2] = useState(colorPrefs.tutor_session_color);

    function colorChoice2(color2){
        onChange2(color2);
        setTutorSessionColor(color2);
        handlers2.close();
    }
    //////////////////////////////////////

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

    const tutoringHistoryRows = tutor_sessions.map((session) => {
        session.averageRating = session.users.tutor_rating;
        return (
            <Table.Tr key={session.id}>

                <Table.Td>{session.title}</Table.Td>
                <Table.Td> {session?.department + ' ' + session?.course_number + (session.section ? ' - ' + session?.section : '')}</Table.Td>
                <Table.Td>{session.date}</Table.Td>
                <Table.Td> <Modaltprofile current={session} userID={user.id} /> </Table.Td>
            </Table.Tr>
        )
    });

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

    const uploadTranscript = async (event) => {
        setVisible(true);
        const first_name = userData.name.split(' ')[0];
        const formData = new FormData();
        formData.append('pdf', transcript);
        formData.append('user_name', first_name)
        try {
            const response = await fetch('https://smmathen.pythonanywhere.com/upload_file', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data from Flask server');
            }
            const classes = await response.json();
            addTutorCourses(classes);
            clearTranscript();
            alert("Transcript was successfully uploaded!");
            setVisible(false);
        } catch (error) {
            alert("Transcript was invalid! Please try again.");
            console.error('Error fetching data from Flask server:', error);
            setVisible(false);
        }
    };

    const uploadSchedule = (event) => {

        const file = schedule;
        console.log("sending file");

        let eve = parseICS(file);
        // console.log(eve);

        clearSchedule();
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
        // console.log(data);
        sendManualClasses(JSON.stringify(data));

        form.reset(); // Reset form fields
        setSelectedDepartment('');
        setSelectedCourseNumber('');
        setSelectedCourseSection('');

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

    const supabase = createClientComponentClient();
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
    const [selectedCourseSection, setSelectedCourseSection] = useState('');
    const [courseNumbers, setCourseNumbers] = useState([]);
    const [courseSections, setCourseSections] = useState([]);


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
        <>
            <MantineProvider>
                <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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
                                <Text>Study Group Default Color:</Text>
                                <Modal opened={opened} onClose={() => handlers.close()} title={"Select A Color"}>
                                    <Stack align='center'>
                                        <ColorPicker 
                                            format="hex"
                                            
                                            value={value}
                                            onChange={(color) => colorChoice(color)}
                                            withPicker={false}
                                            swatchesPerRow={9}
                                            swatches={[
                                                '#FFFFFF', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#9900FF', '#FF00FF', 
                                                '#CCCCCC', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD', 
                                                '#666666', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79', 
                                                '#000000', '#990000', '#B45f06', '#BF9000', '#38761D', '#134F5C', '#114297', '#351C75', '#741B47', 
                                            ]}
                                        />
                                    </Stack>
                                </Modal>
                                <Button
                                    onClick={() => handlers.open()}
                                    color={value}
                                    maw={30}
                                    style={{borderColor: 'black'}}
                                    >
                                    Color
                                </Button>
                            </Group>
                            <Group justify="center">
                                <Text>Tutoring Default Color:</Text>
                                <Modal opened={opened2} onClose={() => handlers2.close()} title={"Select A Color"}>
                                    <Stack align='center'>
                                        <ColorPicker 
                                            format="hex"
                                            
                                            value={value2}
                                            onChange={(color2) => colorChoice2(color2)}
                                            withPicker={false}
                                            swatchesPerRow={9}
                                            swatches={[
                                                '#FFFFFF', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#9900FF', '#FF00FF', 
                                                '#CCCCCC', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD', 
                                                '#666666', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79', 
                                                '#000000', '#990000', '#B45f06', '#BF9000', '#38761D', '#134F5C', '#114297', '#351C75', '#741B47', 
                                            ]}
                                        />
                                    </Stack>
                                </Modal>
                                <Button
                                    onClick={() => handlers2.open()}
                                    color={value2}
                                    maw={30}
                                    style={{borderColor: 'black'}}
                                    >
                                    Color
                                </Button>
                            </Group>
                            {width > 420 ?
                                <Group justify="center">
                                    <FileButton color="indigo" leftSection={<IconCalendarPlus size={16} />} resetRef={resetSchedule} onChange={setSchedule} accept=".ics" id="calendar">
                                        {(props) => <Button {...props}>Import Schedule (*.ics)</Button>}
                                    </FileButton>
                                    <Button disabled={!schedule} color="Green" onClick={uploadSchedule}>
                                        Upload
                                    </Button>
                                    <Button disabled={!schedule} color="red" onClick={clearSchedule}>
                                        Reset
                                    </Button>
                                </Group>
                                :
                                <>
                                    <Stack align="center">
                                        <FileButton color="indigo" leftSection={<IconCalendarPlus size={16} />} resetRef={resetSchedule} onChange={setSchedule} accept=".ics" id="calendar">
                                            {(props) => <Button {...props}>Import Schedule (*.ics)</Button>}
                                        </FileButton>
                                    </Stack>
                                    <Group justify="center">
                                        <Button disabled={!schedule} color="Green" onClick={uploadSchedule}>
                                            Upload
                                        </Button>
                                        <Button disabled={!schedule} color="red" onClick={clearSchedule}>
                                            Reset
                                        </Button>
                                    </Group>
                                </>
                            }
                            {schedule && (
                                <Text size="sm" mt={-10} ta="center">
                                    Selected file: {schedule.name}
                                </Text>
                            )}
                            {width > 420 ?
                                <Group justify="center">
                                    <FileButton color="violet" leftSection={<IconUpload size={16} />} resetRef={resetTranscript} onChange={setTranscript} accept="application/pdf">
                                        {(props) => <Button {...props}>Upload Transcript</Button>}
                                    </FileButton>
                                    <Button disabled={!transcript} color="Green" onClick={uploadTranscript}>
                                        Upload
                                    </Button>
                                    <Button disabled={!transcript} color="red" onClick={clearTranscript}>
                                        Reset
                                    </Button>
                                </Group>
                                :
                                <>
                                    <Stack align="center">
                                        <FileButton color="violet" leftSection={<IconUpload size={16} />} resetRef={resetTranscript} onChange={setTranscript} accept="application/pdf">
                                            {(props) => <Button {...props}>Upload Transcript</Button>}
                                        </FileButton>
                                    </Stack>
                                    <Group justify="center">
                                        <Button disabled={!transcript} color="Green" onClick={uploadTranscript}>
                                            Upload
                                        </Button>
                                        <Button disabled={!transcript} color="red" onClick={clearTranscript}>
                                            Reset
                                        </Button>
                                    </Group>
                                </>
                            }

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
                        {width > 720 ?
                            <Group grow mt={0}>
                                <Stack>
                                    <NativeSelect
                                        label="Department"
                                        placeholder="Enter Four Letters"
                                        data={departments.map((department) => ({ value: department, label: department }))}
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
                                        required
                                        disabled={!selectedCourseNumber}
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
                            :
                            <>
                                <Stack>
                                    <NativeSelect
                                        label="Department"
                                        placeholder="Enter Four Letters"
                                        data={departments.map((department) => ({ value: department, label: department }))}
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

                                <Stack mt={50}>
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
                            </>
                        }
                    </form>
                </Stack>

                {width > 1000 ?
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
                    :
                    <>
                        <Stack mt={50} pl={50} pr={50}>
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
                        <Stack mt={50} pl={50} pr={50}>
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
                    </>
                }
                <Space h='xl' />
            </MantineProvider>
        </>
    )
}