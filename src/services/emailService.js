// src/services/emailService.js
// Service to send emails via Appwrite Functions

import { functions } from '../config/appwrite';

const EMAIL_FUNCTION_ID = process.env.REACT_APP_EMAIL_FUNCTION_ID || 'send-email';

const getEmailHeader = (title) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #faf6eb;
      color: #1c1917;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e8dac7;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #ffffff;
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid #faf6eb;
    }
    .logo {
      height: 44px;
      width: auto;
    }
    .content {
      padding: 35px 24px;
    }
    .title {
      font-family: Georgia, serif;
      font-size: 24px;
      color: #78350f;
      margin-top: 0;
      margin-bottom: 20px;
      font-style: italic;
    }
    .body-text {
      font-size: 14.5px;
      line-height: 1.6;
      color: #44403c;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 28px;
      background-color: #b45309;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      border-radius: 8px;
      font-size: 13.5px;
      margin-top: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .footer {
      background-color: #faf6eb;
      padding: 24px;
      text-align: center;
      font-size: 11.5px;
      color: #78716c;
      border-top: 1px solid #e8dac7;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img src="https://vadiekashmir.com/vadielogo.png" alt="VadieKashmir" class="logo" />
    </div>
    <div class="content">
      <h1 class="title">${title}</h1>
`;

const getEmailFooter = () => `
    </div>
    <div class="footer">
      <p style="margin: 0; font-weight: bold; color: #78350f;">VadieKashmir</p>
      <p style="margin: 5px 0 0 0;">Connecting you directly to the crafters, weavers, and farmers of the valley.</p>
      <p style="margin: 15px 0 0 0; font-size: 11px; color: #a8a29e;">© ${new Date().getFullYear()} VadieKashmir. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

class EmailService {
  // Compile welcome email
  compileWelcomeEmail(userData) {
    const name = userData.name || 'Friend';
    return `
      ${getEmailHeader('Welcome to the Valley of VadieKashmir')}
      <p class="body-text">Hello ${name},</p>
      <p class="body-text">We are so incredibly grateful to have you join our little circle. VadieKashmir was created by two college students with a simple, hopeful dream: to build a bridge directly connecting your home to the weavers, farmers, and makers of Kashmir.</p>
      <p class="body-text">By signing up, you are already helping keep local cottage industries and family businesses alive. Every product you find here is handcrafted with hours of love, patience, and age-old tradition.</p>
      <p class="body-text">We hope you enjoy exploring the treasures of the valley.</p>
      <a href="https://vadiekashmir.com" class="button">Explore Collections</a>
      ${getEmailFooter()}
    `;
  }

  // Compile order email
  compileOrderEmail(orderData) {
    const name = orderData.customerName || 'Customer';
    const items = orderData.items || [];
    const itemsHtml = items.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #faf6eb;">
        <div>
          <span style="font-weight: bold; color: #1c1917;">${item.name}</span>
          <br/>
          <span style="font-size: 12px; color: #78716c;">Quantity: ${item.quantity}</span>
        </div>
        <span style="font-weight: bold; color: #b45309;">₹${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    return `
      ${getEmailHeader('Thank you for your order!')}
      <p class="body-text">Hello ${name},</p>
      <p class="body-text">Your order <strong>#${orderData.orderNumber}</strong> has been received and is being processed by our creators in the valley. Every purchase you make flows value directly back to the weavers' hearths and the farmers' homes.</p>
      
      <div style="background-color: #faf6eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; color: #78350f; font-family: serif; font-style: italic;">Order Details</h3>
        ${itemsHtml}
        <div style="display: flex; justify-content: space-between; padding: 12px 0 0 0; font-weight: bold;">
          <span>Total Paid</span>
          <span style="color: #b45309;">₹${orderData.total.toLocaleString()}</span>
        </div>
      </div>

      <p class="body-text">We will send you a tracking number as soon as your package starts its journey from Kashmir.</p>
      <a href="https://vadiekashmir.com/#track" class="button">Track Your Order</a>
      ${getEmailFooter()}
    `;
  }

  // Send welcome email to customer (using order_confirmation workaround for Appwrite compatibility)
  async sendWelcomeEmail(userData) {
    try {
      const execution = await functions.createExecution(
        EMAIL_FUNCTION_ID,
        JSON.stringify({
          type: 'order_confirmation',
          orderData: {
            email: userData.email,
            customerName: userData.name || 'Valued Customer'
          },
          htmlBody: this.compileWelcomeEmail(userData)
        }),
        false
      );

      console.log('📧 Welcome email triggered');
      return { success: true, executionId: execution.$id };
    } catch (error) {
      console.error('❌ Welcome email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order confirmation email to customer
  async sendOrderConfirmation(orderData) {
    try {
      const execution = await functions.createExecution(
        EMAIL_FUNCTION_ID,
        JSON.stringify({
          type: 'order_confirmation',
          orderData: orderData,
          htmlBody: this.compileOrderEmail(orderData)
        }),
        false // async execution
      );

      console.log('📧 Order confirmation email triggered');
      return { success: true, executionId: execution.$id };
    } catch (error) {
      console.error('❌ Email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order status update email
  async sendStatusUpdate(orderData) {
    try {
      const execution = await functions.createExecution(
        EMAIL_FUNCTION_ID,
        JSON.stringify({
          type: 'status_update',
          orderData: orderData
        }),
        false
      );

      console.log('📧 Status update email triggered');
      return { success: true, executionId: execution.$id };
    } catch (error) {
      console.error('❌ Email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Notify admin about new order
  async notifyAdmin(orderData) {
    try {
      const execution = await functions.createExecution(
        EMAIL_FUNCTION_ID,
        JSON.stringify({
          type: 'admin_notification',
          orderData: orderData
        }),
        false
      );

      console.log('📧 Admin notification triggered');
      return { success: true, executionId: execution.$id };
    } catch (error) {
      console.error('❌ Admin notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send all emails for a new order (customer + admin)
  async sendNewOrderEmails(orderData) {
    const results = await Promise.all([
      this.sendOrderConfirmation(orderData),
      this.notifyAdmin(orderData)
    ]);

    return {
      customerEmail: results[0],
      adminEmail: results[1]
    };
  }
}

const emailService = new EmailService();
export default emailService;
