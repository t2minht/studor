import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import AuthButton from "./auth-button";
// import App from "./ui/navbar";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: sessions } = await supabase.from("sessions").select();



  return (
    <>

      {/* <AuthButton />
      <pre>{JSON.stringify(sessions, null, 2)}</pre> */}

    </>
  );
}
