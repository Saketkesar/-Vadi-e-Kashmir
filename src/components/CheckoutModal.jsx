// src/components/CheckoutModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';

const CheckoutModal = ({ cart, onClose, onSuccess }) => {
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const handleFormChange = (field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!checkoutForm.firstName || !checkoutForm.lastName) {
      toast.error('Please enter your full name');
      return;
    }
    if (!checkoutForm.email || !checkoutForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!checkoutForm.phone || checkoutForm.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!checkoutForm.address1) {
      toast.error('Please enter your address');
      return;
    }
    if (!checkoutForm.city || !checkoutForm.pincode || !checkoutForm.state) {
      toast.error('Please complete your address details');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        customerName: `${checkoutForm.firstName} ${checkoutForm.lastName}`,
        email: checkoutForm.email,
        phone: checkoutForm.phone,
        items: cart.map(item => ({
          productId: item.$id || item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || ''
        })),
        shippingAddress: {
          address1: checkoutForm.address1,
          address2: checkoutForm.address2,
          city: checkoutForm.city,
          state: checkoutForm.state,
          pincode: checkoutForm.pincode
        },
        subtotal: subtotal,
        gst: gst,
        total: total,
        paymentMethod: 'cod',
        userId: 'guest',
        createdAt: new Date().toISOString()
      };

      const result = await orderService.createOrder(orderData);

      if (result.success) {
        // Send order confirmation email
        await orderService.sendOrderConfirmationEmail({
          ...orderData,
          orderNumber: result.order.orderNumber
        });

        toast.success(`Order placed successfully! 🎉\nOrder ID: ${result.order.orderNumber}\nConfirmation email sent to ${checkoutForm.email}`);
        
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
        
        // Navigate to home
        setTimeout(() => {
          window.location.hash = '#home';
        }, 2000);
      } else {
        console.error('Order creation failed:', result.error);
        toast.error(`Failed to place order: ${result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('An error occurred while placing the order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-800">Checkout</h2>
          <button
            onClick={onClose}
            disabled={placingOrder}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-stone-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div>
              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-bold text-lg text-stone-800 mb-4">Shipping Address</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2 text-sm">First Name *</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={checkoutForm.firstName}
                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-2 text-sm">Last Name *</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={checkoutForm.lastName}
                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-2 text-sm">Email Address *</label>
                    <input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={checkoutForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      required
                    />
                    <p className="text-xs text-stone-500 mt-1">Order confirmation will be sent to this email</p>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-2 text-sm">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={checkoutForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-2 text-sm">Address Line 1 *</label>
                    <input
                      type="text"
                      placeholder="House No., Street Name"
                      value={checkoutForm.address1}
                      onChange={(e) => handleFormChange('address1', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-2 text-sm">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="Area, Landmark"
                      value={checkoutForm.address2}
                      onChange={(e) => handleFormChange('address2', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-2 text-sm">City *</label>
                      <input
                        type="text"
                        placeholder="Srinagar"
                        value={checkoutForm.city}
                        onChange={(e) => handleFormChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-2 text-sm">Pincode *</label>
                      <input
                        type="text"
                        placeholder="190001"
                        value={checkoutForm.pincode}
                        onChange={(e) => handleFormChange('pincode', e.target.value)}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-2 text-sm">State / UT *</label>
                    <select 
                      value={checkoutForm.state}
                      onChange={(e) => handleFormChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      required
                    >
                      <option value="">Select State / Union Territory</option>
                      <optgroup label="States">
                        <option value="AP">Andhra Pradesh</option>
                        <option value="AR">Arunachal Pradesh</option>
                        <option value="AS">Assam</option>
                        <option value="BR">Bihar</option>
                        <option value="CT">Chhattisgarh</option>
                        <option value="GA">Goa</option>
                        <option value="GJ">Gujarat</option>
                        <option value="HR">Haryana</option>
                        <option value="HP">Himachal Pradesh</option>
                        <option value="JH">Jharkhand</option>
                        <option value="KA">Karnataka</option>
                        <option value="KL">Kerala</option>
                        <option value="MP">Madhya Pradesh</option>
                        <option value="MH">Maharashtra</option>
                        <option value="MN">Manipur</option>
                        <option value="ML">Meghalaya</option>
                        <option value="MZ">Mizoram</option>
                        <option value="NL">Nagaland</option>
                        <option value="OR">Odisha</option>
                        <option value="PB">Punjab</option>
                        <option value="RJ">Rajasthan</option>
                        <option value="SK">Sikkim</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="TG">Telangana</option>
                        <option value="TR">Tripura</option>
                        <option value="UP">Uttar Pradesh</option>
                        <option value="UT">Uttarakhand</option>
                        <option value="WB">West Bengal</option>
                      </optgroup>
                      <optgroup label="Union Territories">
                        <option value="AN">Andaman and Nicobar Islands</option>
                        <option value="CH">Chandigarh</option>
                        <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="DL">Delhi</option>
                        <option value="JK">Jammu and Kashmir</option>
                        <option value="LA">Ladakh</option>
                        <option value="LD">Lakshadweep</option>
                        <option value="PY">Puducherry</option>
                      </optgroup>
                    </select>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-bold text-lg text-stone-800 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                    <input type="radio" name="payment" className="w-4 h-4 text-amber-600" defaultChecked />
                    <div>
                      <p className="font-medium text-stone-800">Cash on Delivery</p>
                      <p className="text-sm text-stone-600">Pay when you receive the product</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors opacity-50">
                    <input type="radio" name="payment" className="w-4 h-4 text-amber-600" disabled />
                    <div>
                      <p className="font-medium text-stone-800">Online Payment</p>
                      <p className="text-sm text-stone-600">UPI, Cards, Net Banking (Coming Soon)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-stone-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg text-stone-800 mb-4">Order Summary</h3>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 pb-4 border-b border-stone-200 last:border-0">
                      <img 
                        src={item.images?.[0] || item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-stone-600 text-xs">Qty: {item.quantity}</p>
                        <p className="font-bold text-amber-600 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>GST (5%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-stone-300 my-3"></div>
                  <div className="flex justify-between font-bold text-xl text-stone-800">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {placingOrder ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - ₹${total.toLocaleString()}`
                  )}
                </button>
                
                <p className="text-xs text-stone-500 text-center mt-3">
                  By placing this order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
