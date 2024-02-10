'use client'
import { Alert, Center, MantineProvider } from "@mantine/core"
import { IconExclamationCircle } from "@tabler/icons-react"

export default function Page() {
    return (
      <MantineProvider>
        <Center>
          <h1></h1>
          <Alert variant="light" color="red" title="Tutoring Coming Soon" icon={<IconExclamationCircle />}>
            Will be implemented after study group features are  finished.
          </Alert>
        </Center>
      </MantineProvider>
    )
  }