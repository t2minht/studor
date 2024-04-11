import { ActionIcon, Autocomplete, Button, Center, Checkbox, Drawer, Group, NativeSelect, NumberInput, SegmentedControl, Stack, Text, rem } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconCircleCheck, IconCircleX, IconClock, IconFilter, IconVolume, IconVolume2, IconVolumeOff, IconX, IconXboxX } from "@tabler/icons-react";
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

export default function Filter({ departments, study_sessions, sendDataToParent }) {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClientComponentClient();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
  const [selectedCourseSection, setSelectedCourseSection] = useState('');
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [courseSections, setCourseSections] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [filtered_posts, setData] = useState("");

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
  currentDate.setDate(currentDay + 31);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { department: '', courseNumber: '', courseSection: '', minGroupSize: null, maxGroupSize: null, startDate: new Date(), endDate: currentDate, startTime: '', endTime: '', noiseLevel: 'None' },

    validate: {
      department: (value, allValues) => allValues.department && ((allValues.department.length !== 4 || !(/^[a-zA-Z]+$/.test(allValues.department))) ? 'Invalid Department' : null),
      courseNumber: (value, allValues) => allValues.courseNumber && ((allValues.courseNumber.length !== 3 || !(/^\d{3}$/.test(Number(allValues.courseNumber)))) ? 'Invalid Course Number' : null),
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

    let filtered_posts = [];
    let fit_filter = false;

    for (let i = 0; i < study_sessions.length; i++) {
      // courses filter
      if (coursesList.length != 0) {
        let course = study_sessions[i].department + " " + study_sessions[i].course_number;
        if (study_sessions[i].section != 0) {
          course = study_sessions[i].department + " " + study_sessions[i].course_number + "-" + study_sessions[i].section;
        }
        if (coursesList.includes(course) || coursesList.includes(study_sessions[i].department + " " + study_sessions[i].course_number) || coursesList.includes(study_sessions[i].department + " ")) {
          fit_filter = true;
        }
        else {
          continue;
        }
      }
      else {
        fit_filter = true;
      }

      // dates filter
      var date = new Date(form.values.startDate);
      // Get year, month, and day part from the date
      var year = date.toLocaleString("default", { year: "numeric" });
      var month = date.toLocaleString("default", { month: "2-digit" });
      var day = date.toLocaleString("default", { day: "2-digit" });
      // Generate yyyy-mm-dd date string
      let start_date = year + "-" + month + "-" + day;

      var date = new Date(form.values.endDate);
      // Get year, month, and day part from the date
      var year = date.toLocaleString("default", { year: "numeric" });
      var month = date.toLocaleString("default", { month: "2-digit" });
      var day = date.toLocaleString("default", { day: "2-digit" });
      // Generate yyyy-mm-dd date string
      let end_date = year + "-" + month + "-" + day;

      let session_date = study_sessions[i].date;

      if (session_date >= start_date && session_date <= end_date) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }

      // times filter
      let start_time = form.values.startTime + ":00";
      let end_time = form.values.endTime + ":00";
      if (form.values.startTime == "") {
        start_time = "00:00:00";
      }
      if (form.values.endTime == "") {
        end_time = "23:59:59";
      }

      if (study_sessions[i].start_time >= start_time && study_sessions[i].end_time <= end_time) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }

      // group size filter
      let min_size = form.values.minGroupSize;
      let max_size = form.values.maxGroupSize;
      if (min_size == null || min_size == "") {
        min_size = 0;
      }

      if ((max_size == null || max_size == "") && study_sessions[i].max_group_size >= min_size) {
        fit_filter = true;
      }
      else if (study_sessions[i].max_group_size >= min_size && study_sessions[i].max_group_size <= max_size) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }

      // noise level filter
      if (form.values.noiseLevel == "None") {
        fit_filter = true;
      }
      else if (study_sessions[i].noise_level == form.values.noiseLevel) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }


      // add to list
      if (fit_filter == true) {
        filtered_posts.push(study_sessions[i]);
      }
      fit_filter = false;
    }

    for (let i = 0; i < filtered_posts.length; i++) {
      console.log(filtered_posts[i].department + " " + filtered_posts[i].course_number + " " + filtered_posts[i].section);

    }
    sendDataToParent(filtered_posts);
  };

  const handleAddCourse = (event) => {
    event.preventDefault();

    var newItem = '';
    if (form.values.courseSection != '') {
      newItem = form.values.department + ' ' + form.values.courseNumber + '-' + form.values.courseSection;
    }
    else {
      newItem = form.values.department + ' ' + form.values.courseNumber;
    }

    if (!coursesList.includes(newItem)) {
      setCoursesList([...coursesList, newItem]);
      console.log(coursesList)
      //form.reset();
    }
    else {
      alert("This exact course and section has already been added!");
    }
  }

  const handleRemoveCourse = (event, index) => {
    event.preventDefault();

    const updatedCoursesList = coursesList.filter((_, i) => i !== index);
    setCoursesList(updatedCoursesList);
  }

  const handleReset = (event) => {
    event.preventDefault();

    form.reset();
    form.setInitialValues({ values: 'object' });
    setCoursesList([]);
    form.setFieldValue('startDate', new Date());
    form.setFieldValue('endDate', currentDate);
    form.setFieldValue('minGroupSize', null);
    form.setFieldValue('maxGroupSize', null);
    form.setFieldValue('startTime', '');
    form.setFieldValue('endTime', '');
    form.setFieldValue('noiseLevel', 'None');
    form.setFieldValue('department', '');
    setSelectedDepartment('');
    form.setFieldValue('courseNumber', '');
    setSelectedCourseNumber('');
    form.setFieldValue('courseSection', '');
    setSelectedCourseSection('');
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
        <form onSubmit={handleSubmit}>
          <Text fw={700}>Courses</Text>
          {/* add default courses here (current courses) */}
          {coursesList.map((item, index) => (
            <Stack key={index}>
              <Group>
                <Checkbox mt="xs" defaultChecked size="xs" id={`checkbox-${index}`} label={item} />
                <ActionIcon ml={-10} mt="xs" size={13} variant="subtle" color="rgba(186, 0, 0, 1)" aria-label="Remove Course" onClick={(event) => handleRemoveCourse(event, index)}>
                  <IconX />
                </ActionIcon>
              </Group>
            </Stack>
          ))}
          <Group grow mt={15}>
            <NativeSelect
              label="Department"
              placeholder="Select a Department"
              data={departments.map((department) => ({ value: department, label: department }))}
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
              onClick={handleAddCourse}
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
              minDate={form.values.startDate}
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
              onClick={handleSubmit}
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