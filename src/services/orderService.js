// src/services/orderService.js
import { databases, DATABASE_ID, COLLECTION_IDS, ID, functions, EMAIL_FUNCTION_ID } from '../config/appwrite';
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
          total: orderData.total,
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

  // Track order by order number
  async trackOrderByNumber(orderNumber) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.ORDERS,
        [
          Query.equal('orderNumber', orderNumber),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        return {
          success: false,
          error: 'Order not found. Please check your order number.'
        };
      }

      const order = response.documents[0];

      return {
        success: true,
        order: {
          ...order,
          items: JSON.parse(order.items),
          shippingAddress: JSON.parse(order.shippingAddress)
        }
      };
    } catch (error) {
      console.error('Track order error:', error);
      
      // Handle authorization errors
      if (error.code === 401 || error.message?.includes('authorized')) {
        return {
          success: false,
          error: 'Please login to track your order'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to track order'
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

  // Send custom email to customer
  async sendCustomEmail(order, template, trackingLink = null) {
    try {
      let subject, body;

      switch (template) {
        case 'confirmed':
          subject = `Order Confirmed - ${order.orderNumber}`;
          body = `
Dear ${order.customerName},

Your order has been confirmed!

Order Details:
Order ID: ${order.orderNumber}
Order Date: ${new Date(order.$createdAt).toLocaleDateString()}
Total Amount: ₹${order.totalAmount.toLocaleString()}

We are processing your order and will notify you when it ships.

Thank you for shopping with Vadi-e-Kashmir!

Best regards,
Vadi-e-Kashmir Team
          `;
          break;

        case 'shipped':
          subject = `Order Shipped - ${order.orderNumber}`;
          body = `
Dear ${order.customerName},

Great news! Your order has been shipped! 📦

Order ID: ${order.orderNumber}
${trackingLink ? `Tracking Link: ${trackingLink}\n` : ''}
${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}\n` : ''}

Your order is on its way and should arrive soon.

Shipping Address:
${order.address1}
${order.address2 ? order.address2 + '\n' : ''}${order.city}, ${order.state} - ${order.pincode}

Thank you for choosing Vadi-e-Kashmir!

Best regards,
Vadi-e-Kashmir Team
          `;
          break;

        case 'cancelled':
          subject = `Order Cancelled - ${order.orderNumber}`;
          body = `
Dear ${order.customerName},

Your order has been cancelled as requested.

Order ID: ${order.orderNumber}
Total Amount: ₹${order.totalAmount.toLocaleString()}

If this was not intentional or if you have any questions, please contact our customer support.

We hope to serve you again in the future!

Best regards,
Vadi-e-Kashmir Team
          `;
          break;

        default:
          return {
            success: false,
            error: 'Invalid email template'
          };
      }

      const emailData = {
        to: order.email,
        subject,
        body
      };

      console.log('📧 Sending email via Appwrite Function:', emailData);

      // Send email using Appwrite Function
      if (EMAIL_FUNCTION_ID) {
        try {
          const execution = await functions.createExecution(
            EMAIL_FUNCTION_ID,
            JSON.stringify(emailData),
            false // async execution
          );

          console.log('✅ Email function executed:', execution);

          return {
            success: true,
            message: `${template.charAt(0).toUpperCase() + template.slice(1)} email sent successfully!`
          };
        } catch (functionError) {
          console.error('❌ Appwrite Function error:', functionError);
          
          // If function is not set up, provide instructions
          if (functionError.code === 404 || !EMAIL_FUNCTION_ID) {
            console.log('\n⚠️  EMAIL FUNCTION NOT CONFIGURED');
            console.log('📝 To enable email sending with Appwrite:');
            console.log('   1. Go to your Appwrite Console > Functions');
            console.log('   2. Create a new function');
            console.log('   3. Use the email function code provided in APPWRITE_EMAIL_FUNCTION.md');
            console.log('   4. Add REACT_APP_EMAIL_FUNCTION_ID to your .env file\n');
            
            return {
              success: false,
              error: 'Email function not configured. Check console for setup instructions.'
            };
          }
          
          throw functionError;
        }
      } else {
        console.log('\n⚠️  EMAIL FUNCTION ID NOT SET');
        console.log('📝 Add REACT_APP_EMAIL_FUNCTION_ID to your .env file\n');
        
        return {
          success: false,
          error: 'Email function ID not configured. Add REACT_APP_EMAIL_FUNCTION_ID to .env file.'
        };
      }
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
