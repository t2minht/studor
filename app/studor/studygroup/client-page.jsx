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
} from "@mantine/core";
import { IconXboxX, IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Modalview from "../../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import JoinSessionButton from "./join-session-button";

export default function ClientPage(data) {
    const [opened, { open, close }] = useDisclosure(false);
    const { height, width } = useViewportSize();
    const [checked, setChecked] = useState(true);

    // console.log(data.data[0].id);

    if (data.study_sessions === null) {
      return (

        (
          <Group>
          <Text>Nothing to see here</Text>
          </Group>
          )
        )
    }

    return (
        <MantineProvider>
            <Center>
                <h1>Study Groups</h1>
            </Center>



            <Grid overflow="hidden">
                <Grid.Col span="content">
                    <Drawer
                        opened={opened}
                        onClose={close}
                        title="Filter"
                        closeButtonProps={{
                            icon: <IconXboxX size={20} stroke={1.5} />,
                        }}
                    >
                        Filters coming soon
                    </Drawer>
                    <Stack pl={20}>
                        <ActionIcon
                            onClick={open}
                            variant="filled"
                            size="xl"
                            color="#800000"
                            aria-label="Filter"
                        >
                            <IconFilter style={{ width: "90%", height: "90%" }} stroke={2} />
                        </ActionIcon>
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
                                href="/studor/newstudygroupposting"
                                color="#800000"
                            >
                                New Study Group Post
                            </Button>
                        </Group>
                    </Stack>
                </Grid.Col>

                <Grid.Col span="auto" order={{ base: 3 }}>
                    <Group miw={200}>
                        <ScrollArea h={height - 180}>
                            <Group>
                                {data.study_sessions.map((session) => (

                              <Group p={30} key={session.topic}>
                              <Stack>
                                  <Avatar size={100} />
                              </Stack>
                              <Stack>
                                  <Stack>
                                      <Text fw={700} size="xl">
                                        {session.topic}
                                      </Text>
                                      <Text mt={-10} fw={700}>
                                          Class: {session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}
                                      </Text>
                                      <Text mt={-15}>Location: {session.location}</Text>
                                      <Text mt={-15}>Date: {session.date}</Text>
                                      <Text mt={-15}>Time: {session.start_time} - {session.end_time}</Text>
                                      <Text mt={-15}>Available: {session.current_group_size} / {session.max_group_size} </Text>
                                  </Stack>
                                  <Group align="center">
                                      <JoinSessionButton session_id={session.id} />
                                      <Modalview />
                                  </Group>
                              </Stack>
                              </Group>




                                ))}
                            </Group>
                        </ScrollArea>
                    </Group>
                </Grid.Col>

                {checked && (
                    <Grid.Col span={6} order={{ base: 2 }}>
                        <Group>Calendar coming soon</Group>
                    </Grid.Col>
                )}
            </Grid>
        </MantineProvider>
    );
}