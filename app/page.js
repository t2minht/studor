import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import AuthButton from "./auth-button";
import { MantineProvider } from '@mantine/core'
import App from "./App";
import Page from "../app/studor/page"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: sessions } = await supabase.from("sessions").select();



  return (
    <>
      <MantineProvider>
        <App />
      </MantineProvider>


      {/* <AuthButton />
      <pre>{JSON.stringify(sessions, null, 2)}</pre> */}

    </>
  );
}
