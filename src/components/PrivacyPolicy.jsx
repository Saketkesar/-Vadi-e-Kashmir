// src/components/PrivacyPolicy.jsx
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-900 text-white py-16 shadow-lg">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <button 
              onClick={() => window.location.hash = '#home'}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 md:mb-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Privacy Policy</h1>
            <p className="text-stone-200 text-sm mt-2">Last updated: November 26, 2025</p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Shield className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Marketplace</div>
                <div className="text-sm font-semibold">Third-Party Vendors</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Lock className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Security</div>
                <div className="text-sm font-semibold">Data Protection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <div className="grid gap-8">

          {/* Intro Card */}
          <section className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-stone-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-amber-50 rounded-lg p-3">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Introduction</h2>
                <p className="text-stone-600 leading-relaxed">
                  Vadi-e-Kashmir ("we," "our," or "us") operates as a <strong>third-party marketplace platform</strong> connecting customers with authentic Kashmir product vendors. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </div>
            </div>
          </section>

          {/* Two-column sections */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Information We Collect */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-4">1. Information We Collect</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold text-stone-800 mb-2">Personal Information:</h3>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Order history and preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-stone-800 mb-2">Automatically Collected Information:</h3>
                  <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on our platform</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-stone-600 leading-relaxed mb-3">As a marketplace platform, we use your information to:</p>
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
          </div>

          {/* Third-Party Notice */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <Eye className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Important: Third-Party Marketplace</h3>
                <p className="text-amber-800 leading-relaxed">
                  Vadi-e-Kashmir operates as a <strong>third-party marketplace platform</strong>. We list products from various independent vendors and artisans. When you make a purchase, your information is shared with the relevant vendor to fulfill your order. Each vendor may have their own privacy practices, and we encourage you to review their policies as well.
                </p>
              </div>
            </div>
          </section>

          {/* Information Sharing & Data Security */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-xl font-bold text-stone-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-stone-600 leading-relaxed mb-3">We may share your information with:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li><strong>Vendor Partners:</strong> To process and fulfill your orders</li>
                <li><strong>Payment Processors:</strong> To complete transactions securely</li>
                <li><strong>Shipping Partners:</strong> To deliver products to you</li>
                <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
              </ul>
              <p className="text-stone-600 leading-relaxed mt-3">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <div className="flex items-start gap-3 mb-3">
                <Lock className="w-7 h-7 text-amber-600 flex-shrink-0" />
                <h2 className="text-xl font-bold text-stone-900">4. Data Security</h2>
              </div>
              <p className="text-stone-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
          </div>

          {/* Rights, Cookies, Children */}
          <div className="grid md:grid-cols-3 gap-6">
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 mb-3">5. Your Rights and Choices</h2>
              <p className="text-stone-600 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                <li>Access, correct, or delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request information about data we hold about you</li>
                <li>Withdraw consent where we rely on it</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 mb-3">6. Cookies and Tracking Technologies</h2>
              <p className="text-stone-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze platform usage, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 mb-3">7. Children's Privacy</h2>
              <p className="text-stone-600 leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>
          </div>

          {/* Changes & Contact */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-stone-800">Contact Us</h3>
                  <p className="text-stone-600 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="mt-3 text-stone-700 space-y-1">
                    <p><strong>Email:</strong> privacy@vadiekashmir.com</p>
                    <p><strong>Phone:</strong> +91 79797472200</p>
                    <p><strong>Address:</strong> Kashmir, India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
