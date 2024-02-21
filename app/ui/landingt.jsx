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
import Modalview from "../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";

export default function Landingsg() {
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

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
            <ScrollArea h={height - 100}>
              <h1>Your Posts</h1>
              <Group>
                <Group p={30}>
                  <Stack>
                    <Avatar size={100} />
                  </Stack>
                  <Stack>
                    <Stack>
                      <Text fw={700} size="xl">
                        312 One-on-One Tutor Session
                      </Text>
                      <Text mt={-10} fw={700}>
                        Class: CSCE 312
                      </Text>
                      <Text mt={-15}>Location: ZACH 350</Text>
                      <Text mt={-15}>Date: Feb 14, 2024</Text>
                      <Text mt={-15}>Time: 1:00 PM - 2:00 PM</Text>
                      <Text mt={-15}>Available: 1/1</Text>
                    </Stack>
                    <Group align="center">
                      <Button
                        variant="filled"
                        size="sm"
                        color="#800000"
                        radius="xl"
                      >
                        Join
                      </Button>
                      <Modalview />
                    </Group>
                  </Stack>
                </Group>
                <Group p={30}>
                  <Stack>
                    <Avatar size={100} />
                  </Stack>
                  <Stack>
                    <Stack>
                      <Text fw={700} size="xl">
                        312 One-on-One Tutor Session
                      </Text>
                      <Text mt={-10} fw={700}>
                        Class: CSCE 312
                      </Text>
                      <Text mt={-15}>Location: ZACH 350</Text>
                      <Text mt={-15}>Date: Feb 14, 2024</Text>
                      <Text mt={-15}>Time: 1:00 PM - 2:00 PM</Text>
                      <Text mt={-15}>Available: 1/1</Text>
                    
                    </Stack>
                    <Group align="center">
                      <Button
                        variant="filled"
                        size="sm"
                        color="#800000"
                        radius="xl"
                      >
                        Join
                      </Button>
                      <Modalview />
                    </Group>
                  </Stack>
                </Group>
              </Group>
              <h1>Joined Sessions</h1>
              <Group>
              <Group p={30}>
                  <Stack>
                    <Avatar size={100} />
                  </Stack>
                  <Stack>
                    <Stack>
                      <Text fw={700} size="xl">
                        312 One-on-One Tutor Session
                      </Text>
                      <Text mt={-10} fw={700}>
                        Class: CSCE 312
                      </Text>
                      <Text mt={-15}>Location: ZACH 350</Text>
                      <Text mt={-15}>Date: Feb 14, 2024</Text>
                      <Text mt={-15}>Time: 1:00 PM - 2:00 PM</Text>
                    </Stack>
                    <Group align="center">
                      <Button
                        variant="filled"
                        size="sm"
                        color="#800000"
                        radius="xl"
                      >
                        Join
                      </Button>
                      <Modalview />
                    </Group>
                  </Stack>
                </Group>
              </Group>
            </ScrollArea>
          </Group>
        </Grid.Col>

        {checked && (
          <Grid.Col span={6} order={{ base: 2 }} mt={30}>
            <Group>Calendar coming soon</Group>
          </Grid.Col>
        )}
      </Grid>
    </MantineProvider>
  );
}
