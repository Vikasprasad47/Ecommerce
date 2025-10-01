import React from "react";
import { FiRefreshCw, FiClock, FiDollarSign, FiPackage, FiMail, FiShield } from "react-icons/fi";

const PolicyCard = ({ step, icon, title, description, bg }) => (
  <div className={`flex items-start space-x-4 p-6 rounded-xl shadow-md ${bg}`}>
    <div className="flex flex-col items-center">
      <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-semibold text-lg">
        {step}
      </div>
      <div className="flex-1 border-l-2 border-gray-200 ml-0 mt-2 h-full"></div>
    </div>
    <div>
      <div className="flex items-center mb-2 space-x-2">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-gray-700 text-sm md:text-base">{description}</p>
    </div>
  </div>
);

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-100 rounded-full opacity-30 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-50 rounded-full opacity-20 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Creative Heading */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block bg-blue-50 p-6 rounded-full mb-4">
            <FiRefreshCw className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 relative inline-block">
            Refund & Return Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Shop with confidence. Our clear refund and return policy ensures you know exactly what to expect.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 relative z-10">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-2 shadow-sm hover:shadow-md transition">
            <FiShield className="text-blue-600 text-xl" />
            <span className="text-gray-800 font-medium text-sm">Secure Payments</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-2 shadow-sm hover:shadow-md transition">
            <FiRefreshCw className="text-blue-600 text-xl" />
            <span className="text-gray-800 font-medium text-sm">Verified Returns</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-2 shadow-sm hover:shadow-md transition">
            <FiMail className="text-blue-600 text-xl" />
            <span className="text-gray-800 font-medium text-sm">Fast Support</span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 relative z-10">
          <PolicyCard
            step="1"
            icon={<FiClock className="text-blue-600 text-xl" />}
            title="Return Timeframe"
            description="Request returns within 7 days of delivery. Special conditions may apply during holidays."
            bg="bg-white"
          />
          <PolicyCard
            step="2"
            icon={<FiPackage className="text-blue-600 text-xl" />}
            title="Condition of Items"
            description="Items must be unused, undamaged, and in original packaging, including tags and labels."
            bg="bg-blue-50"
          />
          <PolicyCard
            step="3"
            icon={<FiDollarSign className="text-blue-600 text-xl" />}
            title="Refund Processing"
            description="Refunds are issued to the original payment method within 5-10 business days after inspection."
            bg="bg-white"
          />
          <PolicyCard
            step="4"
            icon={<FiPackage className="text-blue-600 text-xl" />}
            title="Non-Refundable Items"
            description="Certain products like perishables, hygiene items, personalized products, and digital downloads are non-refundable unless defective."
            bg="bg-blue-50"
          />
          <PolicyCard
            step="5"
            icon={<FiMail className="text-blue-600 text-xl" />}
            title="How to Request a Return"
            description={
              <>
                Email us at{" "}
                <a href="mailto:quickoo.co@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  quickoo.co@gmail.com
                </a>{" "}
                with your order number and reason. Our team will guide you.
              </>
            }
            bg="bg-white"
          />
          <PolicyCard
            step="6"
            icon={<FiRefreshCw className="text-blue-600 text-xl" />}
            title="Return Shipping"
            description="Customers are responsible for shipping costs unless the return is our error. Use a trackable service for safety."
            bg="bg-blue-50"
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm relative z-10">
          Last updated: January 2023
        </div>
      </div>
    </div>
  );
}
