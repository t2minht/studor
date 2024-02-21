import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'
import { MantineProvider } from "@mantine/core";
import ClientPage from './client-page'
import { retrieveExistingNotJoinedSessions } from '../../backend/study-session-backend'
import StudySessions from "./study-sessions";


export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const study_sessions = await retrieveExistingNotJoinedSessions();

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

    </MantineProvider>
  )


}