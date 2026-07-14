// src/services/authService.js
import { account, ID } from '../config/appwrite';
import { databases, DATABASE_ID, COLLECTION_IDS } from '../config/appwrite';
import { Query } from 'appwrite';

class AuthService {
  constructor() {
    this.sessionPromise = null;
  }

  // Ensure the user has an Appwrite session (creates anonymous session if none exists)
  async ensureSession() {
    if (this.sessionPromise) {
      return this.sessionPromise;
    }

    this.sessionPromise = (async () => {
      try {
        const user = await account.get();
        return { success: true, user };
      } catch (e) {
        try {
          const session = await account.createAnonymousSession();
          return { success: true, session };
        } catch (err) {
          // If session is already active, consider it a success
          if (err.message?.includes('prohibited') || err.code === 400) {
            return { success: true };
          }
          console.error('Failed to create anonymous session:', err);
          return { success: false, error: err.message };
        }
      } finally {
        this.sessionPromise = null;
      }
    })();

    return this.sessionPromise;
  }

  // Create phone session (send OTP)
  async sendOTP(phoneNumber) {
    try {
      // Format phone number to E.164 format if needed
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const token = await account.createPhoneToken(
        ID.unique(),
        formattedPhone
      );
      
      return {
        success: true,
        userId: token.userId,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify OTP and create session
  async verifyOTP(userId, otp) {
    try {
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore
      }
      const session = await account.createSession(userId, otp);
      
      // Get user details
      const user = await account.get();
      
      // Create or update user in database
      await this.createOrUpdateUser(user);
      
      return {
        success: true,
        session,
        user
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Admin email/password login
  async loginWithEmail(email, password) {
    try {
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore
      }
      const session = await account.createEmailPasswordSession(email, password);
      
      // Get user details
      const user = await account.get();
      
      return {
        success: true,
        session,
        user
      };
    } catch (error) {
      console.error('Email login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const session = await account.getSession('current');
      return {
        success: true,
        session
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout
  async logout() {
    try {
      await account.deleteSession('current');
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create or update user profile in database
  async createOrUpdateUser(authUser) {
    try {
      const userData = {
        userId: authUser.$id,
        phone: authUser.phone,
        name: authUser.name || '',
        email: authUser.email || '',
        isAdmin: false
      };

      let isNew = false;
      try {
        const existingUsers = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.USERS,
          [Query.equal('userId', authUser.$id)]
        );

        if (existingUsers.documents.length > 0) {
          // User exists, update instead
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_IDS.USERS,
            existingUsers.documents[0].$id,
            userData
          );
        } else {
          // Create new user
          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.USERS,
            ID.unique(),
            userData
          );
          isNew = true;
        }
      } catch (error) {
        console.error('Error syncing user document:', error);
      }

      return {
        success: true,
        user: userData,
        isNew
      };
    } catch (error) {
      console.error('Create/Update user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update user profile
  async updateProfile(userId, data) {
    try {
      // Get user document
      const users = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.USERS,
        [`userId=${userId}`]
      );

      if (users.documents.length === 0) {
        throw new Error('User not found');
      }

      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.USERS,
        users.documents[0].$id,
        data
      );

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user profile from database
  async getUserProfile(userId) {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.USERS,
        [Query.equal('userId', userId)]
      );

      if (users.documents.length === 0) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: users.documents[0]
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new AuthService();
