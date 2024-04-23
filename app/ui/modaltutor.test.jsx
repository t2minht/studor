import { render } from "@testing-library/react";
import Modaltutor from "./modaltutor";

const mockSession = {
    user: {
        id: 1,
        email: "test@test.com"
    },
    id: 1,
    tutor_user_id: 1,
    title: "Tutoring Session",
    description: "This is a tutoring session",
    start_time: "2022-04-01T12:00:00",
    end_time: "2022-04-01T13:00:00",
    averageRating: 5,
    price: 10,
    current_group_size: 1,
    max_group_size: 5,
    tutor_avatar_url: "https://www.example.com/avatar.png",
    department: "CSCE",
    course_number: '123',
    section: '791',
    location: "Online",
    date: "2022-04-01",
    verified: true,
    users: {
        full_name: "Test Tutor",
    }
};

describe("Test modaltutor", () => {
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
    it("should render", () => {
        render(<Modaltutor current={mockSession} />);
    });
});