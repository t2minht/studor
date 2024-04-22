import React from "react";
import { fireEvent, getByLabelText, getByTestId, render, screen, waitFor } from "@testing-library/react";
import ClientPage from "./client-page";
import { act } from "react-dom/test-utils";


class ResizeObserver {
    observe() { }
    unobserve() { }
}

jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));
const mockProps = {
    sessions: [
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

    ], // mock data for sessions
    user: {
        id: 1,
        name: "John Doe",
        avatar_url: "https://www.example.com/avatar.jpg",
        email: 'johndoe@gmail.com'

    },     // mock data for user
    tutor_sessions: [
        {
            id: 1,
            title: "Math 101",
            department: "Math",
            course_number: 101,
            section: 1,
            date: "2021-10-10",
            users: { tutor_rating: 4 },
            tutor_user_id: '123sada2313',
            tutor_avatar_url: "https://www.example.com/avatar.jpg",
            date: "2023-11-11",
            location: "Library",
            start_time: "10:00:00",
            end_time: "12:00:00",
            max_group_size: 5,
            current_group_size: 3,
            users: {
                full_name: "Tutor McGee",
            },
            verified: true,
            averageRating: 4,

        }
    ], // mock data for tutor_sessions
    departments: ["ABCD", "CSCE"],    // mock data for departments
    colorPrefs: {
        study_session_color: "#134F5C",
        tutoring_session_color: "#134F5C",
    }      // mock data for colorPrefs
};

describe("Profile", () => {
    window.ResizeObserver = ResizeObserver;

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

    it("renders profile page", () => {
        // Mock props
        render(<ClientPage {...mockProps} />);
    });




    // it('should fetch sections on mount', async () => {
    //     ClientPage.getSectionNumbers = jest.fn().mockResolvedValue(['section1', 'section2']); // Mock resolved value
    //     // Render the component
    //     let getByText;
    //     await act(async () => {
    //         ({ getByText } = render(<ClientPage {...mockProps} />));
    //     });
    //     const selectedCourseNumber = '142';


    //     // Assertions
    //     expect(ClientPage.getSectionNumbers).toHaveBeenCalledWith(selectedCourseNumber); // // Check if getSectionNumbers is called with expected value
    //     // You can also assert other behaviors if necessary
    // });

    // jest.mock('./client-page', () => ({
    //     ...jest.requireActual('./client-page'), // Import the real ClientPage module
    //     parseICS: jest.fn(),
    //     clearSchedule: jest.fn(),
    // }));

    // it('should upload schedule and clear it afterwards', () => {
    //     // Mock data
    //     const scheduleFile = new File(['schedule content'], 'schedule.ics', { type: 'text/calendar' });
    //     const mockClearSchedule = jest.fn();

    //     // Render the component
    //     const { getByText, getByTestId } = render(<ClientPage {...mockProps} />);

    //     const importButton = getByText('Import Schedule (*.ics)');
    //     fireEvent.change(importButton, { target: { files: [scheduleFile] } });


    //     waitFor(() => {
    //         expect(getByTestId('schedule-upload-button')).not.toBeDisabled();
    //     });

    //     // Find and interact with the upload button
    //     const uploadButton = getByTestId('schedule-upload-button');
    //     fireEvent.click(uploadButton);


    //     // Assertions
    //     expect(mockProps.clearSchedule).toHaveBeenCalled();

    // });


});

