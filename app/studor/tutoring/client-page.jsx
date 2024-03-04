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
import {
  IconXboxX,
  IconFilter,
  IconDiscountCheckFilled,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import Calendar from "@/app/ui/calendar";

export default function ClientPage(data) {
  const [opened, { open, close }] = useDisclosure(false);
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  if (data.study_sessions === null) {
    return (
      <Group>
        <Text>Nothing to see here</Text>
      </Group>
    );
  }

  return (
    <MantineProvider>
      <Center>
        <h1>Tutoring</h1>
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
                href="/studor/newtutorposting"
                color="#800000"
              >
                New Tutor Post
              </Button>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto" order={{ base: 3 }}>
          <Group miw={200}>
            <ScrollArea h={height - 180}>
              <Group>
                {data.study_sessions.map((session) => (
                  <Group p={30} key={session.id}>
                    <Stack>
                      <Avatar size={100} />
                    </Stack>
                    <Stack>
                      <Stack>
                        <Text fw={700} size="xl">
                        312 One-on-One Tutor Session                      
                        </Text>
                        <Text mt={-10} fw={700}>
                          CSCE 312                        
                        </Text>
                        <Text mt={-15}>Location: ZACH 350</Text>
                        <Text mt={-15}>Date: Feb 14, 2024</Text>
                        <Text mt={-15}>Time: 1:00 PM - 2:00 PM</Text>
                        <Text mt={-15}>Available: 1/1</Text>
                        <Group mt={-15}>
                          <Text>Tutor: Name</Text>
                          <IconDiscountCheckFilled />
                        </Group>
                        <Group mt={-15}>
                          <Text>Tutor Rating: 3.2</Text>
                          <IconStarFilled />
                          <IconStarFilled />
                          <IconStarFilled />
                          <IconStarHalfFilled />
                          <IconStar />
                        </Group>
                      </Stack>
                      <Group>
                        <Button
                          variant="filled"
                          size="sm"
                          color="#009020"
                          radius="xl"
                        >
                          Join
                        </Button>
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
            <Calendar></Calendar>
          </Grid.Col>
        )}
      </Grid>
    </MantineProvider>
  );
}
