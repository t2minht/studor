const { render } = require("@testing-library/react");
const { default: Calendar } = require("./calendar");
const { MantineProvider } = require("@mantine/core");

const mockEvents = {
    events: '[{"start":"2024-01-16T08:00:00","end":"2024-01-16T…33","backColor":"#FFE599","fontColor":"#000000"}]'
}

const mockStudySessions = [
    {
        id: 1,
        topic: "Math 101",
        department: "Math",
        course_number: 101,
        section: 1,
        date: "2021-10-10",
        location: "Library",
        start_time: "10:00:00",
        end_time: "12:00:00",
        current_group_size: 3,
        max_group_size: 5,
        description: "This is a description",
        noise_level: "5",
    },
    {
        id: 2,
        topic: "CSCE 234",
        department: "CSCE",
        course_number: 534,
        section: 3,
        date: "2023-11-11",
        location: "Library",
        start_time: "10:00:00",
        end_time: "12:00:00",
        current_group_size: 3,
        max_group_size: 6,
        description: "This is a description",
        noise_level: "4",
    },
];

const mockTutoring =
    [
        {
            id: 1,
            title: "Math 101",
            department: "Math",
            course_number: 101,
            section: 1,
            date: "2021-10-10",
            location: "Library",
            start_time: "10:00:00",
            end_time: "12:00:00",
        },
        {
            id: 2,
            title: "CSCE 234",
            department: "CSCE",
            course_number: 234,
            section: 3,
            date: "2023-11-11",
            location: "Library",
            start_time: "10:00:00",
            end_time: "12:00:00",
        },
    ]

const mockColors = {
    study_session_color: '#FFD966',
    tutor_session_color: '#134F5C',
}

describe("Calendar", () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });
    it("renders the Calendar component", () => {

        render(
            <MantineProvider>
                <Calendar events={mockEvents} study_sessions={mockStudySessions} tutoring={mockTutoring} colors={mockColors} />
            </MantineProvider>
        )
    })
})