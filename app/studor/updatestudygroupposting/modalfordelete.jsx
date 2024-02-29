"use client"
import { useDisclosure } from "@mantine/hooks";
import { Modal, Text, Group, Button, MantineProvider, rem } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { deleteSession } from "@/app/backend/study-session-backend";

export default function Modaldelete(data) {
  const [opened, { open, close }] = useDisclosure(false);

  console.log(data)
  return (
    <MantineProvider>
      <Modal opened={opened} onClose={close} withCloseButton={true} centered> 
        <Text fw={700} ta="center" >Are you sure you want to delete this session?</Text>
        <Group justify='center'>
          <Button mt="md"
            variant="filled"
            color='green'
            radius="xl"
            onClick={() => {
              notifications.show({
                withBorder: true,
                color: "green",
                radius: "md",
                icon: <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />,
                title: 'Session Deleted! Redirecting...',
                message: "Now redirecting to Landing Page",
              });

              deleteSession(data.id);
          
              // Redirect to the new page after a short delay
              setTimeout(() => {
              window.location.href = '/';
            }, 5000);
            }}
            >Yes</Button>
        </Group>
      </Modal>
      <Button
        onClick={open}
        variant="filled"
        size="sm"
        radius="xl"
        color="red"
      >
        Delete Session
      </Button>
    </MantineProvider>
 );
}