import React from "react";
import { render, screen } from "@testing-library/react";
import ClientPage from "./client-page";


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

        render(<ClientPage {...mockProps} />);
    });

    // it("uploads Transcript", () => {

    // })

});