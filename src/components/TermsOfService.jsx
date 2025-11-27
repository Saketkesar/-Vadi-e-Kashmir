// src/components/TermsOfService.jsx
import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, Scale, Users } from 'lucide-react';

const TermsOfService = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-stone-200 text-lg">Last updated: November 26, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">Agreement to Terms</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Welcome to Vadi-e-Kashmir. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </section>

          {/* Platform Description */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Third-Party Marketplace Platform</h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  Vadi-e-Kashmir operates as a <strong>third-party marketplace platform</strong>. We connect customers with independent vendors and artisans who list their authentic Kashmir products on our platform. 
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <strong>Important:</strong> We are NOT the seller of the products. Each product is sold directly by the respective vendor. We facilitate the transaction but do not own, manufacture, or warehouse the products listed on our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Platform */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Use of Platform</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Eligibility:</h3>
                <p className="text-stone-600 leading-relaxed">
                  You must be at least 18 years old to use our platform and make purchases. By using our services, you represent that you meet this age requirement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Account Registration:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>You may need to create an account to access certain features</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Prohibited Uses:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li>Violating any laws or regulations</li>
                  <li>Impersonating others or providing false information</li>
                  <li>Interfering with or disrupting the platform</li>
                  <li>Attempting to gain unauthorized access</li>
                  <li>Using the platform for fraudulent purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Orders and Transactions */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">2. Orders and Transactions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Product Listings:</h3>
                <p className="text-stone-600 leading-relaxed">
                  All products listed are provided by independent vendors. While we strive to ensure accuracy, product descriptions, images, and availability are the responsibility of each vendor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Pricing:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Prices are set by vendors and displayed in Indian Rupees (INR). We reserve the right to correct pricing errors. Vendors may change prices at any time without notice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Order Acceptance:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Your order constitutes an offer to purchase. Vendors reserve the right to accept or reject orders. A contract is formed only when the vendor confirms and dispatches your order.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Payment:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Payment is processed securely through third-party payment processors. You agree to pay all charges at the prices in effect when you place your order, including applicable taxes and shipping fees.
                </p>
              </div>
            </div>
          </section>

          {/* Vendor Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">3. Vendor Responsibilities</h2>
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
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Shipping and Delivery</h2>
            <p className="text-stone-600 leading-relaxed">
              Shipping is handled by vendors or their designated courier partners. Delivery times are estimates and may vary. See our <button onClick={() => window.location.hash = '#shipping-policy'} className="text-amber-600 hover:text-amber-700 underline">Shipping Policy</button> for more details.
            </p>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Returns and Refunds</h2>
            <p className="text-stone-600 leading-relaxed">
              Return and refund policies may vary by vendor. Please review our <button onClick={() => window.location.hash = '#return-policy'} className="text-amber-600 hover:text-amber-700 underline">Return Policy</button> and the specific vendor's policy before making a purchase.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Intellectual Property</h2>
            <p className="text-stone-600 leading-relaxed">
              All content on this platform, including text, graphics, logos, images, and software, is owned by Vadi-e-Kashmir or our vendors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-stone-800">7. Limitation of Liability</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-3">
              As a marketplace platform, Vadi-e-Kashmir:
            </p>
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
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">8. Dispute Resolution</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Any disputes arising from your use of our platform shall be resolved through good faith negotiations. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in Kashmir, India.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">9. Modifications to Terms</h2>
            <p className="text-stone-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of modified terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">10. Termination</h2>
            <p className="text-stone-600 leading-relaxed">
              We may suspend or terminate your access to the platform at any time, without notice, for conduct that violates these Terms or is harmful to other users, vendors, or our business interests.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">11. Governing Law</h2>
            <p className="text-stone-600 leading-relaxed">
              These Terms of Service are governed by the laws of India. Any legal proceedings shall be conducted in English.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Contact Information</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-stone-700">
              <p><strong>Email:</strong> legal@vadiekashmir.com</p>
              <p><strong>Phone:</strong> +91 79797472200</p>
              <p><strong>Address:</strong> Kashmir, India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
