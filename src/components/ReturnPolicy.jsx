// src/components/ReturnPolicy.jsx
import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';

const ReturnPolicy = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
          <p className="text-stone-200 text-lg">Last updated: November 26, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-stone-800">Our Return Policy</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              At Vadi-e-Kashmir, customer satisfaction is our priority. We understand that sometimes products may not meet your expectations. This policy outlines our return and refund process.
            </p>
          </section>

          {/* Marketplace Model */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Third-Party Marketplace Returns</h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  Vadi-e-Kashmir is a <strong>third-party marketplace platform</strong>. Returns are handled by individual vendors according to their policies. We facilitate the return process and mediate disputes, but the final decision rests with the vendor.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Return policies may vary by vendor and product type. Please review the specific vendor's policy on the product page before making a purchase.
                </p>
              </div>
            </div>
          </section>

          {/* Return Window */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">1. Return Window</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Standard Products:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Most vendors accept returns within <strong>7-14 days</strong> of delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Handcrafted Items:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Custom-made or handcrafted items may have <strong>limited or no return options</strong> unless defective.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Perishable Items:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Saffron, dry fruits, and food products are not eligible for return unless reported damaged within 24 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Eligible Returns */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-stone-800">2. Eligible Returns</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-4">Product can be returned if:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Product arrived damaged or defective</li>
              <li>Wrong product delivered</li>
              <li>Missing items in the package</li>
              <li>Quality does not match the description</li>
              <li>Incorrect size delivered (where vendor supports size returns)</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <p className="text-green-800 text-sm">
                <strong>Tip:</strong> Record video while unboxing for smooth claim processing.
              </p>
            </div>
          </section>

          {/* Non-Eligible */} 
          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-stone-800">3. Non-Eligible Returns</h2>
            </div>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Used or washed products</li>
              <li>Items without packaging or tags</li>
              <li>Customized or personalized orders (unless defective)</li>
              <li>Food items (unless spoiled on arrival)</li>
              <li>Return request beyond the return window</li>
            </ul>
          </section>

          {/* Return Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Return Conditions</h2>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Product must be unused and in original condition</li>
              <li>All accessories and free gifts must be included</li>
              <li>No stains, perfume smell, or damage</li>
              <li>Invoice or order receipt required</li>
            </ul>
          </section>

          {/* Return Steps */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. How to Initiate a Return</h2>
            <div className="space-y-4 bg-stone-50 p-6 rounded-xl">
              {[
                ['Contact Us', 'Email support@vadiekashmir.com or WhatsApp +91 7979747200 within return window'],
                ['Provide Details', 'Order number, reason for return, and photos/videos'],
                ['Return Approval', 'Vendor reviews and approves/declines request'],
                ['Ship Back', 'Pack properly & ship to the provided return address'],
                ['Inspection & Refund', 'Vendor inspects and processes refund if approved'],
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-700">{step[0]}</h3>
                    <p className="text-stone-600 text-sm">{step[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        {/* Shipping & Refund */}
<section className="bg-stone-100 p-6 rounded-xl shadow-md mb-6 border border-stone-300">
  <h2 className="text-2xl font-extrabold text-stone-900 mb-4 underline underline-offset-4">
    6. Return Shipping & Refund
  </h2>

  <div className="space-y-4 text-stone-800 font-semibold">

    <p>
      • If the product is <span className="font-extrabold"> incorrect</span>, return pickup will be provided free of cost.
    </p>

    <p>
      • For <span className="font-extrabold">size issues or change of mind</span>, the
      customer must bear the return shipping charges (only if the vendor allows a return).
    </p>

    <p>
      Refund will be processed within <span className="font-extrabold">5–7 business days</span> after vendor approval.
      Bank processing may take an additional <span className="font-extrabold">5–10 working days</span>.
    </p>

    <hr className="border-stone-400" />

    <div className="space-y-3">
      <p className="text-red-700 font-extrabold">
        ⚠ Important Refund Conditions:
      </p>

      <ul className="space-y-2 list-disc pl-6">
        <li className="font-extrabold">
          Shipping charges are strictly non-refundable under all circumstances.
        </li>
        <li className="font-extrabold">
          Once an order is placed, shipping fees will NOT be refunded — even if the customer requests cancellation, return, or refund.
        </li>
        <li className="font-extrabold">
          If a shipment is returned due to wrong address, customer not available, or refusal to accept delivery —
          <span className="text-red-700"> reshipping charges must be paid again by the customer.</span>
        </li>
      </ul>
    </div>

  </div>
</section>


          {/* Cancellations */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Order Cancellations</h2>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Before dispatch → Full refund</li>
              <li>After dispatch → Cannot cancel, delivery must be received first</li>
            </ul>
          </section>

          {/* Vendor Policies */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">8. Vendor-Specific Policies</h2>
            <p className="text-stone-600 leading-relaxed">
              Some vendors may follow additional return rules. If vendor-specific policy contradicts this page, **vendor policy will apply**.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-stone-800 to-amber-800 text-white p-8 rounded-2xl mt-8">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="text-white/90 mb-2">
              Our support team is always here to assist you regarding returns, refunds, and product issues.
            </p>
            <p className="text-white font-semibold">📧 support@vadiekashmir.com</p>
            <p className="text-white font-semibold">📞 +91 7979747200 (WhatsApp & Call)</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

