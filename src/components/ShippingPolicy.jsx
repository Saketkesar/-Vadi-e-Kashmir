// src/components/ShippingPolicy.jsx
import React from 'react';
import { ArrowLeft, Truck, Package, MapPin, Clock } from 'lucide-react';

const ShippingPolicy = () => {
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

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Shipping Policy</h1>
            <p className="text-stone-200 text-sm mt-2">Last updated: November 26, 2025</p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Truck className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Logistics</div>
                <div className="text-sm font-semibold">Multiple Vendors</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Package className="w-5 h-5 text-amber-200" />
              <div className="text-right">
                <div className="text-xs text-white/80">Packaging</div>
                <div className="text-sm font-semibold">Vendor-Owned</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="grid gap-8">
          {/* Intro */}
          <section className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-stone-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-amber-50 rounded-lg p-3">
                <Truck className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Shipping Overview</h2>
                <p className="text-stone-600 leading-relaxed">
                  At Vadi-e-Kashmir, we work with multiple vendors across Kashmir to bring you authentic products. This shipping policy outlines how orders are processed and delivered.
                </p>
              </div>
            </div>
          </section>

          {/* Marketplace Model */}
          <section className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <Package className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Third-Party Marketplace Shipping</h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  Vadi-e-Kashmir is a <strong>third-party marketplace platform</strong>. We do not directly handle shipping of products. Each order is fulfilled by the respective vendor from their location in Kashmir.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Shipping times, methods, and policies may vary by vendor. We facilitate the connection and monitor the process, but vendors are responsible for packaging and dispatching products.
                </p>
              </div>
            </div>
          </section>

          {/* Order Processing Time */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-7 h-7 text-amber-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-stone-900">1. Order Processing Time</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Standard Processing:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Most vendors process orders within <strong>1-3 business days</strong> after order confirmation. This includes preparing, packaging, and handing over the product to the courier partner.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Handmade Products:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Handcrafted items such as Pashmina shawls, carpets, and artisanal products may require <strong>5-10 business days</strong> or more for processing, as these items are often made to order.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Custom Orders:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Custom or personalized products may have longer processing times. The vendor will communicate the expected timeframe at the time of order confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Methods */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Shipping Methods and Timeframes</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Standard Shipping:</h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                  <li><strong>Within Kashmir:</strong> 2-4 business days</li>
                  <li><strong>Within India:</strong> 5-10 business days</li>
                  <li><strong>Remote areas:</strong> 10-15 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Express Shipping:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Some vendors offer express shipping at an additional cost. Delivery typically within <strong>2-5 business days</strong> to major Indian cities (subject to courier availability).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">International Shipping:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Currently, most vendors ship only within India. International shipping may be available for select products. Please contact us for assistance with international orders.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg mt-4 border border-stone-100">
              <p className="text-stone-600 text-sm">
                <strong>Note:</strong> All timeframes are estimates and begin after order processing is complete. Actual delivery times may vary due to courier delays, weather conditions, festivals, or unforeseen circumstances.
              </p>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Shipping Costs</h2>

            <div className="space-y-4">
              <p className="text-stone-600 leading-relaxed">
                Shipping charges are calculated based on:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Product weight and dimensions</li>
                <li>Delivery location</li>
                <li>Shipping method selected</li>
                <li>Vendor's shipping policy</li>
              </ul>
              <p className="text-stone-600 leading-relaxed">
                Shipping costs are displayed at checkout before payment. Some vendors may offer <strong>free shipping</strong> on orders above a certain amount.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-7 h-7 text-amber-600 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-stone-900">4. Order Tracking</h2>
            </div>

            <div className="space-y-4">
              <p className="text-stone-600 leading-relaxed">
                Once your order is dispatched, you will receive:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-2 ml-4">
                <li>Email confirmation with tracking number</li>
                <li>SMS update with courier details</li>
                <li>Link to track your shipment online</li>
              </ul>
              <p className="text-stone-600 leading-relaxed">
                You can also track your order through your account dashboard on our platform. Please allow 24-48 hours for tracking information to be updated after dispatch.
              </p>
            </div>
          </section>

          {/* Delivery Issues */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Delivery Issues</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Incorrect Address:</h3>
                <p className="text-stone-600 leading-relaxed">
                  Please ensure your shipping address is complete and correct. We are not responsible for delays or non-delivery due to incorrect address information. Additional charges may apply for address corrections.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Failed Delivery Attempts:</h3>
                <p className="text-stone-600 leading-relaxed">
                  If the courier is unable to deliver after multiple attempts, the order may be returned to the vendor. You may be contacted for redelivery instructions, which may incur additional shipping charges.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Lost or Damaged Shipments:</h3>
                <p className="text-stone-600 leading-relaxed">
                  In the rare event that your order is lost or damaged in transit, please contact us within 48 hours of expected delivery. We will work with the vendor and courier to resolve the issue through replacement or refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Delays:</h3>
                <p className="text-stone-600 leading-relaxed">
                  While we strive for timely delivery, delays may occur due to natural disasters, strikes, political unrest, courier issues, or other force majeure events. We are not liable for such delays but will assist in tracking and resolving issues.
                </p>
              </div>
            </div>
          </section>

          {/* Packaging */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Packaging</h2>
            <p className="text-stone-600 leading-relaxed">
              Vendors are responsible for ensuring products are securely packaged to prevent damage during transit. Delicate items such as pottery, glassware, and handicrafts are given special care with bubble wrap and reinforced boxes.
            </p>
          </section>

          {/* Customs and Duties */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">7. Customs and Duties (International)</h2>
            <p className="text-stone-600 leading-relaxed">
              For international shipments, customs duties, taxes, and import fees are the responsibility of the recipient. These charges are not included in the product price or shipping cost and must be paid by the customer upon delivery.
            </p>
          </section>

          {/* Undeliverable Orders */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">8. Undeliverable Orders</h2>
            <p className="text-stone-600 leading-relaxed">
              Orders that are returned to the vendor due to incorrect address, refusal to accept delivery, or non-availability of recipient may be subject to restocking fees and additional shipping charges for redelivery.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-stone-50 p-6 rounded-lg border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Need Help with Shipping?</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              If you have questions about shipping or need assistance with your order, please contact us:
            </p>
            <div className="space-y-2 text-stone-700">
              <p><strong>Email:</strong> support@vadiekashmir.com</p>
              <p><strong>Phone:</strong> +91 79797472200</p>
              <p><strong>Hours:</strong> Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShippingPolicy;
