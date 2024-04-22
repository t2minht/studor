import React from "react";
import ClientPage from "./client-page";
import { render } from "@testing-library/react";

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

const mockTutorSessions = [
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
    },
];

const mockEvents = {
    events: '[{"start":"2024-01-16T08:00:00","end":"2024-01-16T…33","backColor":"#FFE599","fontColor":"#000000"}]'
};

const mockColors = {
    study_session_color: "#134F5C",
    tutoring_session_color: "#134F5C",
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

const mockAllTutoring = [
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
    },
    {
        id: 3,
        title: "CSCE 413",
        department: "CSCE",
        course_number: 413,
        section: 1,
        date: "2023-11-11",
        location: "Library",
        start_time: "10:00:00",
        end_time: "12:00:00",

    }
];

const mockDepartments = ['Math', 'CSCE', 'ENGL', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC', 'ANTH', 'SOCI', 'ECON', 'POLS', 'GEOG', 'ARTS', 'MUSC', 'THEA', 'DANC', 'KINE', 'HLTH', 'MATH', 'CSCE', 'ENGR', 'PHYS', 'CHEM', 'BIOL', 'HIST', 'PSYC'];

describe("Tutoring Page Test", () => {
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
        render(<ClientPage tutor_sessions={mockTutorSessions} events={mockEvents} colors={mockColors} all_study_sessions={mockStudySessions} all_tutoring={mockAllTutoring} departments={mockDepartments} />);

    });

});