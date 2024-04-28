import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Landing from './landing';
import '@testing-library/jest-dom';


jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }

}


describe('Landing component', () => {
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
    test('renders Landing correctly', () => {
        const data = {
            study_sessions: {
                hosted: [
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
                ],
                joined: [
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
                    },]
            },
            tutoring: {
                hosted: [
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
                        users: { tutor_rating: 4 },
                    },
                ],
                joined: [
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
                        users: { tutor_rating: 4 },
                    },
                ]
            },
            all_study_sessions: [
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
            ],
            all_tutoring: [{
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
            },],
            events: { events: '[{"start":"2024-01-16T08:00:00","end":"2024-01-16T…33","backColor":"#FFE599","fontColor":"#000000"}]' },
            colors: {
                study_session_color: "#134F5C",
                tutoring_session_color: "#134F5C",
            },
        };

        const { getByText } = render(<Landing {...data} />);

        // Example test: Check if the "New Study Group Post" button is rendered
        const newStudyGroupPostButton = getByText('New Study Group Post');
        expect(newStudyGroupPostButton).toBeInTheDocument();

        // Add more tests for other elements as needed
    });

    // Add more test cases as needed
});
