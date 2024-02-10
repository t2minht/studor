import { MantineProvider } from "@mantine/core"
import Navbar from '../ui/navbar'
import { Notifications } from "@mantine/notifications"
 
export default function Layout({ children }) {
  return (
    <>
      <MantineProvider>
        <Navbar />
        <Notifications />
        <main>{children}</main>
      </MantineProvider>
    </>
  )
}