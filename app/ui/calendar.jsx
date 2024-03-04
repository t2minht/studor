import React, { useState } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { MantineProvider, Container} from "@mantine/core";

const Calendar = () => {
    const [config, setConfig] = useState({
        viewType: "Week"
    });


    return (
        <MantineProvider>
            <Container>
                <DayPilotCalendar {...config}></DayPilotCalendar>
            </Container>
        </MantineProvider>
    );
}

export default Calendar;