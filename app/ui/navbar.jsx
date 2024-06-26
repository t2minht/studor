'use client'

import {
  Avatar,
  Group,
  Button,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  useMantineTheme,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBook,
  IconChevronDown,
  IconQuestionMark
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import LightOrDarkMode from './lightordarkmode';
import LogoutButtonClient from './logout-button-client';
import logo from '@/app/ui/logo.png';
import Image from 'next/image';
import Link from 'next/link';

// creates the navbar that is seen across all pages
export default function Navbar({ user }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  // UI components to render on the navbar using Mantine library
  // Purpose is easy routing for users to differing pages such as profile, faqs, landing, study group, tutoring, etc.
  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* Logo that reroutes to the home page */}
          <a href='/'>
            <Image
              src={logo}
              alt='studor logo'
              width={90}
              height={50}
              style={{ marginTop: '5px' }}
            />
          </a>

          {/* Navlinks to differing pages */}
          <Group h="100%" gap={0} visibleFrom="sm">
            <a data-testid="Home" href="/" className={classes.link} style={{ color: 'white' }}>
              Home
            </a>
            <a data-testid="StudyGroup" href="/studor/studygroup" className={classes.link} style={{ color: 'white' }}>
              Study Group
            </a>
            <a data-testid="Tutoring" href="/studor/tutoring" className={classes.link} style={{ color: 'white' }}>
              Tutoring
            </a>
          </Group>

          {/* Navlinks to the faqs, profile, and light or dark mode */}
          <Group visibleFrom="sm">
            <LogoutButtonClient />
            <ActionIcon className={classes.element} p={25} variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile" onClick={() => window.location.href = '/studor/profile'}>
              <Avatar src={user.avatar_url} variant='transparent' data-testid="Profile" alt="Profile" color="rgba(255, 255, 255, 1)" />
            </ActionIcon>
            <ActionIcon className={classes.element} variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="FAQs" onClick={() => window.location.href = '/studor/faqs'}>
              <IconQuestionMark data-testid="FAQs" variant='transparent' alt="FAQs" color="rgba(255, 255, 255, 1)" />
            </ActionIcon>
            <LightOrDarkMode />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" color='white' />
        </Group>
      </header>

      {/* Is the navbar for when the page is too small (hamburger menu) */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md" bg={'#800000'}>
          <Divider my="sm" color="rgba(255, 255, 255, 1)" />

          <a data-testid="Home-closed" href="/" className={classes.link}>
            Home
          </a>
          <a data-testid="Study-group-closed" href="/studor/studygroup" className={classes.link}>
            Study Group
          </a>
          <a data-testid="Tutoring-closed" href="/studor/tutoring" className={classes.link}>
            Tutoring
          </a>

          <Divider my="sm" color="rgba(255, 255, 255, 1)" />
          <Stack align='center' justify='center'>
            <Group justify="center" grow pb="xl" color="rgba(255, 255, 255, 1)" px="md">
              <LogoutButtonClient />
            </Group>

            <Group justify="center" grow pb="xl" px="md">
              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile" onClick={() => window.location.href = '/studor/profile'}>
                <Avatar src={user.avatar_url} variant='transparent' alt="Profile" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>

              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="FAQs" onClick={() => window.location.href = '/studor/faqs'}>
                <IconQuestionMark variant='transparent' alt="FAQs" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>
              <LightOrDarkMode />
            </Group>
          </Stack>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}