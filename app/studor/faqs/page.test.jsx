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
                addListener: jest.fn(),
                removeListener: jest.fn(),
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
        const uploadTranscriptAccordion = screen.getByText('Where and what kind of transcript can I upload?');
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
        const uploadTranscriptAccordion = screen.getByText('Where and what kind of transcript can I upload?');
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
        const uploadScheduleAccordionText = screen.getByText("Go to your Profile page and select the button 'Import Schedule (*.ics)'. This takes in only *.ics files which can be downloaded from Howdy or any other calendar.");
        expect(uploadScheduleAccordionText).toBeInTheDocument();
    });

    test('upload transcript accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const uploadTranscriptAccordion = screen.getByText('Where and what kind of transcript can I upload?');
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
        const optionalTranscriptAccordionText = screen.getByText("You don't have to upload your transcript to participate in any study/tutor sessions or to become a tutor. However, if you choose to become a tutor and have not uploaded a transcript for a class you have taken and gotten a B or A, then you will not be considered a 'Verified Tutor'. People can see whether or not you are a 'Verified Tutor' for the course you'd like to tutor. Image of a verified and non-verified tutor indicator is below:");
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

    test('howdy schedule accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const howdyScheduleAccordion = screen.getByText('How can I get my *.ics calendar file from Howdy?');
        userEvent.click(howdyScheduleAccordion);
        const howdyScheduleAccordionText = screen.getByText("Log into Howdy. Go to the 'My Dashboard' page and click the calendar icon between the 'Print Schedule' button and 'Review/Order Books' button. This should download your class schedule as an *.ics file.");
        expect(howdyScheduleAccordionText).toBeInTheDocument();
    });

    test('no show course accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const noShowCourseAccordion = screen.getByText('I do not see my course on the calendar');
        userEvent.click(noShowCourseAccordion);
        const noShowCourseAccordionText = screen.getByText("If you don't see your course appear on the calendar, this might mean there is no designated time block for the course according to Howdy and will therefore not appear on the calendar. If this is not your issue, try adding the course manually and see if it works. If not, there is a separate issue that may need fixing on our end.");
        expect(noShowCourseAccordionText).toBeInTheDocument();
    });

    test('transcript data accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const transcriptDataAccordion = screen.getByText('What data is collected from my transcript?');
        userEvent.click(transcriptDataAccordion);
        const transcriptDataAccordionText = screen.getByText("Any official or unofficial transcript will work to verify you as a tutor. No personal information such as UIN or grades will be stored. The transcript is solely used to check whether or not you have taken the course and received a B or an A, then afterwards, the transcript will be discarded. If you don't feel comfortable doing this, you can still be a tutor for any course without uploading a transcript, you'll just be not verified by us.");
        expect(transcriptDataAccordionText).toBeInTheDocument();
    });

    test('session history accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const sessionHistoryAccordion = screen.getByText('How can I view past tutoring/study group sessions?');
        userEvent.click(sessionHistoryAccordion);
        const sessionHistoryAccordionText = screen.getByText("Go to your Profile page and scroll down until you find the 'Tutoring History' or 'Study Group History' table. Click the 'View' button on the specific session you want to view more details about.");
        expect(sessionHistoryAccordionText).toBeInTheDocument();
    });

    test('tutor ratings accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const tutorRatingsAccordion = screen.getByText('How can I rate my tutor?');
        userEvent.click(tutorRatingsAccordion);
        const tutorRatingsAccordionText = screen.getByText("Go to your Profile page and scroll down until you find the 'Tutoring History' table. Click the 'View' button on the specific session you want to rate. At the very bottom of the popup/modal there should be a 'Rate Tutor' section. Once you click the 'Submit' button, your rating of the tutor will be sent. Note that you will only be able to submit a rating once per session.");
        expect(tutorRatingsAccordionText).toBeInTheDocument();
    });

    test('joined sessions accordion is visible when clicked', () => {
        render(
            <MantineProvider>
                <FaqSimple />
            </MantineProvider>
        );
        const joinedSessionsAccordion = screen.getByText('How can I view my Joined Sessions?');
        userEvent.click(joinedSessionsAccordion);
        const joinedSessionsAccordionText = screen.getByText("Your own postings will be shown first on your landing page. To see your joined sessions (not created by you), you can scroll down until you see 'Joined Sessions'.");
        expect(joinedSessionsAccordionText).toBeInTheDocument();
    });

});
