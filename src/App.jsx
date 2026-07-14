// src/App-Integrated.jsx - Complete Appwrite-powered version
import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Menu, X, Search, Star, ChevronRight, MapPin, Instagram, Facebook, Twitter,
  CheckCircle, ShieldCheck, Truck, Package, FileText, Lock, AlertCircle, Phone, Mail
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { ArrowLeft } from "react-feather";


// Import Clerk services
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import settingsService from './services/settingsService';

// Import Appwrite services
import authService from './services/authService';
import productService from './services/productService';
import categoryService from './services/categoryService';
import blogService from './services/blogService';
import orderService from './services/orderService';
import emailService from './services/emailService';

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
import ThankYou from './components/ThankYou';
import MyOrders from './components/MyOrders';

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

/* --------------------------
   404 Page Not Found Component
   -------------------------- */
const NotFoundPage = ({ navigateTo }) => {
  return (
    <div className="min-h-[70vh] bg-[#faf6eb] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-8">
        <img 
          src="/404_clean.png" 
          alt="404 Page Not Found" 
          className="w-72 md:w-80 h-auto mx-auto drop-shadow-lg" 
        />
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold italic text-amber-850 text-amber-850">
            Lost in the Valley
          </h2>
          <p className="text-stone-650 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            The page you are looking for has vanished like the morning mountain mist. Let us guide you back.
          </p>
        </div>
        <div>
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3 bg-amber-750 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Clerk authentication hooks
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  // Carousel States
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
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
  const [lastOrderData, setLastOrderData] = useState(null);
  const [bulletin, setBulletin] = useState('');

  // Load user session and data on mount
  useEffect(() => {
    const initApp = async () => {
      const result = await authService.ensureSession();
      if (result.success && result.user && result.user.email === 'admin@vadikashmir.com') {
        const mappedAdmin = {
          $id: result.user.$id,
          id: result.user.$id,
          email: result.user.email,
          name: result.user.name || 'Admin',
          phone: result.user.phone || '',
          isAdmin: true
        };
        setUser(mappedAdmin);
      }
      loadProducts();
      loadCategories();
      loadCarouselSlides();
      loadBulletin();
    };
    initApp();

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

  const loadCarouselSlides = async () => {
    try {
      const result = await settingsService.getCarouselImages();
      if (result.success && result.carouselImages && result.carouselImages.length > 0) {
        setCarouselSlides(result.carouselImages);
      } else {
        // Fallback default slides
        setCarouselSlides([
          {
            url: 'https://img.freepik.com/premium-photo/shangrila-resort-skardu_1000854-3.jpg?semt=ais_hybrid&w=740&q=80',
            title: 'Vadiekashmir',
            subtitle: 'Authentic Kashmir Products - Saffron, Dry Fruits, and Handcrafted Treasures',
            link: '#shop'
          },
          {
            url: 'https://images.unsplash.com/photo-1598305372104-f2906a294976?auto=format&fit=crop&w=1200&q=80',
            title: 'Artisan Pashminas',
            subtitle: 'Exquisite Pure Pashmina & Cashmere Handwoven in Kashmir',
            link: '#shop'
          },
          {
            url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
            title: 'Pure Pampore Saffron',
            subtitle: 'Hand-picked Grade A Saffron direct from the valley',
            link: '#shop'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load slides:', err);
    }
  };

  const loadBulletin = async () => {
    try {
      const bResult = await settingsService.getBulletinText();
      if (bResult.success) {
        setBulletin(bResult.bulletinText);
      }
    } catch (err) {
      console.error('Failed to load bulletin:', err);
    }
  };

  // Autoplay carousel slides
  useEffect(() => {
    if (carouselSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vk_cart', JSON.stringify(cart));
  }, [cart]);

  // Synchronize Clerk user session and Appwrite database
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      const mappedUser = {
        $id: clerkUser.id,
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
        isAdmin: clerkUser.primaryEmailAddress?.emailAddress === 'admin@vadikashmir.com'
      };

      const syncUser = async () => {
        try {
          // Sync profile to Appwrite for billing/records
          const result = await authService.createOrUpdateUser(mappedUser);
          
          if (result.success && result.isNew) {
            emailService.sendWelcomeEmail(mappedUser).catch(err => {
              console.error('Welcome email failed:', err);
            });
          }
          
          // Get the latest profile from Appwrite (contains isAdmin flag)
          const profileResult = await authService.getUserProfile(clerkUser.id);
          if (profileResult.success && profileResult.user) {
            mappedUser.isAdmin = !!profileResult.user.isAdmin;
          }
        } catch (e) {
          console.error("Failed to sync user with Appwrite", e);
        }
        
        setUser(mappedUser);
        
        // If admin redirect to admin dashboard
        if (mappedUser.isAdmin && window.location.hash === '') {
          window.location.hash = '#admin';
        }
      };

      syncUser();
    } else {
      setUser(prev => {
        if (prev && prev.isAdmin) {
          return prev;
        }
        return null;
      });
    }
    
    setLoading(false);
  }, [isLoaded, isSignedIn, clerkUser]);

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
      } else if (hash === 'login') {
        openSignIn();
        window.location.hash = 'home';
        setView('home');
      } else if (hash === 'signup') {
        openSignUp();
        window.location.hash = 'home';
        setView('home');
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
          <p className="text-stone-600">Loading Vadiekashmir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Bulletin news alert banner */}
      {bulletin && (
        <div className="bg-amber-700 text-white py-2 px-4 text-xs font-semibold overflow-hidden relative select-none z-40 border-b border-white/10 shadow-sm">
          <div className="flex items-center justify-center">
            <span className="inline-block animate-marquee uppercase tracking-wider whitespace-nowrap">
              📢 &nbsp; {bulletin} &nbsp; • &nbsp; {bulletin} &nbsp; • &nbsp; {bulletin}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigateTo('home')} className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <img src="/vadielogo.png" alt="Vadiekashmir Logo" className="h-10 md:h-12 w-auto object-contain" />
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
            {user && (
              <button onClick={() => navigateTo('my-orders')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'my-orders' ? 'text-amber-700' : ''}`}>
                My Orders
              </button>
            )}
            <button onClick={() => navigateTo('about')} className={`text-stone-700 hover:text-amber-700 font-medium transition-colors ${view === 'about' ? 'text-amber-700' : ''}`}>
              About
            </button>
          </nav>

          <div className="flex items-center gap-4">
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
                        <p className="text-sm font-bold mt-1 text-stone-800">₹{product.price?.toLocaleString()}</p>
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

            {isSignedIn ? (
              <div className="flex items-center gap-4">
                {user?.isAdmin && (
                  <button onClick={() => navigateTo('admin')} className="px-4 py-2 border border-amber-700 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors">
                    Admin Dashboard
                  </button>
                )}
                <UserButton />
              </div>
            ) : (
              <button onClick={openSignIn} className="hidden md:flex px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium text-sm">
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
            {/* Mobile Search Bar */}
            <div className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
              {/* Mobile Search Results */}
              {showSearchResults && searchQuery && (
                <div className="absolute left-4 right-4 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {products.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 5).map(product => (
                    <div
                      key={product.$id}
                      onClick={() => {
                        window.location.hash = `#product-${product.$id}`;
                        setSearchQuery('');
                        setShowSearchResults(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-stone-50 cursor-pointer border-b last:border-0"
                    >
                      <img 
                        src={product.images?.[0] || '/placeholder.jpg'} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{product.name}</p>
                        <p className="text-amber-600 text-sm">₹{product.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="p-3 text-stone-500 text-sm">No products found</p>
                  )}
                </div>
              )}
            </div>
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
              {user && (
                <button onClick={() => navigateTo('my-orders')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                  My Orders
                </button>
              )}
              <button onClick={() => navigateTo('about')} className="text-left text-stone-700 hover:text-amber-700 font-medium">
                Our Story
              </button>
              

              
              {/* Login/Logout */}
              {isSignedIn ? (
                <div className="flex items-center justify-between gap-4 mt-2">
                  <UserButton />
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-left text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => { openSignIn(); setIsMobileMenuOpen(false); }} className="text-left text-amber-700 font-bold">
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
            {/* Hero Carousel Section */}
            <section className="relative h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden bg-stone-900 shadow-inner">
              {carouselSlides.length > 0 ? (
                <>
                  {carouselSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
                        style={{
                          backgroundImage: `url('${slide.url}')`,
                          transform: index === activeSlide ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/45"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-6 max-w-4xl mx-auto space-y-6">
                          {slide.title && (
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
                              {slide.subtitle}
                            </p>
                          )}
                          <div className="flex gap-4 justify-center pt-2">
                            <Button
                              onClick={() => {
                                if (slide.link) {
                                  if (slide.link.startsWith('#')) {
                                    const page = slide.link.substring(1);
                                    window.location.hash = slide.link;
                                    if (['home', 'shop', 'blogs', 'track', 'about', 'my-orders'].includes(page)) {
                                      navigateTo(page);
                                    }
                                  } else {
                                    window.location.href = slide.link;
                                  }
                                } else {
                                  navigateTo('shop');
                                }
                              }}
                              variant="primary"
                              className="px-8 py-3 text-base shadow-lg"
                            >
                              Shop Now
                              <ChevronRight size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setActiveSlide(prev => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 text-white/90 hover:bg-black/60 hover:text-white transition-all z-20"
                  >
                    <ChevronRight size={22} className="rotate-180" />
                  </button>
                  <button
                    onClick={() => setActiveSlide(prev => (prev === carouselSlides.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 text-white/90 hover:bg-black/60 hover:text-white transition-all z-20"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === activeSlide ? 'bg-amber-600 scale-125 w-6' : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-white text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  <p className="text-sm">Loading slides...</p>
                </div>
              )}
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

       {/* --- OPTIONAL: add this small SectionTitle above the block if your app does not already provide one --- */}
{/*
const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <p className="text-sm uppercase text-amber-700 font-semibold tracking-wider">{subtitle}</p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mt-2">{title}</h2>
        {/* ABOUT PAGE */}
        {view === 'about' && (
          <section className="py-16 md:py-24 bg-[#f6ede0] min-h-screen text-stone-850">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
              {/* Back Link */}
              <div className="mb-10 flex items-center justify-between gap-4">
                <button
                  onClick={() => (window.location.hash = '#home')}
                  className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Back to Home</span>
                </button>
                <div className="hidden md:flex items-center gap-2 text-stone-500 text-xs tracking-wider uppercase">
                  <span>Trusted by artisans</span>
                  <span>•</span>
                  <span>Direct Trade</span>
                  <span>•</span>
                  <span>Authentic</span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Image Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="aspect-[4/3] md:aspect-auto rounded-3xl overflow-hidden shadow-xl bg-[#ede2d4] flex items-center justify-center p-4 border border-[#e8dac7]">
                    <img
                      src="/about_clean.png"
                      alt="Artisan of Kashmir Valley"
                      className="w-full h-auto max-h-[480px] object-contain rounded-2xl"
                    />
                  </div>
                  {/* Students / Creators Badge */}
                  <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/40 shadow-sm">
                    <p className="text-stone-700 text-sm leading-relaxed">
                      <strong>Our Roots:</strong> Vadiekashmir was born in the valleys of Jammu & Kashmir, created by <strong>two college students</strong> who grew up witnessing the sheer dedication of local weavers. Our platform exists to make sure their craft is celebrated and fairly compensated.
                    </p>
                  </div>
                </div>

                {/* Text Content Column */}
                <div className="lg:col-span-6 space-y-6">
                  <p className="text-amber-800 text-sm uppercase font-bold tracking-widest">Our Story & Soul</p>
                  <h2 className="text-3xl md:text-5xl font-serif font-extrabold italic text-stone-900 tracking-wide leading-tight">
                    A Bridge of Hope & Heritage
                  </h2>
                  <p className="text-stone-700 text-base md:text-lg leading-relaxed font-light">
                    Deep within the snow-covered valleys of Kashmir, a timeless song is written by hand. Every pure Pashmina thread carries the quiet dedication of a weaver’s winter nights. Every jar of golden saffron holds the fields harvested under the early morning Pampore sun. Here, craft is not just a trade; it is a heart-to-heart legacy passed down through generations.
                  </p>
                  <p className="text-stone-700 text-base leading-relaxed">
                    Yet, the families behind these treasures—the farmers who cultivate the soil, the mothers who spin the wool, the fathers who carve the wood—are often separated from those who would cherish their work.
                  </p>
                  <p className="text-stone-700 text-base leading-relaxed font-semibold">
                    That is where Vadi Kashmir steps in. We do not make these masterpieces ourselves. We are simply a bridge—a humble platform built to connect you directly with the crafters, the farmers, and the makers of the valley.
                  </p>
                  <p className="text-stone-750 text-base leading-relaxed">
                    While we act as a guide and a middleman, our mission is pure: to keep the light of local cottage businesses burning bright. By bringing their stories and creations straight to your doorstep, we make sure that honest value flows directly back to the weavers' hearths and the farmers' homes. Every purchase you make becomes a hand held, a family supported, and a heritage preserved.
                  </p>
                  
                  {/* prepaid payment logistics note */}
                  <div className="p-4 bg-white/40 border border-amber-900/10 rounded-xl space-y-2">
                    <p className="text-xs text-stone-600 font-medium">
                      <span className="text-amber-850 font-bold uppercase tracking-wider">Note:</span> As a young student startup, we currently only support prepaid orders to cover logistic costs directly back to our creators. We are working hard to support Cash on Delivery soon as we scale.
                    </p>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold shadow-lg transition-all"
                    >
                      Shop Collections
                    </button>
                    <button
                      onClick={() => navigateTo('home')}
                      className="px-8 py-3 border border-stone-400 hover:bg-white/40 hover:text-stone-900 rounded-xl font-semibold transition-all"
                    >
                      Explore Home
                    </button>
                  </div>
                </div>
              </div>

              {/* Small copyright at bottom */}
              <div className="mt-16 text-center text-xs text-stone-500 tracking-wider">
                © {new Date().getFullYear()} VadieKashmir — SUPPORTING ARTISANS DIRECTLY.
              </div>
            </div>
          </section>
        )}

        {/* BLOGS PAGE */}
        {view === 'blogs' && <BlogList />}

        {/* BLOG DETAIL PAGE */}
        {view === 'blog' && <BlogDetail />}

        {/* PRODUCT DETAIL PAGE */}
        {view === 'product' && <ProductDetail onAddToCart={addToCart} onBuyNow={(prod) => { addToCart(prod); setIsCartOpen(true); }} />}

        {/* ADMIN LOGIN PAGE */}
        {view === 'admin-login' && <AdminLogin onLoginSuccess={handleLoginSuccess} />}

        {/* ADMIN DASHBOARD */}
        {view === 'admin' && user && user.email === 'admin@vadikashmir.com' && <AdminDashboard user={user} onLogout={handleLogout} />}

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

        {/* ORDER PAGES */}
        {view === 'thank-you' && <ThankYou orderData={lastOrderData} />}
        {view === 'my-orders' && <MyOrders user={user} />}

        {/* FALLBACK 404 PAGE */}
        {!['home', 'shop', 'track', 'about', 'blogs', 'blog', 'product', 'admin-login', 'admin', 'privacy-policy', 'terms-of-service', 'shipping-policy', 'return-policy', 'thank-you', 'my-orders'].includes(view) && (
          <NotFoundPage navigateTo={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Vadiekashmir</h2>
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
  <Phone size={18} className="text-amber-500 mt-1 flex-shrink-0" />
  <div className="flex flex-col gap-1">
    <a href="tel:+9179797472200" className="text-white font-medium hover:underline">
      +91 79797 47220
    </a>
    <a href="tel:+917006425508" className="text-white font-medium hover:underline">
      +91 70064 25508
    </a>
  </div>
</li>



              <li className="flex items-start gap-3">
                <Mail size={18} className="text-amber-600 mt-1 flex-shrink-0" />
                <span>hello@vadiekashmir.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-stone-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} VadieKashmir — SUPPORTING ARTISANS DIRECTLY.</p>
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
          onOrderComplete={(orderData) => {
            setLastOrderData(orderData);
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
