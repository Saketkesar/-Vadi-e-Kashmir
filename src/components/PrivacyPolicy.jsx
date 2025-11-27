// src/components/PrivacyPolicy.jsx
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-800 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <button 
            onClick={() => window.location.hash = '#home'}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-stone-200 text-lg">Last updated: November 26, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">Introduction</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Vadi-e-Kashmir ("we," "our," or "us") operates as a <strong>third-party marketplace platform</strong> connecting customers with authentic Kashmir product vendors. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Personal Information:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Automatically Collected Information:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              As a marketplace platform, we use your information to:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Facilitate transactions between you and our vendor partners</li>
              <li>Process and fulfill orders placed through our platform</li>
              <li>Communicate order status and shipping updates</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send promotional emails and special offers (with your consent)</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Third-Party Marketplace Notice */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Important: Third-Party Marketplace</h3>
                <p className="text-amber-800 leading-relaxed">
                  Vadi-e-Kashmir operates as a <strong>third-party marketplace platform</strong>. We list products from various independent vendors and artisans. When you make a purchase, your information is shared with the relevant vendor to fulfill your order. Each vendor may have their own privacy practices, and we encourage you to review their policies as well.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li><strong>Vendor Partners:</strong> To process and fulfill your orders</li>
              <li><strong>Payment Processors:</strong> To complete transactions securely</li>
              <li><strong>Shipping Partners:</strong> To deliver products to you</li>
              <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-3">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">4. Data Security</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Your Rights and Choices</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Access, correct, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request information about data we hold about you</li>
              <li>Withdraw consent where we rely on it</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-stone-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze platform usage, and deliver personalized content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Children's Privacy</h2>
            <p className="text-stone-600 leading-relaxed">
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-stone-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">Contact Us</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-stone-700">
              <p><strong>Email:</strong> privacy@vadiekashmir.com</p>
              <p><strong>Phone:</strong> +91 79797472200</p>
              <p><strong>Address:</strong> Kashmir, India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
