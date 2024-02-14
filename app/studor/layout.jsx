import { MantineProvider } from "@mantine/core"
import Navbar from '../ui/navbar'
import { Notifications } from "@mantine/notifications"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }) {

  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession();

  const { data: { user } } = await supabase.auth.getUser();
  //console.log(user);

  if (!session) {
    redirect("/login")
  }

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