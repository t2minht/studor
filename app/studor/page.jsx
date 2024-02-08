// Landing page
import { Calendar } from '@mantine/dates'
import { MantineProvider } from '@mantine/core'

export default function Page() {
  return (
    <MantineProvider>
        <Calendar />
    </MantineProvider>
  ) 
}

