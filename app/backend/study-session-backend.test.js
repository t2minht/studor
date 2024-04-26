import { retrieveUserProfileInfo } from "@/app/backend/study-session-backend";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

// Mocking createServerActionClient function
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerActionClient: jest.fn(),
}));


describe('retrieveUserProfileInfo function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should retrieve user profile info successfully', async () => {
      const user = {
        id: 1,
        user_metadata: {
          name: 'Sean Mappen',
          email: 'smap@tomu.com',
          age: 19,
        },
      };
  
      // Mocking the getUser function
      const getUserMock = jest.fn().mockResolvedValue({ data: { user } });
  
      // Mocking supabase
      createServerActionClient.mockImplementation(() => ({
        auth: { getUser: getUserMock },
      }));
  
      const result = await retrieveUserProfileInfo();
  
      expect(result).toEqual({ id: 1, name: 'Sean Mappen', email: 'smap@tomu.com', age: 19 });
      expect(getUserMock).toHaveBeenCalledTimes(1);
    });

  
    it('should handle supabase error', async () => {
      const error = new Error('Supabase error');
  
      // Mocking the getUser function
      const getUserMock = jest.fn().mockRejectedValue(error);
  
      // Mocking supabase
      createServerActionClient.mockImplementation(() => ({
        auth: { getUser: getUserMock },
      }));
  
      await expect(retrieveUserProfileInfo()).rejects.toThrow(error);
      expect(getUserMock).toHaveBeenCalledTimes(1);
    });
  });