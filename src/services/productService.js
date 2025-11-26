// src/services/productService.js
import { databases, storage, DATABASE_ID, COLLECTION_IDS, BUCKET_IDS, ID } from '../config/appwrite';
import { Query } from 'appwrite';

class ProductService {
  // Get all products with optional filters
  async getProducts(filters = {}) {
    try {
      const queries = [];
      
      if (filters.categoryId) {
        queries.push(Query.equal('categoryId', filters.categoryId));
      }
      
      if (filters.featured) {
        queries.push(Query.equal('featured', true));
      }
      
      if (filters.active !== false) {
        queries.push(Query.equal('active', true));
      }
      
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      } else {
        queries.push(Query.limit(100));
      }
      
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        queries
      );

      return {
        success: true,
        products: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Get products error:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  }

  // Get single product by slug
  async getProductBySlug(slug) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        [Query.equal('slug', slug)]
      );

      if (response.documents.length === 0) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        product: response.documents[0]
      };
    } catch (error) {
      console.error('Get product error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get single product by ID
  async getProduct(productId) {
    try {
      const product = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        productId
      );

      return {
        success: true,
        product
      };
    } catch (error) {
      console.error('Get product error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create product (admin only)
  async createProduct(productData, images = []) {
    try {
      // Upload images first
      const imageUrls = [];
      for (const image of images) {
        const uploadResult = await this.uploadProductImage(image);
        if (uploadResult.success) {
          imageUrls.push(uploadResult.url);
        }
      }

      const product = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        ID.unique(),
        {
          ...productData,
          images: imageUrls
        }
      );

      return {
        success: true,
        product
      };
    } catch (error) {
      console.error('Create product error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update product (admin only)
  async updateProduct(productId, productData, newImages = []) {
    try {
      // Upload new images if provided
      const imageUrls = productData.images || [];
      for (const image of newImages) {
        const uploadResult = await this.uploadProductImage(image);
        if (uploadResult.success) {
          imageUrls.push(uploadResult.url);
        }
      }

      const product = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        productId,
        {
          ...productData,
          images: imageUrls
        }
      );

      return {
        success: true,
        product
      };
    } catch (error) {
      console.error('Update product error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete product (admin only)
  async deleteProduct(productId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        productId
      );

      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Delete product error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload product image
  async uploadProductImage(file) {
    try {
      const response = await storage.createFile(
        BUCKET_IDS.PRODUCTS,
        ID.unique(),
        file
      );

      // Construct the URL dynamically using environment variables
      const urlString = `${process.env.REACT_APP_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_IDS.PRODUCTS}/files/${response.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;

      console.log('Product image uploaded:', urlString);

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

  // Get product reviews
  async getProductReviews(productId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        [
          Query.equal('product', productId), // Changed from 'productId' to 'product'
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      return {
        success: true,
        reviews: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Get reviews error:', error);
      // Return empty reviews instead of failing
      return {
        success: true,
        error: error.message,
        reviews: [],
        total: 0
      };
    }
  }

  // Add product review
  async addReview(reviewData) {
    try {
      const review = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.REVIEWS,
        ID.unique(),
        reviewData
      );

      // Update product rating
      await this.updateProductRating(reviewData.productId);

      return {
        success: true,
        review
      };
    } catch (error) {
      console.error('Add review error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update product rating based on reviews
  async updateProductRating(productId) {
    try {
      const reviews = await this.getProductReviews(productId);
      
      if (reviews.success && reviews.reviews.length > 0) {
        const totalRating = reviews.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.reviews.length;

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_IDS.PRODUCTS,
          productId,
          {
            rating: averageRating,
            reviewCount: reviews.reviews.length
          }
        );
      }
    } catch (error) {
      console.error('Update rating error:', error);
    }
  }

  // Search products
  async searchProducts(searchTerm) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.PRODUCTS,
        [
          Query.search('name', searchTerm),
          Query.limit(50)
        ]
      );

      return {
        success: true,
        products: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('Search products error:', error);
      return {
        success: false,
        error: error.message,
        products: []
      };
    }
  }
}

export default new ProductService();
