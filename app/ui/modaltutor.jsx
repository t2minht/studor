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

export default function Modaltutor() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <MantineProvider>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Stack align="center">
          <Stack>
            <Avatar size={100} />
          </Stack>
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
        </Stack>
      </Modal>
      <Button
        onClick={open}
        variant="filled"
        size="sm"
        radius="xl"
      >
        View
      </Button>
    </MantineProvider>
  );
}
