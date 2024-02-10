import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import AuthButtonServer from './ui/auth-button-server';
import { redirect } from 'next/navigation';
import { Center, MantineProvider } from "@mantine/core";
// import App from "./ui/navbar";
import Navbar from "./ui/navbar";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login")
  }

  const { data: study_sessions } = await supabase.from("study_sessions").select();



  return (
    <>
      <MantineProvider>
        <Navbar />
        <Center>
          <AuthButtonServer />
          <h1>My Landing Page</h1>
          <pre>{JSON.stringify(study_sessions, null, 2)}</pre>
        </Center>
      </MantineProvider>

    </>
  );
}
