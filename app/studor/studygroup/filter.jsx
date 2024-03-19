import { ActionIcon, Button, Checkbox, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconXboxX } from "@tabler/icons-react";


export default function Filter(data) {
  const [opened, { open, close }] = useDisclosure(false);

  return(
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Filter"
        closeButtonProps={{
            icon: <IconXboxX size={20} stroke={1.5} />,
        }}
      >
        <b>My Courses</b>
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="CSCE 472"
        />
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="ENGL 210"
        />
        <Checkbox
          mt="xs"
          defaultChecked
          size="xs"
          label="ITSV 308"
        />
        <Button
          mt="xs"
          variant="filled"
        >
          + Add Course
        </Button>
        
      </Drawer>

      <ActionIcon
        onClick={open}
        variant="filled"
        size="xl"
        color="#800000"
        aria-label="Filter"
        >
        <IconFilter style={{ width: "90%", height: "90%" }} stroke={2} />
      </ActionIcon>
    </>

  );
}