// src/services/blogService.js
import { databases, storage, DATABASE_ID, COLLECTION_IDS, BUCKET_IDS, ID } from '../config/appwrite';
import { Query } from 'appwrite';

class BlogService {
  // Get all published blogs
  async getBlogs(filters = {}) {
    try {
      const queries = [];
      
      if (filters.published !== false) {
        queries.push(Query.equal('published', true));
      }
      
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      } else {
        queries.push(Query.limit(50));
      }
      
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        queries
      );

      return {
        success: true,
        blogs: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Get blogs error:', error);
      return {
        success: false,
        error: error.message,
        blogs: []
      };
    }
  }

  // Get single blog by slug
  async getBlogBySlug(slug) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        [Query.equal('slug', slug)]
      );

      if (response.documents.length === 0) {
        return {
          success: false,
          error: 'Blog not found'
        };
      }

      const blog = response.documents[0];
      
      // Increment views
      await this.incrementViews(blog.$id, blog.views || 0);

      return {
        success: true,
        blog
      };
    } catch (error) {
      console.error('Get blog error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get single blog by ID
  async getBlog(blogId) {
    try {
      const blog = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        blogId
      );

      return {
        success: true,
        blog
      };
    } catch (error) {
      console.error('Get blog error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create blog (admin only)
  async createBlog(blogData, featuredImage = null) {
    try {
      let imageUrl = '';
      
      // Upload featured image if provided
      if (featuredImage) {
        const uploadResult = await this.uploadBlogImage(featuredImage);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        }
      }

      const blog = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        ID.unique(),
        {
          ...blogData,
          featuredImage: imageUrl,
          views: 0
        }
      );

      return {
        success: true,
        blog
      };
    } catch (error) {
      console.error('Create blog error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update blog (admin only)
  async updateBlog(blogId, blogData, newFeaturedImage = null) {
    try {
      let imageUrl = blogData.featuredImage || '';
      
      // Upload new featured image if provided
      if (newFeaturedImage) {
        const uploadResult = await this.uploadBlogImage(newFeaturedImage);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        }
      }

      const blog = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        blogId,
        {
          ...blogData,
          featuredImage: imageUrl
        }
      );

      return {
        success: true,
        blog
      };
    } catch (error) {
      console.error('Update blog error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete blog (admin only)
  async deleteBlog(blogId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        blogId
      );

      return {
        success: true,
        message: 'Blog deleted successfully'
      };
    } catch (error) {
      console.error('Delete blog error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload blog image
  async uploadBlogImage(file) {
    try {
      const response = await storage.createFile(
        BUCKET_IDS.BLOGS,
        ID.unique(),
        file
      );

      // Construct the URL dynamically using environment variables
      const urlString = `${process.env.REACT_APP_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_IDS.BLOGS}/files/${response.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;

      console.log('Blog image uploaded:', urlString);

      return {
        success: true,
        fileId: response.$id,
        url: urlString
      };
    } catch (error) {
      console.error('Upload image error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Increment blog views
  async incrementViews(blogId, currentViews) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        blogId,
        { views: currentViews + 1 }
      );
    } catch (error) {
      console.error('Increment views error:', error);
    }
  }

  // Search blogs
  async searchBlogs(searchTerm) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.BLOGS,
        [
          Query.search('title', searchTerm),
          Query.equal('published', true),
          Query.limit(50)
        ]
      );

      return {
        success: true,
        blogs: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Search blogs error:', error);
      return {
        success: false,
        error: error.message,
        blogs: []
      };
    }
  }
}

export default new BlogService();
