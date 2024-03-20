"use client";
import {
  Center,
  MantineProvider,
  Drawer,
  ActionIcon,
  Switch,
  Grid,
  Stack,
  Avatar,
  Group,
  Text,
  Button,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import { IconXboxX, IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modalview from "../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState, useEffect } from "react";
import Landingsg from "./landingsg";
import Landingt from "./landingt";
import Calendar from "@/app/ui/calendar";
import { retrieveEvents } from "@/app/backend/calendar-backend";


export default function Landing(data) {
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);
  const [activeTab, setActiveTab] = useState('sg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await retrieveProfileStudySession();
        const user = await retrieveUserProfileInfo();
        setUserData(user)
        setStudySessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MantineProvider>
      <Grid overflow="hidden">
        <Grid.Col span="content" mt={30} mr={70}>
          <Stack pl={20}>
            <Switch
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              defaultChecked
              color="#800000"
              label="Show calendar"
              mb={20}
            />
            <Group>
              <Button
                variant="filled"
                component="a"
                href= {activeTab == 'tutor' ? "/studor/newtutorposting" : "/studor/newstudygroupposting"}
                color="#800000"
              >
                {activeTab == 'tutor' ? 'New Tutor Post' : 'New Study Group Post'}
              </Button>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto" order={{ base: 3 }}>
          <Tabs variant="default" defaultValue="sg" value={activeTab} onChange={setActiveTab}>
            <Tabs.List mt={20}>
              <Tabs.Tab value="sg" fz={15}>
                Study Group
              </Tabs.Tab>
              <Tabs.Tab value="tutor" fz={15}>
                Tutor
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="sg">
              <Landingsg study_sessions={data.study_sessions}></Landingsg>
            </Tabs.Panel>
            <Tabs.Panel value="tutor">
              <Landingt study_sessions={data.study_sessions}></Landingt>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>

        {checked && (
          <Grid.Col span={6} order={{ base: 2 }} mt={30}>
            <Calendar></Calendar>
          </Grid.Col>
        )}
      </Grid>
    </MantineProvider>
  );
}
