import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import AuthButton from "./auth-button";
import { MantineProvider } from "@mantine/core";
// import App from "./ui/navbar";
import Navbar from "./ui/navbar";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: sessions } = await supabase.from("sessions").select();



  return (
    <>

      {/* <AuthButton />
      <pre>{JSON.stringify(sessions, null, 2)}</pre> */}
      <MantineProvider>
        <Navbar />
      </MantineProvider>

    </>
  );
}
