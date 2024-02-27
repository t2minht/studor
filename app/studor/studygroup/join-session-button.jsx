'use client'

import { Button } from '@mantine/core';
import { joinSession } from "@/app/backend/study-session-backend";

export default function JoinSessionButton(session_id) {

    const joinHandler = async () => {
        await joinSession(session_id);
    }

    return (
        <Button
            variant="filled"
            size="sm"
            color="#800000"
            radius="xl"
            onClick={joinHandler}
        >
            Join
        </Button>
    )
}