import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import FaqSimple from './page';

describe('FaqSimple Component', () => {
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

    test('renders FAQ header', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const headerElement = screen.getByText('Frequently Asked Questions');
        expect(headerElement).toBeInTheDocument();
    });

    test('accordions all exist', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const uploadScheduleAccordion = screen.getByText('How can I upload my schedule?');
        const uploadTranscriptAccordion = screen.getByText('What kind of transcript can I upload?');
        const optionalTranscriptAccordion = screen.getByText('Do I have to upload my transcript?');
        const tamuEmailAccordion = screen.getByText('Can I log in with a non-TAMU email?');
        const deletePostAccordion = screen.getByText('How can I delete a session I created?');

        expect(uploadScheduleAccordion).toBeVisible();
        expect(uploadTranscriptAccordion).toBeVisible();
        expect(optionalTranscriptAccordion).toBeVisible();
        expect(tamuEmailAccordion).toBeVisible();
        expect(deletePostAccordion).toBeVisible();
    });

    test('accordions open and close', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const uploadScheduleAccordion = screen.getByText('How can I upload my schedule?');
        const uploadTranscriptAccordion = screen.getByText('What kind of transcript can I upload?');
        const optionalTranscriptAccordion = screen.getByText('Do I have to upload my transcript?');
        const tamuEmailAccordion = screen.getByText('Can I log in with a non-TAMU email?');
        const deletePostAccordion = screen.getByText('How can I delete a session I created?');

        expect(uploadScheduleAccordion).toBeVisible();
        expect(uploadTranscriptAccordion).toBeVisible();
        expect(optionalTranscriptAccordion).toBeVisible();
        expect(tamuEmailAccordion).toBeVisible();
        expect(deletePostAccordion).toBeVisible();

        userEvent.click(uploadScheduleAccordion);
        expect(uploadScheduleAccordion).toBeVisible();

        userEvent.click(uploadTranscriptAccordion);
        expect(uploadTranscriptAccordion).toBeVisible();

        userEvent.click(optionalTranscriptAccordion);
        expect(optionalTranscriptAccordion).toBeVisible();

        userEvent.click(tamuEmailAccordion);
        expect(tamuEmailAccordion).toBeVisible();

        userEvent.click(deletePostAccordion);
        expect(deletePostAccordion).toBeVisible();
    });

    test('upload schedule accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const uploadScheduleAccordion = screen.getByText('How can I upload my schedule?');
        userEvent.click(uploadScheduleAccordion);
        const uploadScheduleAccordionText = screen.getByText("Go to your Profile page and select the button 'Import Schedule (*.ics)'. This takes in only *ics files which can be downloaded from Howdy or any other calendar.");
        expect(uploadScheduleAccordionText).toBeInTheDocument();
    });

    test('upload transcript accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const uploadTranscriptAccordion = screen.getByText('What kind of transcript can I upload?');
        userEvent.click(uploadTranscriptAccordion);
        const uploadTranscriptAccordionText = screen.getByText("Go to your Profile page and select the button 'Upload Transcript'. This takes in only *.pdf files which can be downloaded from Howdy. This can be official or unofficial transcripts.");
        expect(uploadTranscriptAccordionText).toBeInTheDocument();
    });

    test('optional transcript accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const optionalTranscriptAccordion = screen.getByText('Do I have to upload my transcript?');
        userEvent.click(optionalTranscriptAccordion);
        const optionalTranscriptAccordionText = screen.getByText("You don't have to upload your transcript to participate in any study/tutor sessions or to become a tutor. However, if you choose to become a tutor and have not uploaded a transcript for a class you have taken and gotten a B or A, then you will not be considered a 'Verified Tutor'. People can see whether or not you are a 'Verified Tutor' for the course you'd like to tutor.");
        expect(optionalTranscriptAccordionText).toBeInTheDocument();
    });

    test('TAMU email accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const tamuEmailAccordion = screen.getByText('Can I log in with a non-TAMU email?');
        userEvent.click(tamuEmailAccordion);
        const tamuEmailAccordionText = screen.getByText("You can't log in with a non-TAMU email. TAMU Studor is only for Texas A&M University students only. Please don't give your information to anyone else as it may compromise your account.");
        expect(tamuEmailAccordionText).toBeInTheDocument();
    });

    test('delete post accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const deletePostAccordion = screen.getByText('How can I delete a session I created?');
        userEvent.click(deletePostAccordion);
        const deletePostAccordionText = screen.getByText("You can delete a session on your Landing page by selecting the button 'Edit' and click the button below the page saying 'Delete Session'.");
        expect(deletePostAccordionText).toBeInTheDocument();
    });
});
