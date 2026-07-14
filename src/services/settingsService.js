// src/services/settingsService.js
// Service to manage app settings stored in Appwrite database

import { databases, DATABASE_ID, COLLECTION_IDS, ID } from '../config/appwrite';

const SETTINGS_DOC_ID = 'app_settings';

class SettingsService {
  // Get all settings
  async getSettings() {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID
      );
      return { success: true, settings: doc };
    } catch (error) {
      // If document doesn't exist, create default settings
      if (error.code === 404) {
        return await this.initializeSettings();
      }
      console.error('Error getting settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Initialize default settings
  async initializeSettings() {
    try {
      const defaultSettings = {
        acceptingOrders: false,
        maintenanceMode: false,
        carouselImages: "",
        theme: "default",
        bulletinText: "",
        updatedAt: new Date().toISOString()
      };

      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID,
        defaultSettings
      );

      return { success: true, settings: doc };
    } catch (error) {
      console.error('Error initializing settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Update accepting orders status
  async setAcceptingOrders(status) {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID,
        {
          acceptingOrders: status,
          updatedAt: new Date().toISOString()
        }
      );
      return { success: true, settings: doc };
    } catch (error) {
      // If document doesn't exist, create it first
      if (error.code === 404) {
        await this.initializeSettings();
        return await this.setAcceptingOrders(status);
      }
      console.error('Error updating accepting orders:', error);
      return { success: false, error: error.message };
    }
  }

  // Get accepting orders status
  async getAcceptingOrders() {
    try {
      const result = await this.getSettings();
      if (result.success) {
        return { success: true, acceptingOrders: result.settings.acceptingOrders };
      }
      return { success: false, acceptingOrders: false };
    } catch (error) {
      console.error('Error getting accepting orders status:', error);
      return { success: false, acceptingOrders: false };
    }
  }

  // Get carousel images
  async getCarouselImages() {
    try {
      const result = await this.getSettings();
      if (result.success && result.settings.carouselImages) {
        return { success: true, carouselImages: JSON.parse(result.settings.carouselImages) };
      }
      return { success: true, carouselImages: [] };
    } catch (error) {
      console.error('Error getting carousel images:', error);
      return { success: false, error: error.message };
    }
  }

  // Update carousel images
  async setCarouselImages(images) {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID,
        {
          carouselImages: JSON.stringify(images),
          updatedAt: new Date().toISOString()
        }
      );
      return { success: true, settings: doc };
    } catch (error) {
      if (error.code === 404) {
        await this.initializeSettings();
        return await this.setCarouselImages(images);
      }
      console.error('Error updating carousel images:', error);
      return { success: false, error: error.message };
    }
  }

  // Get app theme
  async getTheme() {
    try {
      const result = await this.getSettings();
      if (result.success && result.settings.theme) {
        return { success: true, theme: result.settings.theme };
      }
      return { success: true, theme: 'default' };
    } catch (error) {
      console.error('Error getting theme:', error);
      return { success: false, error: error.message, theme: 'default' };
    }
  }

  // Update app theme
  async setTheme(theme) {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID,
        {
          theme,
          updatedAt: new Date().toISOString()
        }
      );
      return { success: true, settings: doc };
    } catch (error) {
      if (error.code === 404) {
        await this.initializeSettings();
        return await this.setTheme(theme);
      }
      console.error('Error updating theme:', error);
      return { success: false, error: error.message };
    }
  }

  // Get bulletin text
  async getBulletinText() {
    try {
      const result = await this.getSettings();
      if (result.success && result.settings.bulletinText) {
        return { success: true, bulletinText: result.settings.bulletinText };
      }
      return { success: true, bulletinText: '' };
    } catch (error) {
      console.error('Error getting bulletin text:', error);
      return { success: false, error: error.message, bulletinText: '' };
    }
  }

  // Update bulletin text
  async setBulletinText(text) {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.SETTINGS,
        SETTINGS_DOC_ID,
        {
          bulletinText: text,
          updatedAt: new Date().toISOString()
        }
      );
      return { success: true, settings: doc };
    } catch (error) {
      if (error.code === 404) {
        await this.initializeSettings();
        return await this.setBulletinText(text);
      }
      console.error('Error updating bulletin text:', error);
      return { success: false, error: error.message };
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
