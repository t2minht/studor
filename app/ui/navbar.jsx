'use client'

import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBook,
  IconChevronDown
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import LightOrDarkMode from './lightordarkmode';

export default function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
        <IconBook
          size={38}
          stroke={1.5}
          color="var(--mantine-color-blue-filled)"
        />

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/studor" className={classes.link}>
              Home
            </a>
            <a href="/studor/studygroup" className={classes.link}>
              Study Group
            </a>
            <a href="/studor/tutoring" className={classes.link}>
              Tutoring
            </a>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
            <LightOrDarkMode />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Home
          </a>
          <a href="#" className={classes.link}>
            Study Group
          </a>
          <a href="#" className={classes.link}>
            Tutoring
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>

          <Center>
            <LightOrDarkMode />
          </Center> 
        </ScrollArea>
      </Drawer>
    </Box>
  );
}