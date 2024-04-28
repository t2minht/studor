import React from "react";
import ClientPage from "./client-page";
import { render, waitFor } from "@testing-library/react";
import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";
expect.extend({ toBeInTheDocument });

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


    it("should add a new tutor posting and begin redirecting", async () => {
        const { getByText, getByTestId } = render(<ClientPage courses={mockCourses} departments={mockDepartments} />);

        const departmentSelect = getByTestId("department-select");
        departmentSelect.value = "Math";
        const courseNumberInput = getByTestId("course-number-select");
        courseNumberInput.value = 101;
        const courseSectionInput = getByTestId("course-section-select");
        courseSectionInput.value = 1;
        const locationInput = getByTestId("Location");
        locationInput.value = "Library";
        const dateInput = getByTestId("Date");
        dateInput.value = "2024-05-13";
        const startTimeInput = getByTestId("start-time");
        startTimeInput.value = "10:00:00";
        const endTimeInput = getByTestId("end-time");
        endTimeInput.value = "12:00:00";
        const groupSizeInput = getByTestId("group-size");
        groupSizeInput.value = 5;


        const submitButton = getByTestId("Submit");
        submitButton.click();

        // expect "Redirecting to home page..." to be on the page
        await waitFor(() => {
            expect(getByText("Redirecting to home page...")).toBeInTheDocument();

        });




    })

    it("should add an invalid tutor posting and display an error message", async () => {
        const { getByText, getByTestId } = render(<ClientPage courses={mockCourses} departments={mockDepartments} />);

        const departmentSelect = getByTestId("department-select");
        departmentSelect.value = "";
        const courseNumberInput = getByTestId("course-number-select");
        courseNumberInput.value = 1014;
        const courseSectionInput = getByTestId("course-section-select");
        courseSectionInput.value = 1134;
        const locationInput = getByTestId("Location");
        locationInput.value = "Library";
        const dateInput = getByTestId("Date");
        dateInput.value = "2023-05-13";
        const startTimeInput = getByTestId("start-time");
        startTimeInput.value = "10:00:00";
        const endTimeInput = getByTestId("end-time");
        endTimeInput.value = "12:00:00";
        const groupSizeInput = getByTestId("group-size");
        groupSizeInput.value = 0;

        const submitButton = getByTestId("Submit");
        submitButton.click();

        await waitFor(() => {
            expect(getByText("Redirecting to home page...")).toBeInTheDocument();
        });
    })


});



