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

export default function Navbar({ user }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();


  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href='/'>
            <Image
              src={logo}
              alt='studor logo'
              width={90}
              height={50}
              style={{ marginTop: '5px' }}
            />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/" className={classes.link} style={{ color: 'white' }}>
              Home
            </a>
            <a href="/studor/studygroup" className={classes.link} style={{ color: 'white' }}>
              Study Group
            </a>
            <a href="/studor/tutoring" className={classes.link} style={{ color: 'white' }}>
              Tutoring
            </a>
          </Group>

          <Group visibleFrom="sm">
            <LogoutButtonClient />
            <a href='/studor/profile'>
              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile">
                <Avatar src={user.avatar_url} variant='transparent' alt="Profile" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>
            </a>

            <a href='/studor/faqs'>
              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile">
                <IconQuestionMark variant='transparent' alt="FAQs" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>
            </a>
            <LightOrDarkMode />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" color='white' />
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
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md" bg={'#800000'}>
          <Divider my="sm" color="rgba(255, 255, 255, 1)" />

          <a href="/" className={classes.link}>
            Home
          </a>
          <a href="/studor/studygroup" className={classes.link}>
            Study Group
          </a>
          <a href="/studor/tutoring" className={classes.link}>
            Tutoring
          </a>

          <Divider my="sm" color="rgba(255, 255, 255, 1)" />

          <Group justify="center" grow pb="xl" color="rgba(255, 255, 255, 1)" px="md">
            <LogoutButtonClient />
          </Group>


          <a href='/studor/profile'>
            <Group justify="center" grow pb="xl" px="md">
              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile">
                <Avatar src={null} variant='transparent' alt="Profile" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>
            </Group>
          </a>

          <a href='/studor/faqs'>
            <Group justify="center" grow pb="xl" px="md">
              <ActionIcon variant="subtle" size="lg" color="rgba(255, 255, 255, 1)" radius="xl" aria-label="Profile">
                <IconQuestionMark variant='transparent' alt="Profile" color="rgba(255, 255, 255, 1)" />
              </ActionIcon>
            </Group>
          </a>

          <Group justify="center" grow pb="xl" px="md">
            <LightOrDarkMode />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}