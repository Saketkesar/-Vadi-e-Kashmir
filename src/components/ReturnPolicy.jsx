// src/components/ReturnPolicy.jsx
import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
                  Most vendors accept returns within <strong>7-14 days</strong> of delivery. The return window begins from the date you receive the product.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Handcrafted Items:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Custom-made or handcrafted products like Pashmina shawls, carpets, and personalized items may have <strong>limited or no return options</strong> unless defective.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Perishable Items:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Food items, saffron, dry fruits, and other perishables cannot be returned due to hygiene reasons, except in case of damage or quality issues reported within 24 hours of delivery.
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
            
            <p className="text-stone-600 leading-relaxed mb-4">
              Products can be returned if:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li><strong>Defective or Damaged:</strong> Product arrived with manufacturing defects or damage</li>
              <li><strong>Wrong Item:</strong> You received a different product than what you ordered</li>
              <li><strong>Incomplete Order:</strong> Missing items from your order</li>
              <li><strong>Quality Issues:</strong> Product quality does not match the description</li>
              <li><strong>Size Issues:</strong> For clothing items, incorrect size received (subject to vendor policy)</li>
            </ul>

            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <p className="text-green-800 text-sm">
                <strong>Tip:</strong> Take photos/videos when unboxing your order. This helps in case you need to file a return claim.
              </p>
            </div>
          </section>

          {/* Non-Eligible Returns */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-stone-800">3. Non-Eligible Returns</h2>
            </div>
            
            <p className="text-stone-600 leading-relaxed mb-4">
              The following cannot be returned:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Products used, worn, washed, or altered</li>
              <li>Items without original tags, labels, or packaging</li>
              <li>Custom-made or personalized products (unless defective)</li>
              <li>Perishable food items (unless damaged/spoiled on arrival)</li>
              <li>Products returned after the return window has expired</li>
              <li>Items damaged due to misuse or mishandling by customer</li>
              <li>Products on final sale or marked as "non-returnable"</li>
            </ul>
          </section>

          {/* Return Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Return Conditions</h2>
            
            <p className="text-stone-600 leading-relaxed mb-4">
              To be eligible for return, products must meet these conditions:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li><strong>Unused Condition:</strong> Product must be in original, unused condition</li>
              <li><strong>Original Packaging:</strong> All original packaging, tags, and labels must be intact</li>
              <li><strong>Complete Set:</strong> All accessories, manuals, and free gifts must be returned</li>
              <li><strong>No Odors:</strong> Products should not have any odors (perfume, smoke, etc.)</li>
              <li><strong>Proof of Purchase:</strong> Original invoice or order confirmation required</li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. How to Initiate a Return</h2>
            
            <div className="space-y-4">
              <div className="bg-stone-50 p-6 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <h3 className="font-semibold text-stone-700">Contact Us</h3>
                    <p className="text-stone-600 text-sm">Email support@vadiekashmir.com or call +91 79797472200 within the return window</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <h3 className="font-semibold text-stone-700">Provide Details</h3>
                    <p className="text-stone-600 text-sm">Share your order number, reason for return, and photos if applicable</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <h3 className="font-semibold text-stone-700">Return Approval</h3>
                    <p className="text-stone-600 text-sm">We'll review with the vendor and approve or decline the return request</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <div>
                    <h3 className="font-semibold text-stone-700">Ship Back</h3>
                    <p className="text-stone-600 text-sm">Pack the product securely and ship to the address provided</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</span>
                  <div>
                    <h3 className="font-semibold text-stone-700">Inspection & Refund</h3>
                    <p className="text-stone-600 text-sm">Vendor inspects the return, and refund is processed if approved</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Return Shipping */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Return Shipping Costs</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Defective/Wrong Products:</h3>
                <p className="text-stone-600 leading-relaxed">
                  If the product is defective, damaged, or incorrect, we will arrange <strong>free return pickup</strong> or reimburse your return shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Change of Mind:</h3>
                <p className="text-stone-600 leading-relaxed">
                  If you're returning for reasons like size issues or change of mind (where vendor permits), you are responsible for return shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Packaging:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Please pack the product securely to prevent damage during return transit. Use the original packaging when possible. We are not responsible for damage during return shipment if inadequately packed.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Refund Process</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Inspection:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Once the vendor receives and inspects the returned product (typically <strong>3-5 business days</strong>), they will approve or reject the refund.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Refund Timeline:</h3>
                <p className="text-stone-600 leading-relaxed">
                  If approved, refunds are processed within <strong>5-7 business days</strong> to your original payment method. Bank processing may take additional 5-10 business days.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Refund Amount:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Refunds include the product cost. Shipping charges are refunded only if the product was defective or incorrect. Return shipping costs (for change of mind returns) are deducted from the refund.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Partial Refunds:</h3>
                <p className="text-stone-600 leading-relaxed">
                  In some cases, partial refunds may be offered if the product shows signs of use, missing components, or damage not reported initially.
                </p>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">8. Exchanges</h2>
            <p className="text-stone-600 leading-relaxed">
              Some vendors may offer exchanges for size or color variations. Availability depends on stock. Please contact us to check exchange options. If exchanges are not available, you may return for a refund and place a new order.
            </p>
          </section>

          {/* Damaged on Arrival */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">9. Damaged or Defective Items</h2>
            <p className="text-stone-600 leading-relaxed mb-3">
              If your product arrives damaged or defective:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
              <li>Do not accept the delivery if the package is visibly damaged</li>
              <li>If damage is discovered after opening, contact us within <strong>48 hours</strong> with photos</li>
              <li>We will arrange free return pickup and provide replacement or full refund</li>
              <li>No questions asked for genuine defect/damage claims</li>
            </ul>
          </section>

          {/* Cancellations */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">10. Order Cancellations</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Before Dispatch:</h3>
                <p className="text-stone-600 leading-relaxed">
                  You can cancel your order anytime before it's dispatched. Contact us immediately and we'll process a full refund within 3-5 business days.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">After Dispatch:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Once dispatched, the order cannot be cancelled. You must wait for delivery and follow the return process if needed.
                </p>
              </div>
            </div>
          </section>

          {/* Vendor-Specific Policies */}
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">11. Vendor-Specific Policies</h2>
            <p className="text-stone-600 leading-relaxed">
              Individual vendors may have specific return policies that differ from this general policy. Any vendor-specific terms will be clearly mentioned on the product page. In case of conflict, the vendor's specific policy takes precedence.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Need Help with Returns?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Our customer support team is here to help with returns and refunds:
            </p>
            <div className="space-y-2 text-stone-700">
              <p><strong>Email:</strong> support@vadiekashmir.com</p>
              <p><strong>Phone:</strong> +91 79797472200</p>
              <p><strong>Hours:</strong> Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
            </div>
            <p className="text-stone-600 text-sm mt-4">
              Please have your order number ready when contacting us for faster assistance.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
