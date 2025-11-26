// src/services/orderService.js
import { databases, DATABASE_ID, COLLECTION_IDS, ID } from '../config/appwrite';
import { Query } from 'appwrite';

class OrderService {
  // Create order
  async createOrder(orderData) {
    try {
      const orderNumber = this.generateOrderNumber();
      
      // Prepare flat fields for better querying
      const firstItem = orderData.items && orderData.items[0];
      
      const order = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        ID.unique(),
        {
          customerName: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          orderNumber,
          status: 'pending',
          paymentStatus: 'pending',
          subtotal: orderData.subtotal,
          gst: orderData.gst,
          totalAmount: orderData.total,
          paymentMethod: orderData.paymentMethod,
          userId: orderData.userId || 'guest',
          createdAt: orderData.createdAt,
          // Flat address fields
          address1: orderData.shippingAddress?.address1 || '',
          address2: orderData.shippingAddress?.address2 || '',
          city: orderData.shippingAddress?.city || '',
          state: orderData.shippingAddress?.state || '',
          pincode: orderData.shippingAddress?.pincode || '',
          // Main product info (first item)
          productName: firstItem?.productName || '',
          quantity: firstItem?.quantity || 1,
          // JSON strings for backward compatibility
          items: JSON.stringify(orderData.items || []),
          shippingAddress: JSON.stringify(orderData.shippingAddress || {})
        }
      );

      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user orders
  async getUserOrders(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      // Parse JSON strings
      const orders = response.documents.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        shippingAddress: JSON.parse(order.shippingAddress)
      }));

      return {
        success: true,
        orders,
        total: response.total
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }

  // Get all orders (admin only)
  async getAllOrders(filters = {}) {
    try {
      const queries = [];
      
      if (filters.status) {
        queries.push(Query.equal('status', filters.status));
      }
      
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      } else {
        queries.push(Query.limit(100));
      }
      
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      queries.push(Query.orderDesc('$createdAt'));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        queries
      );

      // Parse JSON strings
      const orders = response.documents.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        shippingAddress: JSON.parse(order.shippingAddress)
      }));

      return {
        success: true,
        orders,
        total: response.total
      };
    } catch (error) {
      console.error('Get all orders error:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        orderId
      );

      return {
        success: true,
        order: {
          ...order,
          items: JSON.parse(order.items),
          shippingAddress: JSON.parse(order.shippingAddress)
        }
      };
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status, trackingNumber = null) {
    try {
      const updateData = { status };
      
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      const order = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        orderId,
        updateData
      );

      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('Update order error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update payment status (admin only)
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const order = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        orderId,
        { paymentStatus }
      );

      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('Update payment status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VK${timestamp}${random}`;
  }

  // Get order statistics (admin only)
  async getOrderStats() {
    try {
      const allOrders = await this.getAllOrders({ limit: 1000 });
      
      if (!allOrders.success) {
        return allOrders;
      }

      const stats = {
        total: allOrders.total,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
      };

      allOrders.orders.forEach(order => {
        stats[order.status] = (stats[order.status] || 0) + 1;
        if (order.paymentStatus === 'paid') {
          stats.totalRevenue += order.totalAmount;
        }
      });

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Get order stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(orderData) {
    try {
      // Note: In production, this should be handled by an Appwrite Function
      // For now, we'll log the email data
      const emailData = {
        to: orderData.email,
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        body: `
          Dear ${orderData.customerName},
          
          Thank you for your order from Vadi-e-Kashmir!
          
          Order Details:
          Order ID: ${orderData.orderNumber}
          Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}
          
          Items:
          ${orderData.items.map(item => 
            `- ${item.productName} x ${item.quantity} - ₹${item.price * item.quantity}`
          ).join('\n')}
          
          Subtotal: ₹${orderData.subtotal}
          GST (5%): ₹${orderData.gst}
          Total: ₹${orderData.total}
          
          Shipping Address:
          ${orderData.shippingAddress.address1}
          ${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 + '\n' : ''}${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}
          
          Payment Method: ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
          
          We will process your order soon and notify you when it's shipped.
          
          Thank you for shopping with us!
          
          Best regards,
          Vadi-e-Kashmir Team
        `
      };

      console.log('Email notification would be sent:', emailData);
      
      // TODO: Implement actual email sending via Appwrite Function
      // Example: await fetch('YOUR_APPWRITE_FUNCTION_URL', {
      //   method: 'POST',
      //   body: JSON.stringify(emailData)
      // });

      return {
        success: true,
        message: 'Email notification queued'
      };
    } catch (error) {
      console.error('Send email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new OrderService();
