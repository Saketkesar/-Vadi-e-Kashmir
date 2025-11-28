// src/App-Integrated.jsx - Complete Appwrite-powered version
import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Menu, X, Search, Star, ChevronRight, MapPin, Instagram, Facebook, Twitter,
  CheckCircle, ShieldCheck, Truck, Package, FileText, Lock, AlertCircle, Phone, Mail
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Import Appwrite services
import authService from './services/authService';
import productService from './services/productService';
import categoryService from './services/categoryService';
import blogService from './services/blogService';
import orderService from './services/orderService';

// Import Components
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import ProductDetail from './components/ProductDetail';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ShippingPolicy from './components/ShippingPolicy';
import ReturnPolicy from './components/ReturnPolicy';
import CheckoutModal from './components/CheckoutModal';

/* --------------------------
   Small UI Components
   -------------------------- */
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const base = "px-6 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border border-amber-700 text-amber-700 hover:bg-amber-50",
    ghost: "text-stone-600 hover:text-amber-700 hover:bg-stone-100"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">{title}</h2>
    <div className="w-20 h-1 bg-amber-600 mx-auto mb-4"></div>
    {subtitle && <p className="text-stone-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

/* --------------------------
   Auth Page with Phone OTP & Admin Email Login
   -------------------------- */
const AuthPage = ({ onSuccess = () => {} }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateIndianPhone = (phoneNumber) => {
    // Remove spaces, dashes, and other non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid 10-digit Indian number
    if (cleaned.length === 10 && cleaned.match(/^[6-9]\d{9}$/)) {
      return `+91${cleaned}`;
    }
    // Check if it already has +91 prefix
    if (cleaned.length === 12 && cleaned.startsWith('91') && cleaned.substring(2).match(/^[6-9]\d{9}$/)) {
      return `+${cleaned}`;
    }
    return null;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    // Validate Indian phone number
    const formattedPhone = validateIndianPhone(phone);
    
    if (!formattedPhone) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)');
      return;
    }
    
    setBusy(true);
    try {
      const result = await authService.sendOTP(formattedPhone);
      if (result.success) {
        setUserId(result.userId);
        setStep('otp');
        setSuccess('OTP sent successfully! Check your phone.');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setBusy(true);
    try {
      const result = await authService.verifyOTP(userId, otp);
      if (result.success) {
        setSuccess('Login successful!');
        setTimeout(() => onSuccess(result.user), 500);
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setBusy(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => window.location.hash = '#home'}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Kashmir Image */}
        <div 
          className="relative h-32 bg-cover bg-center rounded-t-2xl"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 to-amber-900/80 rounded-t-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-serif text-white">V</span>
              </div>
              <h1 className="text-xl font-serif text-white">Vadi-e-Kashmir</h1>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">Welcome Back</h2>
          <p className="text-center text-stone-600 text-sm mb-6">Sign in to continue shopping</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-sm flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              {/* Phone Form */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  Indian Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9797472200"
                    type="tel"
                    className="w-full pl-14 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-stone-500">We'll send you a verification code</p>
              </div>
              <button 
                type="submit" 
                disabled={busy}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Continue with OTP'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Enter Verification Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  type="text"
                  maxLength="6"
                  className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-center text-3xl tracking-[0.5em] font-bold transition-all"
                  required
                />
                <p className="mt-2 text-xs text-stone-500 text-center">Code sent to +91 {phone}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 font-medium transition-all"
                >
                  Change Number
                </button>
                <button 
                  type="submit" 
                  disabled={busy}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                >
                  {busy ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </span>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-500">
              Secure OTP authentication for your safety
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------
   Product Card
   -------------------------- */
const ProductCard = ({ product, onAdd }) => (
  <div className="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-200 flex flex-col h-full">
    <div 
      className="relative h-56 overflow-hidden cursor-pointer" 
      onClick={() => window.location.hash = `#product/${product.slug || product.$id}`}
    >
      <img 
        src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=1200'} 
        alt={product.name} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
      />
      {product.featured && (
        <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          Featured
        </div>
      )}
      {product.rating > 0 && (
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
          <Star size={12} fill="currentColor" className="text-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 
        className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer mb-2"
        onClick={() => window.location.hash = `#product/${product.slug || product.$id}`}
      >
        {product.name}
      </h3>
      <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-grow">
        {product.shortDescription || product.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-200">
        <div>
          <span className="text-xl font-bold text-amber-700">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-stone-400 line-through ml-2">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={() => onAdd(product)}
          className="p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110 active:scale-95"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  </div>
);

/* --------------------------
   Cart Drawer
   -------------------------- */
const CartDrawer = ({ isOpen, onClose, cart, onRemove, onUpdateQty, onCheckout }) => {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <h2 className="text-xl font-serif font-bold text-stone-800">Your Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4">
                <ShoppingBag size={64} opacity={0.2} />
                <p>Your cart is empty.</p>
                <button onClick={onClose} className="text-amber-700 font-medium hover:underline">
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id || item.$id} className="flex gap-4">
                  <img
                    src={item.images?.[0] || item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e7e5e4" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23a8a29e" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-100"
                    onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e7e5e4" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23a8a29e" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E' }}
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-stone-800 line-clamp-1">{item.name}</h4>
                    <p className="text-amber-700 font-bold text-sm">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-md">
                        <button
                          onClick={() => onUpdateQty(item.id || item.$id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-stone-100 text-stone-600"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id || item.$id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-100 text-stone-600"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id || item.$id)}
                        className="text-red-400 hover:text-red-600 text-xs underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between mb-4 text-lg font-bold text-stone-800">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-stone-500 mb-4 text-center">
                Shipping & taxes calculated at checkout
              </p>
              <Button onClick={onCheckout} className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* --------------------------
   Track Order Page Component
   -------------------------- */
const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Please enter your order number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const result = await orderService.trackOrderByNumber(orderNumber.trim());
      
      if (result.success) {
        setOrder(result.order);
        toast.success('Order found!');
      } else {
        setError(result.error || 'Order not found');
        toast.error(result.error || 'Order not found');
      }
    } catch (err) {
      // Check if it's an authentication error
      if (err.message?.includes('authorized') || err.code === 401) {
        setError('Please login to track your order');
        toast.error('Please login to track your order');
      } else {
        setError('Failed to track order. Please try again.');
        toast.error('Failed to track order');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-300';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const getStatusSteps = (currentStatus) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    return statuses.map((status, index) => ({
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      completed: index <= currentIndex,
      active: status === currentStatus
    }));
  };

  return (
    <section className="py-12 container mx-auto px-4 max-w-4xl min-h-screen">
      <SectionTitle title="Track Your Order" subtitle="Enter your Order ID to check the status" />
      
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div>
            <label className="block text-stone-700 font-medium mb-2">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., VK176418352177...)"
              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              disabled={loading}
            />
            <p className="text-sm text-stone-500 mt-2">
              You can find your order number in the confirmation email
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Tracking...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Track Order
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-stone-800">Order #{order.orderNumber}</h3>
                <p className="text-stone-600">Placed on {new Date(order.$createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold border-2 ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </div>
            </div>

            {/* Progress Tracker */}
            {order.status !== 'cancelled' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  {getStatusSteps(order.status).map((step, index) => (
                    <div key={step.status} className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.completed 
                            ? 'bg-amber-600 border-amber-600 text-white' 
                            : 'bg-white border-stone-300 text-stone-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-stone-300"></div>
                          )}
                        </div>
                        <p className={`text-xs mt-2 font-medium ${step.completed ? 'text-stone-800' : 'text-stone-400'}`}>
                          {step.label}
                        </p>
                      </div>
                      {index < getStatusSteps(order.status).length - 1 && (
                        <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          step.completed ? 'bg-amber-600' : 'bg-stone-300'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-stone-600">Tracking Number</p>
                <p className="font-bold text-stone-800 text-lg">{order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Customer Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-stone-500">Name</p>
                  <p className="font-medium text-stone-800">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Email</p>
                  <p className="font-medium text-stone-800">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Phone</p>
                  <p className="font-medium text-stone-800">{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Shipping Address
              </h4>
              <div className="space-y-1 text-stone-800">
                <p>{order.address1}</p>
                {order.address2 && <p>{order.address2}</p>}
                <p>{order.city}, {order.state} - {order.pincode}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-bold text-lg mb-4">Order Items</h4>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                  <img 
                    src={item.image || 'https://via.placeholder.com/80'} 
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-stone-800">{item.productName}</h5>
                    <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-stone-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-stone-200 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span>₹{order.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-amber-600">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default function App() {
  // State
  const [view, setView] = useState('home'); // 'home', 'shop', 'track', 'about', 'login', etc.
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // Map category name to ID
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Load user session and data on mount
  useEffect(() => {
    checkSession();
    loadProducts();
    loadCategories();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('vk_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vk_cart', JSON.stringify(cart));
  }, [cart]);

  // Check if user is logged in
  const checkSession = async () => {
    const result = await authService.getCurrentUser();
    if (result.success) {
      setUser(result.user);
      
      // If admin user and on home page, redirect to admin dashboard
      if (result.user.email === 'admin@vadikashmir.com' && window.location.hash === '') {
        window.location.hash = '#admin';
      }
    }
    setLoading(false);
  };

  // Load products from Appwrite
  const loadProducts = async () => {
    const result = await productService.getProducts({ active: true, limit: 100 });
    if (result.success) {
      setProducts(result.products);
    }
  };

  // Load categories from Appwrite
  const loadCategories = async () => {
    const result = await categoryService.getCategories();
    if (result.success) {
      setCategories(['All', ...result.categories.map(c => c.name)]);
      // Store full category objects for filtering
      setCategoryMap(result.categories.reduce((acc, cat) => {
        acc[cat.name] = cat.$id;
        return acc;
      }, {}));
    } else {
      setCategories(['All', 'Textiles', 'Spices', 'Food', 'Dry Fruits', 'Dairy Products', 'Art', 'Beverages']);
    }
  };

  // Handle login success
  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    
    // Check if user is admin by email
    if (userData.email === 'admin@vadikashmir.com') {
      // Redirect to admin dashboard
      window.location.hash = '#admin';
      setView('admin');
    } else {
      // Check in database for isAdmin flag
      try {
        const userProfile = await authService.getUserProfile(userData.$id);
        if (userProfile.success && userProfile.user?.isAdmin) {
          window.location.hash = '#admin';
          setView('admin');
        } else {
          setView('home');
        }
      } catch (error) {
        setView('home');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCart([]);
    localStorage.removeItem('vk_cart');
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => (item.id || item.$id) === (product.id || product.$id));
      const qtyToAdd = product.quantity || 1;
      
      if (existing) {
        return prev.map(item =>
          (item.id || item.$id) === (product.id || product.$id)
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item.id || item.$id) !== productId));
  };

  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(prev =>
      prev.map(item =>
        (item.id || item.$id) === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to proceed with checkout');
      setIsCartOpen(false);
      window.location.hash = '#login';
      return;
    }
    
    setIsCartOpen(false); // Close cart sidebar
    setShowCheckoutModal(true); // Open checkout modal
  };

  // Filter products
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => {
        // Match by categoryId using the categoryMap
        const categoryId = categoryMap[activeCategory];
        return p.categoryId === categoryId;
      });

  // Filter products by search query
  const searchFilteredProducts = searchQuery.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  const handleSearchSelect = (product) => {
    window.location.hash = `#product/${product.slug || product.$id}`;
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      
      // Handle different routes
      if (hash.startsWith('product/')) {
        setView('product');
      } else if (hash.startsWith('blog/')) {
        setView('blog');
      } else if (hash === 'blogs') {
        setView('blogs');
      } else if (hash === 'admin-login') {
        setView('admin-login');
      } else {
        setView(hash);
      }
    };
    
    // Initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newView) => {
    window.location.hash = newView;
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading Vadi-e-Kashmir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Login Popup Modal */}
      {(view === 'login' || view === 'signup') && (
        <AuthPage onSuccess={handleLoginSuccess} />
      )}
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-amber-700 text-white rounded-lg flex items-center justify-center font-bold text-lg">
              V
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-stone-800">Vadi-e-Kashmir</h1>
              <p className="text-xs text-stone-500 hidden md:block">KASHMIR TREASURES</p>
            </div>
          </button>

          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigateTo('home')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'home' ? 'text-amber-700' : ''}`}>
              Home
            </button>
            <button onClick={() => navigateTo('shop')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'shop' ? 'text-amber-700' : ''}`}>
              Shop
            </button>
            <button onClick={() => window.location.hash = '#blogs'} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${window.location.hash.includes('blog') ? 'text-amber-700' : ''}`}>
              Blog
            </button>
            <button onClick={() => navigateTo('track')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'track' ? 'text-amber-700' : ''}`}>
              Track Order
            </button>
            <button onClick={() => navigateTo('about')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'about' ? 'text-amber-700' : ''}`}>
              About
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block relative search-container">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-64 pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchFilteredProducts.length > 0 && (
                <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border border-stone-200 max-h-96 overflow-y-auto z-50">
                  {searchFilteredProducts.slice(0, 8).map(product => (
                    <div
                      key={product.$id}
                      onClick={() => handleSearchSelect(product)}
                      className="flex items-center gap-3 p-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0"
                    >
                      <img 
                        src={product.images?.[0] || product.image || 'https://via.placeholder.com/60'} 
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-800 text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{product.categoryName || 'Product'}</p>
                        <p className="text-sm font-bold text-amber-600 mt-1">₹{product.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {searchFilteredProducts.length > 8 && (
                    <div className="p-3 text-center text-sm text-stone-500 bg-stone-50">
                      +{searchFilteredProducts.length - 8} more results
                    </div>
                  )}
                </div>
              )}

              {/* No Results Message */}
              {showSearchResults && searchQuery && searchFilteredProducts.length === 0 && (
                <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border border-stone-200 p-4 z-50">
                  <p className="text-stone-500 text-sm text-center">No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-stone-100 rounded-full transition-colors">
              <ShoppingBag size={20} className="text-stone-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                  <span className="hidden md:inline">{user.name || user.email || user.phone || 'Account'}</span>
                  <ChevronRight size={16} className="rotate-90" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user.email === 'admin@vadikashmir.com' && (
                    <button onClick={() => navigateTo('admin')} className="w-full text-left px-4 py-2 hover:bg-stone-50 text-amber-700 font-medium border-b">
                      Admin Dashboard
                    </button>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-stone-50 text-red-600">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => navigateTo('login')} className="hidden md:flex px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                Login
              </button>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 py-4">
            <nav className="flex flex-col gap-4 px-4">
              <button onClick={() => navigateTo('home')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Home
              </button>
              <button onClick={() => navigateTo('shop')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Shop
              </button>
              <button onClick={() => window.location.hash = '#blogs'} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Blog
              </button>
              <button onClick={() => navigateTo('track')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Track Order
              </button>
              <button onClick={() => navigateTo('about')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Our Story
              </button>
              {!user && (
                <button onClick={() => navigateTo('login')} className="text-left text-amber-700 font-bold">
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* HOME PAGE */}
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://img.freepik.com/premium-photo/shangrila-resort-skardu_1000854-3.jpg?semt=ais_hybrid&w=740&q=80')",
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  Vadi-e-Kashmir
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                  Authentic Kashmir Products - Saffron, Dry Fruits, and Handcrafted Treasures
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigateTo('shop')} variant="primary">
                    Shop Now
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 container mx-auto px-4 md:px-6">
              <SectionTitle title="Featured Products" subtitle="Handpicked treasures from master artisans" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.$id}
                    product={product}
                    onAdd={(p) => {
                      addToCart(p);
                      setIsCartOpen(true);
                    }}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button onClick={() => navigateTo('shop')} variant="outline">
                  View All Products
                </Button>
              </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck size={32} className="text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">100% Authentic</h3>
                    <p className="text-stone-600">
                      GI-tagged and certified products directly from verified artisans
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck size={32} className="text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Fast Shipping</h3>
                    <p className="text-stone-600">Secure packaging and reliable delivery across India</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Fair Trade</h3>
                    <p className="text-stone-600">Supporting artisan communities and sustainable practices</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* SHOP PAGE */}
        {view === 'shop' && (
          <section className="py-12 container mx-auto px-4 md:px-6 min-h-screen">
            <div className="mb-10">
              <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">Shop Collections</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-amber-700 text-white shadow-lg'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-stone-500 text-sm">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-500 text-lg">No products found in this category.</p>
                <Button onClick={() => setActiveCategory('All')} variant="outline" className="mt-4">
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.$id}
                    product={product}
                    onAdd={(p) => {
                      addToCart(p);
                      setIsCartOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TRACK ORDER PAGE */}
        {view === 'track' && <TrackOrderPage />}

        {/* ABOUT PAGE */}
        {view === 'about' && (
          <section className="py-20 bg-stone-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
              <SectionTitle title="Our Story" subtitle="Bringing authentic Kashmiri craftsmanship to the world" />
              
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-4">The Promise of Authenticity</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Vadi-e-Kashmir was born from a deep reverence for the artisans of Kashmir and their centuries-old traditions. 
                  Every product on our platform is carefully verified, GI-tagged when applicable, and sourced directly from 
                  trusted artisans and cooperatives in Srinagar and surrounding regions.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  We're committed to fair trade practices, ensuring that the creators of these beautiful products receive 
                  the recognition and compensation they deserve.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-amber-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-stone-800 mb-3">Our Mission</h4>
                  <p className="text-stone-600">
                    To preserve and promote the authentic craftsmanship of Kashmir while supporting the livelihoods 
                    of artisan families through fair and transparent business practices.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-stone-800 mb-3">Our Values</h4>
                  <ul className="text-stone-600 space-y-2">
                    <li>✓ 100% Authentic Products</li>
                    <li>✓ Fair Trade Practices</li>
                    <li>✓ Sustainable Sourcing</li>
                    <li>✓ Artisan Empowerment</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BLOGS PAGE */}
        {view === 'blogs' && <BlogList />}

        {/* BLOG DETAIL PAGE */}
        {view === 'blog' && <BlogDetail />}

        {/* PRODUCT DETAIL PAGE */}
        {view === 'product' && <ProductDetail onAddToCart={addToCart} />}

        {/* ADMIN LOGIN PAGE */}
        {view === 'admin-login' && <AdminLogin onLoginSuccess={handleLoginSuccess} />}

        {/* ADMIN DASHBOARD */}
        {view === 'admin' && user && user.email === 'admin@vadikashmir.com' && <AdminDashboard user={user} />}

        {/* TEST EMAIL PAGE */}
        {view === 'test-email' && (
          <section className="py-12 container mx-auto px-4 max-w-2xl min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-stone-800 mb-4">📧 Email Feature</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-3xl font-bold text-stone-700 mb-2">Coming Soon!</h3>
                <p className="text-stone-600 mb-6">
                  We're working on bringing you email notifications for orders.
                </p>
                <button
                  onClick={() => window.location.hash = '#'}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </section>
        )}

        {/* LEGAL PAGES */}
        {view === 'privacy-policy' && <PrivacyPolicy />}
        {view === 'terms-of-service' && <TermsOfService />}
        {view === 'shipping-policy' && <ShippingPolicy />}
        {view === 'return-policy' && <ReturnPolicy />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Vadi-e-Kashmir</h2>
            <p className="text-sm mb-6">
              Bringing the rarest treasures of the Himalayas to the world. Authentic, ethical, premium.
            </p>
            <div className="flex gap-4">
              <button className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <Instagram size={16} />
              </button>
              <button className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <Facebook size={16} />
              </button>
              <button className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                <Twitter size={16} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('home')}>
                Home
              </li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('shop')}>
                Shop All
              </li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('about')}>
                Our Story
              </li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('track')}>
                Track Order
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('privacy-policy')}>Privacy Policy</li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('terms-of-service')}>Terms of Service</li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('shipping-policy')}>Shipping Policy</li>
              <li className="hover:text-amber-500 cursor-pointer" onClick={() => navigateTo('return-policy')}>Return Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-600 mt-1 flex-shrink-0" />
                <span>
                  Main Bazaar, Residency Road,
                  <br />
                  Srinagar, J&K 190001
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-amber-600 mt-1 flex-shrink-0" />
                <span>+91 79797472200</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-amber-600 mt-1 flex-shrink-0" />
                <span>hello@vadiekashmir.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-stone-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Vadi-e-Kashmir. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal 
          cart={cart}
          user={user}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setCart([]);
            localStorage.removeItem('vk_cart');
          }}
        />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1c1917',
            border: '1px solid #e7e5e4',
            borderRadius: '0.5rem',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#d97706',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
