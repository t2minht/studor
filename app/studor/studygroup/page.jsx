'use client'
import { retrieveExistingSessions } from "@/app/backend/newSession";
import { Center, MantineProvider } from "@mantine/core"
import { useEffect, useState } from "react";

export default function Page() {
  const [studySessions, setStudySessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await retrieveExistingSessions();
        setStudySessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MantineProvider>
      <Center>
        <h1>Study Groups</h1>
        <ul>
          {studySessions.map((session, index) => (
            <li key={index}>
              <p>Topic: {session.topic}</p>
              <p>Date: {session.date}</p>
              <p>Start Time: {session.start_time}</p>
              <p>End Time: {session.end_time}</p>
              <p>Description: {session.description}</p>
            </li>
          ))}
        </ul>
      </Center>
    </MantineProvider>
  )
}