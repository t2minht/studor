import { MantineProvider } from "@mantine/core"
import Navbar from '../ui/navbar'
 
export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <MantineProvider>
        <Navbar />
      </MantineProvider>
    </>
  )
}