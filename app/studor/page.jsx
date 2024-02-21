// Landing page
import { MantineProvider } from "@mantine/core"
import { redirect } from 'next/navigation';


export default function Page() {

  redirect("/studor/studygroup")

  return (
    <MantineProvider>
      
    </MantineProvider>
  ) 
}

