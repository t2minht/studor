'use client'
import { Container, Title, Accordion, Center } from '@mantine/core';

const uploadSchedule =
  "Go to your Profile page and select the button 'Import Schedule (*.ics)'. This takes in only *ics files which can be downloaded from Howdy or any other calendar.";

const uploadTranscript =
  "Go to your Profile page and select the button 'Upload Transcript'. This takes in only *.pdf files which can be downloaded from Howdy. This can be official or unofficial transcripts.";

const optionalTranscript =
  "You don't have to upload your transcript to participate in any study/tutor sessions or to become a tutor. However, if you choose to become a tutor and have not uploaded a transcript for a class you have taken and gotten a B or A, then you will not be considered a 'Verified Tutor'. People can see whether or not you are a 'Verified Tutor' for the course you'd like to tutor.";

const tamuEmail =
  "You can't log in with a non-TAMU email. TAMU Studor is only for Texas A&M University students only. Please don't give your information to anyone else as it may compromise your account.";

const deletePost =
  "You can delete a session on your Landing page by selecting the button 'Edit' and click the button below the page saying 'Delete Session'.";

export default function FaqSimple() {
  return (
    <Container size="sm">
      <Center>
        <h1>Frequently Asked Questions</h1>
      </Center>

      <Accordion variant="separated">
        <Accordion.Item value="upload-schedule">
          <Accordion.Control>How can I upload my schedule?</Accordion.Control>
          <Accordion.Panel>{uploadSchedule}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="upload-transcript">
          <Accordion.Control>What kind of transcript can I upload?</Accordion.Control>
          <Accordion.Panel>{uploadTranscript}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="optional-transcript">
          <Accordion.Control>Do I have to upload my transcript?</Accordion.Control>
          <Accordion.Panel>{optionalTranscript}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="tamu-email">
          <Accordion.Control>Can I log in with a non-TAMU email?</Accordion.Control>
          <Accordion.Panel>{tamuEmail}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="delete-post">
          <Accordion.Control>How can I delete a session I created?</Accordion.Control>
          <Accordion.Panel>{deletePost}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}