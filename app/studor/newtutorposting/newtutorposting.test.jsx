import React from "react";
import ClientPage from "./client-page";
import { render } from "@testing-library/react";


const mockCourses = [
    {
        id: 1,
        department: "Math",
        course_number: 101,
    },
    {
        id: 2,
        department: "CSCE",
        course_number: 234,
    },
];

const mockDepartments = [
    "Math",
    "CSCE",
    "ENGL",
    "HIST",
    "PHIL",
    "CHEM",
    "BIOL",
    "PHYS",
    "GEOG",
    "MUSC",
    "ARTS",
    "THEA",
    "DANC",
    "KINE",
    "MATH",
    "CSCE",
    "ECON",
    "POLS",
    "PSYC",
    "SOCI",
];

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }

}

describe("New Tutor Posting Test", () => {
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
        render(<ClientPage courses={mockCourses} departments={mockDepartments} />);
    });

});