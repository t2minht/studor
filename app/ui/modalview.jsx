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
  Modal,
  SegmentedControl,
  rem
} from "@mantine/core";
import { IconXboxX, IconFilter, IconCircleCheck, IconCircleX, IconClock, IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function Modalview() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <MantineProvider>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="auto"
      >
        
        <Text fw={700} size="xl" ta="center">430 Cry Session</Text>

        <Group p={20}>
          <Stack>
            <Text mt={-10} fw={700}>Class: CSCE 430</Text>
            <Text mt={-15}>Location: ZACH 325</Text>
            <Text mt={-15}>Date: Feb 12, 2024</Text>
            <Text mt={-15}>Time: 2:00 PM - 3:00 PM</Text>
            <Text mt={-15}>Available: 3/10</Text>
            <Text mt={-15}>Description:</Text>
            <Text mt={-15}>Noise Level</Text>
            <SegmentedControl color="#800000" data={[
                {
                  value: '1',
                  label: (
                    <Center style={{ gap: 10 }}>
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
                      <span>5</span>
                    </Center>
                  ),
                },
              ]}
            />
          </Stack>
          <Text mt={-15} ml={30}>Group Members</Text>
        </Group>
      </Modal>
      <Button
        onClick={open}
        variant="filled"
        size="sm"
        color="#800000"
        radius="xl"
      >
        View
      </Button>
    </MantineProvider>
  );
}
