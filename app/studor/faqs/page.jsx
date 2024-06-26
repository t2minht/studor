'use client'
import { Container, Accordion, Center, Space, Image } from '@mantine/core';
import howdyScheduleImage from './images/howdySchedule.png';
import uploadScheduleImage from './images/uploadSchedule.png';
import uploadTranscriptImage1 from './images/uploadTranscript1.png';
import uploadTranscriptImage2 from './images/uploadTranscript2.png';
import uploadSessionHistoryImage from './images/sessionHistory.png'
import uploadVerifiedTutorImage from './images/verifiedTutor.png'
import uploadNonverifiedTutorImage from './images/nonverifiedTutor.png'
import uploadTutorRatingsImage from './images/tutorRatings.png'
import NextImage from 'next/image';

// responses to frequently asked questions
const uploadSchedule =
  "Go to your Profile page and select the button 'Import Schedule (*.ics)'. This takes in only *.ics files which can be downloaded from Howdy or any other calendar.";

const howdySchedule =
  "Log into Howdy. Go to the 'My Dashboard' page and click the calendar icon between the 'Print Schedule' button and 'Review/Order Books' button. This should download your class schedule as an *.ics file.";

const noShowCourse =
  "If you don't see your course appear on the calendar, this might mean there is no designated time block for the course according to Howdy and will therefore not appear on the calendar. If this is not your issue, try adding the course manually and see if it works. If not, there is a separate issue that may need fixing on our end.";

const uploadTranscript =
  "Go to your Profile page and select the button 'Upload Transcript'. This takes in only *.pdf files which can be downloaded from Howdy. This can be official or unofficial transcripts.";

const optionalTranscript =
  "You don't have to upload your transcript to participate in any study/tutor sessions or to become a tutor. However, if you choose to become a tutor and have not uploaded a transcript for a class you have taken and gotten a A or S, then you will not be considered a 'Verified Tutor'. People can see whether or not you are a 'Verified Tutor' for the course you'd like to tutor. Image of a verified and non-verified tutor indicator is below:";

const transcriptData =
  "Any official or unofficial transcript will work to verify you as a tutor. No personal information such as UIN or grades will be stored. The transcript is solely used to check whether or not you have taken the course and received an A or S, then afterwards, the transcript will be discarded. If you don't feel comfortable doing this, you can still be a tutor for any course without uploading a transcript, you'll just be not verified by us.";

const tamuEmail =
  "You can't log in with a non-TAMU email. TAMU Studor is only for Texas A&M University students only. Please don't give your information to anyone else as it may compromise your account.";

const deletePost =
  "You can delete a session on your Landing page by selecting the button 'Edit' and click the button below the page saying 'Delete Session'.";

const joinedSessions =
  "Your own postings will be shown first on your landing page. To see your joined sessions (not created by you), you can scroll down until you see 'Joined Sessions'.";

const sessionHistory =
  "Go to your Profile page and scroll down until you find the 'Tutoring History' or 'Study Group History' table. Click the 'View' button on the specific session you want to view more details about.";

const tutorRatings =
  "Go to your Profile page and scroll down until you find the 'Tutoring History' table. Click the 'View' button on the specific session you want to rate. At the very bottom of the popup/modal there should be a 'Rate Tutor' section. Once you click the 'Submit' button, your rating of the tutor will be sent. Note that you will only be able to submit a rating once per session.";

const browserIssue =
  "From our knowledge, creating and editing a session doesn't work on Firefox browsers. This may be the issue why some features aren't working for you. Please switch to another browser. It should work on Google Chrome, Brave, and Safari.";

// opens small accordion housing all frequently asked questions and their answers
export default function FaqSimple() {
  return (
    <>
      <Container size="sm">
        <Center>
          <h1>Frequently Asked Questions</h1>
        </Center>

        <Accordion variant="separated">
          <Accordion.Item value="browser-issue">
            <Accordion.Control>Not working on my browser?</Accordion.Control>
            <Accordion.Panel>{browserIssue}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="upload-schedule">
            <Accordion.Control>How can I upload my schedule?</Accordion.Control>
            <Accordion.Panel>{uploadSchedule}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={200} src={uploadScheduleImage} alt="Upload Schedule on TAMU Studor" />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="howdy-schedule">
            <Accordion.Control>How can I get my *.ics calendar file from Howdy?</Accordion.Control>
            <Accordion.Panel>{howdySchedule}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={300} src={howdyScheduleImage} alt="Howdy Schedule" />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="noshow-course">
            <Accordion.Control>I do not see my course on the calendar</Accordion.Control>
            <Accordion.Panel>{noShowCourse}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="upload-transcript">
            <Accordion.Control>Where and what kind of transcript can I upload?</Accordion.Control>
            <Accordion.Panel>{uploadTranscript}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={200} src={uploadTranscriptImage1} alt="Download Transcript from Howdy" />
            </Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={300} src={uploadTranscriptImage2} alt="Upload Transcript on TAMU Studor" />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="optional-transcript">
            <Accordion.Control>Do I have to upload my transcript?</Accordion.Control>
            <Accordion.Panel>{optionalTranscript}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={150} mah={250} src={uploadNonverifiedTutorImage} alt="Non-verified Tutor" />
              <Image component={NextImage} maw={150} mah={225} src={uploadVerifiedTutorImage} alt="Verified Tutor" />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="transcript-data">
            <Accordion.Control>What data is collected from my transcript?</Accordion.Control>
            <Accordion.Panel>{transcriptData}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tamu-email">
            <Accordion.Control>Can I log in with a non-TAMU email?</Accordion.Control>
            <Accordion.Panel>{tamuEmail}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="session-history">
            <Accordion.Control>How can I view past tutoring/study group sessions?</Accordion.Control>
            <Accordion.Panel>{sessionHistory}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={250} src={uploadSessionHistoryImage} alt="Session History" />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tutor-ratings">
            <Accordion.Control>How can I rate my tutor?</Accordion.Control>
            <Accordion.Panel>{tutorRatings}</Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={250} src={uploadSessionHistoryImage} alt="Session History" />
            </Accordion.Panel>
            <Accordion.Panel> 
              <Image component={NextImage} maw={300} mah={450} src={uploadTutorRatingsImage} alt="Rate Tutor" />  
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="delete-post">
            <Accordion.Control>How can I delete a session I created?</Accordion.Control>
            <Accordion.Panel>{deletePost}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="joined-sessions">
            <Accordion.Control>How can I view my Joined Sessions?</Accordion.Control>
            <Accordion.Panel>{joinedSessions}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Space h='xl' />
    </>
  );
}