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
import { useState } from "react";
import Landingsg from "./landingsg";
import Landingt from "./landingt";

export default function Landing() {

  return (
    <MantineProvider>
    <Tabs variant="outline" defaultValue="sg">
        <Tabs.List>
          <Tabs.Tab value="sg">Study Group</Tabs.Tab>
          <Tabs.Tab value="tutor">Tutor</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="sg">
          <Landingsg></Landingsg>
        </Tabs.Panel>
        <Tabs.Panel value="tutor">
          <Landingt></Landingt>
        </Tabs.Panel>
      </Tabs>
    </MantineProvider>
  );
}
