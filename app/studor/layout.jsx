import { MantineProvider } from "@mantine/core"
import Navbar from '../ui/navbar'
 
export default function Layout({ children }) {
  return (
    <>
      <MantineProvider>
        <Navbar />
        <main>{children}</main>
      </MantineProvider>
    </>
  )
}