import { createMocks } from 'node-mocks-http';
import {
    retrieveProfileStudySession,
    retrieveUserProfileInfo,
    submitStudyGroupSessionData,
    updateStudyGroupSessionData,
    retrieveExistingNotJoinedSessions,
    retrieveExistingJoinedSessions,
    deleteSession,
    joinSession,
    leaveSession,
    retrieveFutureHostedSessions,
    getParticipantsInSession,
    getParticipantsInAllSessions,
} from './study-session-backend';

const supabaseMock = {
    auth: {
        getUser: jest.fn(() => ({
            data: { user: { id: 'testUserId', user_metadata: { avatar_url: 'testAvatarUrl' } } },
        })),
    }
};



jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createServerActionClient: jest.fn(() => supabaseMock),
}));

beforeEach(() => {
    jest.clearAllMocks();
});
describe('User Data Functions', () => {
    test('retrieveUserProfileInfo', async () => {
        const result = await retrieveUserProfileInfo();
        expect(result).toHaveProperty('avatar_url', 'testAvatarUrl');
    });

    // Add more tests for other user-related functions...
});
