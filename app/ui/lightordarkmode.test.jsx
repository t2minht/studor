import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import LightOrDarkMode from './lightordarkmode';
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';


describe('LightOrDarkMode component', () => {
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
    test('toggles color scheme when clicked', () => {
        const { getByTestId } = render(
            <MantineProvider>
                <LightOrDarkMode />
            </MantineProvider>
        );
        const sunIcon = getByTestId('Sun icon');
        expect(sunIcon).toBeInTheDocument();

        const moonIcon = getByTestId('Moon icon');
        expect(moonIcon).toBeInTheDocument();

        fireEvent.click(sunIcon);

        expect(sunIcon).toBeInTheDocument();
        expect(moonIcon).toBeInTheDocument();

        fireEvent.click(moonIcon);
        expect(sunIcon).toBeInTheDocument();
        expect(moonIcon).toBeInTheDocument();
    });
});
