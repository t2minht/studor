'use client'

import { Button } from '@mantine/core';
import { joinSession } from "@/app/backend/study-session-backend";

export default function JoinSessionButton(session_id) {

    const joinHandler = async () => {
        await joinSession(session_id);
        console.log("handler finished");
    }

    return (
        <Button variant="outline" color="rgba(255, 0, 255, 1)" radius="xl" onClick={joinHandler}>Join Session</Button>
    )
}