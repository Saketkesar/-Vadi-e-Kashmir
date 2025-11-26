// src/services/categoryService.js
import { databases, storage, DATABASE_ID, COLLECTION_IDS, BUCKET_IDS, ID } from '../config/appwrite';
import { Query } from 'appwrite';

class CategoryService {
  // Get all categories
  async getCategories() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CATEGORIES,
        [
          Query.equal('active', true),
          Query.limit(100)
        ]
      );

      return {
        success: true,
        categories: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        error: error.message,
        categories: []
      };
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.CATEGORIES,
        [Query.equal('slug', slug)]
      );

      if (response.documents.length === 0) {
        return {
          success: false,
          error: 'Category not found'
        };
      }

      return {
        success: true,
        category: response.documents[0]
      };
    } catch (error) {
      console.error('Get category error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create category (admin only)
  async createCategory(categoryData, image = null) {
    try {
      let imageUrl = '';
      
      if (image) {
        const uploadResult = await storage.createFile(
          BUCKET_IDS.PRODUCTS,
          ID.unique(),
          image
        );
        imageUrl = `${process.env.REACT_APP_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_IDS.PRODUCTS}/files/${uploadResult.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;
      }

      const category = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.CATEGORIES,
        ID.unique(),
        {
          ...categoryData,
          image: imageUrl
        }
      );

      return {
        success: true,
        category
      };
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update category (admin only)
  async updateCategory(categoryId, categoryData, newImage = null) {
    try {
      let imageUrl = categoryData.image || '';
      
      if (newImage) {
        const uploadResult = await storage.createFile(
          BUCKET_IDS.PRODUCTS,
          ID.unique(),
          newImage
        );
        imageUrl = `${process.env.REACT_APP_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_IDS.PRODUCTS}/files/${uploadResult.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;
      }

      const category = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.CATEGORIES,
        categoryId,
        {
          ...categoryData,
          image: imageUrl
        }
      );

      return {
        success: true,
        category
      };
    } catch (error) {
      console.error('Update category error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete category (admin only)
  async deleteCategory(categoryId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.CATEGORIES,
        categoryId
      );

      return {
        success: true,
        message: 'Category deleted successfully'
      };
    } catch (error) {
      console.error('Delete category error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CategoryService();
