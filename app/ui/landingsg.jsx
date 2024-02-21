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
import Modalview from "../ui/modalview";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";

export default function Landingsg() {
  const { height, width } = useViewportSize();
  const [checked, setChecked] = useState(true);

  return (
    <MantineProvider>
        <ScrollArea h={height - 120}>
          <h1>Your Posts</h1>
          <Group>
            <Group p={30}>
              <Stack>
                <Avatar size={100} />
              </Stack>
              <Stack>
                <Stack>
                  <Text fw={700} size="xl">
                    430 Cry Session
                  </Text>
                  <Text mt={-10} fw={700}>
                    Class: CSCE 430
                  </Text>
                  <Text mt={-15}>Location: ZACH 325</Text>
                  <Text mt={-15}>Date: Feb 12, 2024</Text>
                  <Text mt={-15}>Time: 2:00 PM - 3:00 PM</Text>
                  <Text mt={-15}>Available: 3/10</Text>
                </Stack>
                <Group>
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
                    430 Cry Session
                  </Text>
                  <Text mt={-10} fw={700}>
                    Class: CSCE 430
                  </Text>
                  <Text mt={-15}>Location: ZACH 325</Text>
                  <Text mt={-15}>Date: Feb 12, 2024</Text>
                  <Text mt={-15}>Time: 2:00 PM - 3:00 PM</Text>
                  <Text mt={-15}>Available: 3/10</Text>
                </Stack>
                <Group>
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
                    430 Cry Session
                  </Text>
                  <Text mt={-10} fw={700}>
                    Class: CSCE 430
                  </Text>
                  <Text mt={-15}>Location: ZACH 325</Text>
                  <Text mt={-15}>Date: Feb 12, 2024</Text>
                  <Text mt={-15}>Time: 2:00 PM - 3:00 PM</Text>
                  <Text mt={-15}>Available: 3/10</Text>
                </Stack>
                <Group>
                  <Modalview />
                </Group>
              </Stack>
            </Group>
          </Group>
        </ScrollArea>
    </MantineProvider>
  );
}
