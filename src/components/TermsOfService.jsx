// src/components/TermsOfService.jsx
import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, Scale, Users } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-stone-900 to-amber-900 text-white py-16 shadow-md">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <button
              onClick={() => (window.location.hash = '#home')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 md:mb-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Terms of Service</h1>
            <p className="text-stone-200 text-sm mt-2">Last updated: November 26, 2025</p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <FileText className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Agreement</div>
                <div className="text-sm font-semibold">Legal Terms</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Users className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Marketplace</div>
                <div className="text-sm font-semibold">Third-Party Vendors</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="grid gap-8">

          {/* Intro Card */}
          <section className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-stone-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-amber-50 rounded-lg p-3">
                <FileText className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Agreement to Terms</h2>
                <p className="text-stone-600 leading-relaxed">
                  Welcome to <span className="font-semibold">Vadi-e-Kashmir</span>. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Description */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Third-Party Marketplace Platform</h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  Vadi-e-Kashmir operates as a <strong>third-party marketplace platform</strong>. We connect customers with independent vendors and artisans who list their authentic Kashmir products on our platform.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <strong>Important:</strong> We are <u>not</u> the seller of the products. Each product is sold directly by the respective vendor. We facilitate the transaction but do not own, manufacture, or warehouse the products listed on our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Platform */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Use of Platform</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Eligibility:</h3>
                <p className="text-stone-600 leading-relaxed">
                  You must be at least <span className="font-semibold">18 years old</span> to use our platform and make purchases. By using our services, you represent that you meet this age requirement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Account Registration:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>You may need to create an account to access certain features.</li>
                  <li>You are responsible for maintaining the security of your account.</li>
                  <li>You must provide accurate and complete information.</li>
                  <li>You are responsible for all activities under your account.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Prohibited Uses:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>Violating any laws or regulations.</li>
                  <li>Impersonating others or providing false information.</li>
                  <li>Interfering with or disrupting the platform.</li>
                  <li>Attempting to gain unauthorized access.</li>
                  <li>Using the platform for fraudulent purposes.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Orders and Transactions */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Orders and Transactions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Product Listings:</h3>
                <p className="text-stone-600 leading-relaxed">
                  All products listed are provided by independent vendors. While we strive to ensure accuracy, product descriptions, images, and availability are the responsibility of each vendor.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Pricing:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Prices are set by vendors and displayed in Indian Rupees (INR). We reserve the right to correct pricing errors. Vendors may change prices at any time without notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Order Acceptance:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Your order constitutes an offer to purchase. Vendors reserve the right to accept or reject orders. A contract is formed only when the vendor confirms and dispatches your order.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Payment:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Payment is processed securely through third-party payment processors. You agree to pay all charges at the prices in effect when you place your order, including applicable taxes and shipping fees.
                </p>
              </div>
            </div>
          </section>

          {/* Vendor Responsibilities */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Vendor Responsibilities</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              As a marketplace platform, product quality, fulfillment, and customer service are primarily the responsibility of individual vendors. However, we:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Screen vendors before allowing them on the platform</li>
              <li>Monitor vendor performance and customer feedback</li>
              <li>Facilitate communication between customers and vendors</li>
              <li>Assist in resolving disputes when necessary</li>
              <li>May remove vendors who violate our policies</li>
            </ul>
          </section>

          {/* Shipping and Delivery */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Shipping and Delivery</h2>
            <p className="text-stone-600 leading-relaxed">
              Shipping is handled by vendors or their designated courier partners. Delivery times are estimates and may vary. See our{' '}
              <button
                onClick={() => (window.location.hash = '#shipping-policy')}
                className="text-amber-600 hover:text-amber-700 underline font-semibold"
              >
                Shipping Policy
              </button>{' '}
              for more details.
            </p>
          </section>

          {/* Returns and Refunds */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Returns and Refunds</h2>
            <p className="text-stone-600 leading-relaxed">
              Return and refund policies may vary by vendor. Please review our{' '}
              <button
                onClick={() => (window.location.hash = '#return-policy')}
                className="text-amber-600 hover:text-amber-700 underline font-semibold"
              >
                Return Policy
              </button>{' '}
              and the specific vendor's policy before making a purchase.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Intellectual Property</h2>
            <p className="text-stone-600 leading-relaxed">
              All content on this platform, including text, graphics, logos, images, and software, is owned by Vadi-e-Kashmir or our vendors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-stone-900">7. Limitation of Liability</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-3">As a marketplace platform, Vadi-e-Kashmir:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Is not liable for product quality, safety, or legality</li>
              <li>Does not guarantee product availability or delivery times</li>
              <li>Is not responsible for vendor actions or omissions</li>
              <li>Provides the platform "as is" without warranties</li>
              <li>Shall not be liable for indirect, incidental, or consequential damages</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-3">
              Our maximum liability is limited to the amount you paid for the transaction in question.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-7 h-7 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-900">8. Dispute Resolution</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Any disputes arising from your use of our platform shall be resolved through good faith negotiations. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in Kashmir, India.
            </p>
          </section>

          {/* Modifications */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">9. Modifications to Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of modified terms.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">10. Termination</h2>
            <p className="text-stone-600 leading-relaxed">
              We may suspend or terminate your access to the platform at any time, without notice, for conduct that violates these Terms or is harmful to other users, vendors, or our business interests.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">11. Governing Law</h2>
            <p className="text-stone-600 leading-relaxed">
              These Terms of Service are governed by the laws of India. Any legal proceedings shall be conducted in English.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-stone-50 p-6 rounded-lg border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Contact Information</h2>
            <p className="text-stone-600 leading-relaxed mb-4">For questions about these Terms of Service, please contact us:</p>
            <div className="space-y-2 text-stone-700">
              <p><strong>Email:</strong> legal@vadiekashmir.com</p>
              <p><strong>Phone:</strong> +91 79797472200</p>
              <p><strong>Address:</strong> Kashmir, India</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
