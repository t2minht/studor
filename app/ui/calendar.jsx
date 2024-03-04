import React, { useState } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const Calendar = () => {
    const [config, setConfig] = useState({
        viewType: "Week"
    });


    return (
        <div>
            <DayPilotCalendar {...config} />
        </div>
    );
}

export default Calendar;