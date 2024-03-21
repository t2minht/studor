import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthButtonServer from './ui/auth-button-server';
import { Center, MantineProvider } from "@mantine/core";
import Navbar from "./ui/navbar";
import { retrieveExistingJoinedSessions as getJoinedStudySessions, retrieveFutureHostedSessions as getHostedStudySessions } from "./backend/study-session-backend";
import { retrieveExistingJoinedSessions as getJoinedTutoring, retrieveFutureHostedSessions as getHostedTutoring } from "./backend/tutoring-backend";
import Landing from "./ui/landing";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const hosted_study_sessions = await getHostedStudySessions();
  const joined_study_sessions = await getJoinedStudySessions();

  const study_sessions = {};
  study_sessions.hosted = hosted_study_sessions;
  study_sessions.joined = joined_study_sessions;

  const hosted_tutoring_sessions = await getHostedTutoring();
  const joined_tutoring_sessions = await getJoinedTutoring();

  const tutoring = {};
  tutoring.hosted = hosted_tutoring_sessions;
  tutoring.joined = joined_tutoring_sessions;

  return (
    <>
      <MantineProvider>
        <Navbar />
        {/* <Center>
          <h1>My Landing Page</h1>
          {study_sessions.length > 0 ? (
            <pre>{JSON.stringify(study_sessions, null, 2)}</pre>
          ) : (
            <>
              <a
                href="/studor/newstudygroupposting"
                style={{
                  display: 'block',  // Set to block to place it on a new line
                  marginTop: '10px', // Add top margin for spacing
                  padding: '10px 20px',
                  border: '1px solid #800000',
                  borderRadius: '12px',
                  color: 'white',
                  textDecoration: 'none',
                  background: "#800000",
                  marginLeft: '2em'
                }}
              >
                New Study Session
              </a>
            </>
          )}
        </Center> */}
        <Landing study_sessions={study_sessions} tutoring={tutoring}></Landing>
      </MantineProvider>
    </>
  );
}
