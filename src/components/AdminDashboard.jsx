// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, FileText, Users, TrendingUp, Plus, Edit, Trash2, 
  Upload, X, CheckCircle, AlertCircle, Search, Filter, Eye, Mail, Phone, Calendar, Send,
  ChevronUp, ChevronDown, Image, Settings, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import orderService from '../services/orderService';
import blogService from '../services/blogService';
import emailService from '../services/emailService';
import settingsService from '../services/settingsService';
import { databases, DATABASE_ID, COLLECTION_IDS } from '../config/appwrite';

const AdminDashboard = ({ user, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [acceptingOrders, setAcceptingOrders] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Load order accepting status from database
  useEffect(() => {
    loadAcceptingOrdersStatus();
  }, []);

  const loadAcceptingOrdersStatus = async () => {
    const result = await settingsService.getAcceptingOrders();
    if (result.success) {
      setAcceptingOrders(result.acceptingOrders);
    }
  };

  // Save order accepting status to database
  const toggleOrderAccepting = async () => {
    const newStatus = !acceptingOrders;
    setAcceptingOrders(newStatus); // Optimistic update
    
    const result = await settingsService.setAcceptingOrders(newStatus);
    if (result.success) {
      toast.success(newStatus ? 'Orders are now ENABLED' : 'Orders are now DISABLED');
    } else {
      // Revert on failure
      setAcceptingOrders(!newStatus);
      toast.error('Failed to update order status');
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingTestEmail(true);
    try {
      const result = await emailService.sendOrderConfirmation({
        email: testEmailRecipient,
        orderNumber: 'TEST-' + Date.now(),
        customerName: 'Test Customer',
        items: [
          { productName: 'Test Product 1', quantity: 2, price: 500 },
          { productName: 'Test Product 2', quantity: 1, price: 1000 }
        ],
        subtotal: 2000,
        gst: 360,
        total: 2360,
        paymentMethod: 'cod',
        shippingAddress: {
          address1: '123 Test Street',
          city: 'Srinagar',
          state: 'Jammu & Kashmir',
          pincode: '190001'
        },
        phone: '+91 9797472200'
      });

      if (result.success) {
        toast.success('Test email sent successfully!');
        setShowTestEmailModal(false);
        setTestEmailRecipient('');
      } else {
        toast.error('Failed to send test email: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error('Failed to send test email');
    }
    setSendingTestEmail(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes, blogsRes, statsRes, usersRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories(),
        orderService.getAllOrders({ limit: 50 }),
        blogService.getBlogs({ published: false, limit: 100 }),
        orderService.getOrderStats(),
        databases.listDocuments(DATABASE_ID, COLLECTION_IDS.USERS)
      ]);

      if (productsRes.success) setProducts(productsRes.products);
      if (categoriesRes.success) setCategories(categoriesRes.categories);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (blogsRes.success) setBlogs(blogsRes.blogs);
      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.documents) setUsers(usersRes.documents);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'carousel', label: 'Carousel Banner', icon: Image },
    { id: 'settings', label: 'News Bulletin', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-stone-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
              <p className="text-stone-600 text-sm mt-1">Welcome back, {user?.name || user?.email || 'Admin'}!</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Order Accepting Toggle */}
              <div className="flex items-center gap-3 bg-stone-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Accept Orders:</span>
                <button
                  onClick={toggleOrderAccepting}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    acceptingOrders ? 'bg-green-500' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                      acceptingOrders ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`min-w-[32px] text-sm font-bold ${acceptingOrders ? 'text-green-600' : 'text-stone-500'}`}>
                  {acceptingOrders ? 'ON' : 'OFF'}
                </span>
              </div>

              <button
                onClick={() => setShowTestEmailModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Test Email
              </button>

              <button
                onClick={onLogout}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg flex items-center gap-2 text-sm transition-colors border border-stone-200 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-stone-200 px-6">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-stone-600 hover:text-amber-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                <p className="mt-4 text-stone-600">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <OverviewTab stats={stats} products={products} orders={orders} />}
                {activeTab === 'products' && (
                  <ProductsTab 
                    products={products} 
                    categories={categories}
                    onRefresh={loadAllData}
                  />
                )}
                {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={loadAllData} />}
                {activeTab === 'blogs' && <BlogsTab blogs={blogs} onRefresh={loadAllData} />}
                {activeTab === 'users' && <UsersTab users={users} />}
                {activeTab === 'carousel' && <CarouselTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-800">Send Test Email</h3>
              <button
                onClick={() => {
                  setShowTestEmailModal(false);
                  setTestEmailRecipient('');
                }}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-stone-600 text-sm mb-4">
              Send a test order confirmation email to verify your email setup is working correctly.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTestEmailModal(false);
                  setTestEmailRecipient('');
                }}
                className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestEmail}
                disabled={sendingTestEmail}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingTestEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ stats, products, orders }) => {
  const statCards = [
    { label: 'Total Orders', value: stats?.total || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Products', value: products?.length || 0, icon: Package, color: 'bg-amber-500' },
    { label: 'Pending Orders', value: stats?.pending || 0, icon: AlertCircle, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-stone-50 rounded-xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-stone-600 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-3 px-4 text-stone-600 font-medium">Order #</th>
                <th className="text-left py-3 px-4 text-stone-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-stone-600 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-stone-600 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders?.slice(0, 5).map((order, index) => (
                <tr key={index} className="border-b border-stone-100">
                  <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-stone-600">{new Date(order.$createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Products Tab
const ProductsTab = ({ products, categories, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        toast.success('Product deleted successfully!');
        onRefresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.$id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-stone-100 relative">
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-stone-300" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowForm(true);
                  }}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-amber-50 transition-colors"
                >
                  <Edit className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => handleDelete(product.$id)}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-stone-800 mb-1">{product.name}</h3>
              <p className="text-stone-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-amber-600">₹{product.price.toLocaleString()}</span>
                <span className="text-sm text-stone-500">Stock: {product.stock || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    categoryId: product?.categoryId || '',
    stock: product?.stock || 0,
    sku: product?.sku || '',
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || ''
  });
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product?.images || []);
  const [existingImages, setExistingImages] = useState(product?.images || []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limit to 5 images total
      const remainingSlots = 5 - imagePreviews.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      setImageFiles([...imageFiles, ...filesToAdd]);
      
      // Create previews
      filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    // Check if it's an existing image or new upload
    if (index < existingImages.length) {
      // Remove from existing images
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new uploads
      const newFileIndex = index - existingImages.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Start with existing images
    let imageUrls = [...existingImages];

    // Upload new images
    if (imageFiles.length > 0) {
      toast.loading(`Uploading ${imageFiles.length} image(s)...`);
      
      for (const file of imageFiles) {
        const uploadResult = await productService.uploadProductImage(file);
        if (uploadResult.success) {
          imageUrls.push(uploadResult.url);
          console.log('Image uploaded successfully:', uploadResult.url);
        } else {
          toast.error('Error uploading image: ' + uploadResult.error);
        }
      }
      
      toast.dismiss();
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      images: imageUrls
    };

    console.log('Submitting product data:', productData);

    let result;
    if (product) {
      result = await productService.updateProduct(product.$id, productData);
    } else {
      result = await productService.createProduct(productData);
    }

    setSaving(false);

    if (result.success) {
      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
      onSuccess();
    } else {
      toast.error('Error: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.$id} value={cat.$id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Product Images ({imagePreviews.length}/5)
            </label>
            <div className="space-y-3">
              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border-2 border-stone-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-xs px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* File Input */}
              {imagePreviews.length < 5 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              )}
              
              <p className="text-xs text-stone-500">
                {imagePreviews.length === 0 
                  ? 'Upload 1-5 product images. First image will be the main display image.' 
                  : imagePreviews.length < 5
                  ? `You can add ${5 - imagePreviews.length} more image(s). Hover to remove.`
                  : 'Maximum 5 images reached. Remove an image to add more.'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Meta Title (SEO)</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Email Send Modal
const EmailModal = ({ order, onClose, onSuccess }) => {
  const [template, setTemplate] = useState('confirmed');
  const [trackingLink, setTrackingLink] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    // Coming Soon - Email feature disabled
    toast.info('📧 Email feature coming soon! Stay tuned!');
    onClose();
    return;
    
    /* Disabled for now
    setSending(true);
    
    const result = await orderService.sendCustomEmail(
      order, 
      template, 
      template === 'shipped' ? trackingLink : null
    );
    
    setSending(false);
    
    if (result.success) {
      toast.success(result.message);
      onSuccess();
      onClose();
    } else {
      toast.error('Failed to send email: ' + result.error);
    }
    */
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-stone-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" />
            Send Email to Customer
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Email Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="confirmed">Order Confirmed</option>
              <option value="shipped">Order Shipped</option>
              <option value="cancelled">Order Cancelled</option>
            </select>
          </div>

          {template === 'shipped' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tracking Link (Optional)</label>
              <input
                type="url"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                placeholder="https://tracking.example.com/..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}

          <div className="bg-stone-50 rounded-lg p-4">
            <p className="text-sm text-stone-600 mb-2">
              <strong>Recipient:</strong> {order.customerName} ({order.email})
            </p>
            <p className="text-sm text-stone-600">
              <strong>Order:</strong> {order.orderNumber}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              disabled={sending}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ order, onClose, onRefresh }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);

  if (!order) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Order Details - {order.orderNumber}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.info('📧 Email feature coming soon! Stay tuned!')}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
                title="Coming Soon"
              >
                <Mail className="w-4 h-4" />
                Email (Coming Soon)
              </button>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-stone-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-500">Customer Name</label>
                <p className="font-medium text-stone-800">{order.customerName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Email</label>
                <p className="font-medium text-stone-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-400" />
                  {order.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Phone</label>
                <p className="font-medium text-stone-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400" />
                  {order.phone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs text-stone-500">User ID</label>
                <p className="font-medium text-stone-800 text-xs">{order.userId}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-stone-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              Shipping Address
            </h3>
            <div className="space-y-1">
              <p className="text-stone-800">{order.address1}</p>
              {order.address2 && <p className="text-stone-800">{order.address2}</p>}
              <p className="text-stone-800">{order.city}, {order.state} - {order.pincode}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-lg mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg">
                  <img 
                    src={item.image || 'https://via.placeholder.com/60'} 
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800">{item.productName}</h4>
                    <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-stone-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-stone-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span>₹{order.gst?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-amber-600">₹{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Order Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-stone-500">Status</label>
                <p className={`font-medium px-3 py-1 rounded-full text-sm inline-block ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-stone-100 text-stone-700'
                }`}>
                  {order.status}
                </p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Payment Method</label>
                <p className="font-medium text-stone-800">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Order Date</label>
                <p className="font-medium text-stone-800">{new Date(order.$createdAt).toLocaleString()}</p>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="mt-3">
                <label className="text-xs text-stone-500">Tracking Number</label>
                <p className="font-medium text-stone-800">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal 
          order={order} 
          onClose={() => setShowEmailModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

// Orders Tab
const OrdersTab = ({ orders, onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailOrder, setEmailOrder] = useState(null);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.$id === orderId);
    const result = await orderService.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success('Order status updated!');
      
      // Send status update email (don't block the flow)
      if (order && order.email) {
        emailService.sendStatusUpdate({
          email: order.email,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          status: newStatus
        }).catch(err => {
          console.error('Status email failed:', err);
        });
      }
      
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Order #</th>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Customer</th>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-stone-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.$id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                <td className="py-3 px-4">{order.customerName || 'Guest'}</td>
                <td className="py-3 px-4">₹{order.totalAmount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.$id, e.target.value)}
                    className="px-3 py-1 border border-stone-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-stone-600">
                  {new Date(order.$createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => setEmailOrder(order)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onRefresh={onRefresh}
        />
      )}

      {/* Email Modal */}
      {emailOrder && (
        <EmailModal 
          order={emailOrder} 
          onClose={() => setEmailOrder(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

// Blog Form Component
const BlogForm = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    author: blog?.author || '',
    metaTitle: blog?.metaTitle || '',
    metaDescription: blog?.metaDescription || '',
    published: blog?.published || false
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.featuredImage || null);
  const [removeImage, setRemoveImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = blog?.featuredImage || null;

    // Remove image if requested
    if (removeImage) {
      imageUrl = null;
    }
    // Upload image if a new one was selected
    else if (imageFile) {
      const uploadResult = await blogService.uploadBlogImage(imageFile);
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
        console.log('Blog image uploaded successfully:', imageUrl);
      } else {
        toast.error('Error uploading image: ' + uploadResult.error);
        setSaving(false);
        return;
      }
    }

    const blogData = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      featuredImage: imageUrl
    };

    console.log('Submitting blog data:', blogData);

    let result;
    if (blog) {
      result = await blogService.updateBlog(blog.$id, blogData);
    } else {
      result = await blogService.createBlog(blogData);
    }

    setSaving(false);

    if (result.success) {
      toast.success(blog ? 'Blog updated successfully!' : 'Blog created successfully!');
      onSuccess();
    } else {
      toast.error('Error: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="auto-generated from title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Author *</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Excerpt *</label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Content *</label>
            <textarea
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Featured Image</label>
            <div className="space-y-2">
              {imagePreview && (
                <div className="relative inline-block w-full">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-xs text-stone-500">
                {imagePreview ? 'Click the X to remove current image, or choose a new file to replace it' : 'Choose an image file to upload'}
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-stone-700">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Blogs Tab
const BlogsTab = ({ blogs, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const handleTogglePublish = async (blog) => {
    const result = await blogService.updateBlog(blog.$id, {
      ...blog,
      published: !blog.published
    });
    if (result.success) {
      toast.success(`Blog ${blog.published ? 'unpublished' : 'published'} successfully!`);
      onRefresh();
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setShowForm(true)}
        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create New Blog
      </button>

      {showForm && (
        <BlogForm 
          blog={editingBlog} 
          onClose={handleCloseForm} 
          onSuccess={handleSuccess} 
        />
      )}

      <div className="grid gap-4">
        {blogs.map(blog => (
          <div key={blog.$id} className="bg-white rounded-xl border border-stone-200 p-6 flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-stone-800 mb-1">{blog.title}</h3>
              <p className="text-stone-600 text-sm mb-2">{blog.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-stone-500">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>{blog.views || 0} views</span>
                <span>•</span>
                <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTogglePublish(blog)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  blog.published
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {blog.published ? 'Published' : 'Draft'}
              </button>
              <button 
                onClick={() => handleEdit(blog)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 text-stone-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Users Tab
const UsersTab = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-stone-800 mb-2">No Users Yet</h3>
        <p className="text-stone-600">Users will appear here once they register</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Users ({users.length})</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {users.map((user) => (
              <tr key={user.$id} className="hover:bg-stone-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-stone-900">{user.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-stone-900 space-y-1">
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.$createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --------------------------
   Carousel Banner Management Tab
   -------------------------- */
const CarouselTab = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New slide form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    const result = await settingsService.getCarouselImages();
    if (result.success && result.carouselImages && result.carouselImages.length > 0) {
      setSlides(result.carouselImages);
    } else {
      // Fallback default slides as editable templates
      setSlides([
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
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please choose a banner image to upload');
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await productService.uploadProductImage(imageFile);
      if (!uploadResult.success) {
        toast.error('Image upload failed: ' + uploadResult.error);
        setUploading(false);
        return;
      }

      const newSlide = {
        url: uploadResult.url,
        title,
        subtitle,
        link: link || '#shop'
      };

      const updatedSlides = [...slides, newSlide];
      const saveResult = await settingsService.setCarouselImages(updatedSlides);
      
      if (saveResult.success) {
        setSlides(updatedSlides);
        toast.success('Slide added successfully!');
        // Reset form
        setTitle('');
        setSubtitle('');
        setLink('');
        setImageFile(null);
        setImagePreview('');
      } else {
        toast.error('Failed to save settings: ' + saveResult.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding slide');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSlide = async (indexToDelete) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    const updatedSlides = slides.filter((_, idx) => idx !== indexToDelete);
    const saveResult = await settingsService.setCarouselImages(updatedSlides);
    if (saveResult.success) {
      setSlides(updatedSlides);
      toast.success('Slide deleted');
    } else {
      toast.error('Failed to save changes');
    }
  };

  const moveSlide = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSlides = [...slides];
    // Swap
    const temp = updatedSlides[index];
    updatedSlides[index] = updatedSlides[targetIndex];
    updatedSlides[targetIndex] = temp;

    const saveResult = await settingsService.setCarouselImages(updatedSlides);
    if (saveResult.success) {
      setSlides(updatedSlides);
      toast.success('Slide reordered');
    } else {
      toast.error('Failed to reorder slides');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Homepage Carousel</h2>
          <p className="text-sm text-stone-500">Configure large slideshow banner images for the front page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Slide Form */}
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">Add New Slide</h3>
          <form onSubmit={handleAddSlide} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Banner Image *</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                required
              />
              {imagePreview && (
                <div className="mt-3 relative aspect-video rounded overflow-hidden border border-stone-200 bg-stone-50">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain mx-auto" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title (Overlay Text)</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kashmiri Pashmina Shawls"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Subtitle (Overlay Description)</label>
              <textarea 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Exquisite hand-woven luxury direct from artisans"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Button Link Target</label>
              <input 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. #shop or external URL"
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? 'Uploading Banner...' : 'Add Slide to Home'}
            </button>
          </form>
        </div>

        {/* Existing Slides List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm min-h-[300px]">
            <h3 className="text-lg font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">Current Slides ({slides.length})</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <p className="mt-2 text-stone-500 text-sm">Loading slides...</p>
              </div>
            ) : slides.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <p>No custom slides configured. The frontpage is currently showing the high-quality default Kashmiri slides.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                    <img 
                      src={slide.url} 
                      alt={slide.title || 'Slide'} 
                      className="w-28 h-20 object-cover rounded border border-stone-200 bg-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-800 text-sm truncate">{slide.title || '(No Title)'}</h4>
                      <p className="text-stone-500 text-xs line-clamp-1 mt-1">{slide.subtitle || '(No Subtitle)'}</p>
                      <p className="text-amber-600 text-xs font-semibold mt-1">Link: {slide.link}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1.5 pl-2 border-l border-stone-200">
                      <button
                        onClick={() => moveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-stone-200 rounded disabled:opacity-30 text-stone-500"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 hover:bg-stone-200 rounded disabled:opacity-30 text-stone-500"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------
   News Management Tab
   -------------------------- */
const SettingsTab = () => {
  const [bulletinText, setBulletinText] = useState('');
  const [savingBulletin, setSavingBulletin] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const bResult = await settingsService.getBulletinText();
    if (bResult.success) {
      setBulletinText(bResult.bulletinText);
    }
  };

  const handleBulletinSave = async (e) => {
    e.preventDefault();
    setSavingBulletin(true);
    const result = await settingsService.setBulletinText(bulletinText);
    if (result.success) {
      toast.success('Bulletin text updated successfully!');
    } else {
      toast.error('Failed to save bulletin text');
    }
    setSavingBulletin(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">News Bulletin</h2>
        <p className="text-sm text-stone-500">Configure visual announcements and news banners for VadieKashmir</p>
      </div>

      <div className="max-w-2xl bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <h3 className="text-lg font-bold text-stone-800 mb-3">Navbar Bulletin Banner</h3>
        <p className="text-xs text-stone-500 mb-4">Displays a scrolling banner alert at the very top of the navigation bar.</p>
        
        <form onSubmit={handleBulletinSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Bulletin Text</label>
            <textarea
              value={bulletinText}
              onChange={(e) => setBulletinText(e.target.value)}
              placeholder="e.g. Free shipping on all products above ₹999! Special handloom items now live."
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm h-32 resize-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={savingBulletin}
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            {savingBulletin ? 'Saving...' : 'Update Bulletin Banner'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
