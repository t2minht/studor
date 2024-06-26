import { ActionIcon, Autocomplete, Button, Center, Checkbox, Drawer, Group, NativeSelect, NumberInput, Rating, SegmentedControl, Stack, Text, rem } from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconCircleCheck, IconCircleX, IconClock, IconFilter, IconVolume, IconVolume2, IconVolumeOff, IconX, IconXboxX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Filters sessions in the tutoring page
export default function TutorFilter({ departments, study_sessions, sendDataToParent }) {
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClientComponentClient();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourseNumber, setSelectedCourseNumber] = useState('');
  const [selectedCourseSection, setSelectedCourseSection] = useState('');
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [courseSections, setCourseSections] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [checked, setChecked] = useState(() => { return localStorage.getItem('checked') === 'true' });

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

  // client-side database call that retrieves the possible course numbers when a department is selected
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

  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  currentDate.setDate(currentDay + 31);

  // Form validation for input fields to add new courses to be filtered by
  const form = useForm({
    validateInputOnChange: true,
    initialValues: { department: '', courseNumber: '', courseSection: '', minGroupSize: null, maxGroupSize: null, startDate: new Date(), endDate: currentDate, startTime: '', endTime: '', tutorRating: 0, tutorVerified: false },

    // Below are the rules/parameters the input fields need to follow before being submitted
    validate: {
      department: (value, allValues) => allValues.department && ((allValues.department.length !== 4 || !(/^[a-zA-Z]+$/.test(allValues.department))) ? 'Invalid Department' : null),
      courseNumber: (value, allValues) => allValues.courseNumber && ((allValues.courseNumber.length !== 3 || !(/^\d{3}$/.test(Number(allValues.courseNumber)))) ? 'Invalid Course Number' : null),
      courseSection: (value, allValues) => (
        allValues.courseSection && (value.length !== 3 || !(/^\d{3}$/.test(Number(value)))) ? 'Invalid Course Section' : null
      ),
      minGroupSize: (value, allValues) => allValues.minGroupSize && ((allValues.minGroupSize >= 2 && allValues.minGroupSize <= 20) ? null : 'Invalid Group Size'),
      maxGroupSize: (value, allValues) => allValues.maxGroupSize && ((allValues.maxGroupSize >= 2 && allValues.maxGroupSize <= 20 && allValues.maxGroupSize >= allValues.minGroupSize) ? null : 'Invalid Group Size'),
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

  // actual filtering based on input
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    let filtered_posts = [];
    let fit_filter = false;

    // console.log(study_sessions);

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

      if ((max_size == null || max_size == "") && study_sessions[i].max_group_size - 1 >= min_size) {
        fit_filter = true;
      }
      else if (study_sessions[i].max_group_size - 1 >= min_size && study_sessions[i].max_group_size - 1 <= max_size) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }

      // tutor rating filter
      var avg_rating = study_sessions[i].averageRating;
      if (isNaN(study_sessions[i].averageRating)) {
        avg_rating = 0;
      }

      if (form.values.tutorRating <= avg_rating) {
        fit_filter = true;
      }
      else {
        fit_filter = false;
        continue;
      }

      // verified tutor filter
      // console.log(form.values.tutorVerified);
      // console.log(study_sessions[i].verified);
      // console.log("----")
      if (!form.values.tutorVerified || (form.values.tutorVerified && study_sessions[i].verified)) {
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
      // console.log(filtered_posts[i].department + " " + filtered_posts[i].course_number + " " + filtered_posts[i].section);

    }

    // send filtered list to tutor page
    sendDataToParent(filtered_posts);
    close();
  };

  // Adds course to be filtered by
  // Checks if course already exists
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
      // console.log(coursesList)
      //form.reset();
    }
    else {
      alert("This exact course and section has already been added!");
    }
  }

  // Removes course from filtering 
  const handleRemoveCourse = (event, index) => {
    event.preventDefault();

    const updatedCoursesList = coursesList.filter((_, i) => i !== index);
    setCoursesList(updatedCoursesList);
  }

  // resets all fields to their initial defaulted values
  const handleReset = (event) => {
    event.preventDefault();

    form.reset();
    form.setInitialValues({ values: 'object' });
    setCoursesList([]);
    form.setFieldValue('startDate', new Date());
    form.setFieldValue('endDate', currentDate);
    form.setFieldValue('minGroupSize', '');
    form.setFieldValue('maxGroupSize', '');
    form.setFieldValue('startTime', '');
    form.setFieldValue('endTime', '');
    form.setFieldValue('tutorRating', 0);
    form.setFieldValue('tutorVerified', false);
    form.setFieldValue('department', '');
    setSelectedDepartment('');
    form.setFieldValue('courseNumber', '');
    setSelectedCourseNumber('');
    form.setFieldValue('courseSection', '');
    setSelectedCourseSection('');
  }

  // this will pop up on the side for users to filter sessions on the tutoring page to better find what they need
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

          <Text fw={700} mt={30}>Tutor Information</Text>
          <Group>
            <Rating fractions={2} size={"lg"} {...form.getInputProps('tutorRating')} />
            <Text>{form.values.tutorRating} and above</Text>
          </Group>
          <Checkbox mt="sm" size="sm" checked={form.values.tutorVerified} label="Verified Tutor" {...form.getInputProps('tutorVerified')} />

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