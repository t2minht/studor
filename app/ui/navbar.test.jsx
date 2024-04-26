import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import Navbar from './navbar';
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';


jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));
describe('Navbar component', () => {
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
    test('renders Navbar correctly', () => {
        const user = {
            avatar_url: 'example-avatar-url',
        };

        const { getByAltText, getByTestId } = render(
            <MantineProvider>
                <Navbar user={user} />
            </MantineProvider>);

        const logo = getByAltText('studor logo');
        expect(logo).toBeInTheDocument();

        const homeLink = getByTestId('Home');
        expect(homeLink).toBeInTheDocument();

        const studyGroupLink = getByTestId('StudyGroup');
        expect(studyGroupLink).toBeInTheDocument();

        const tutoringLink = getByTestId('Tutoring');
        expect(tutoringLink).toBeInTheDocument();

        const userAvatar = getByTestId('Profile');
        expect(userAvatar).toBeInTheDocument();

        const faqsIcon = getByTestId('FAQs');
        expect(faqsIcon).toBeInTheDocument();




    });

    // Add more tests for interactions if needed
});
