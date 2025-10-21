import React, { useState } from "react";
import { 
  FiRefreshCw, 
  FiClock, 
  FiDollarSign, 
  FiPackage, 
  FiMail, 
  FiShield,
  FiTruck,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiFileText
} from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";



const RefundPolicy = () => {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const policySections = [
     {
      title: "1. Return Eligibility & Timeframes",
      icon: <FiClock />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <FiCheckCircle className="text-green-600" />
                <h4 className="font-semibold text-green-800">Eligible Items</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Unused products in original condition</li>
                <li>• Original packaging and tags intact</li>
                <li>• Within 30 days of delivery</li>
                <li>• Proof of purchase provided</li>
              </ul>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-center space-x-2 mb-2">
                <FiXCircle className="text-red-600" />
                <h4 className="font-semibold text-red-800">Non-Eligible Items</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Perishable goods and groceries</li>
                <li>• Intimate or sanitary products</li>
                <li>• Customized or personalized items</li>
                <li>• Digital products and software</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-800 text-sm">
              <strong>Extended Holiday Period:</strong> Purchases made between November 15th and December 31st 
              may be returned until January 31st of the following year.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. Return Process & Procedures",
      icon: <FiRefreshCw />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">1</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Request Authorization</h5>
              <p className="text-sm text-gray-600">Contact customer service with order details and reason for return</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">2</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Ship Item</h5>
              <p className="text-sm text-gray-600">Use provided return label or trackable shipping method</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">3</span>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Receive Refund</h5>
              <p className="text-sm text-gray-600">Refund processed within 5-10 business days after inspection</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-3">Required Documentation</h5>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center space-x-2">
                <FiFileText className="text-blue-600 flex-shrink-0" />
                <span>Completed return authorization form</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiFileText className="text-blue-600 flex-shrink-0" />
                <span>Copy of original invoice or order confirmation</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiFileText className="text-blue-600 flex-shrink-0" />
                <span>Reason for return documentation</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "3. Refund Methods & Processing",
      icon: <FaIndianRupeeSign Sign />,
      content: (
        <div className="space-y-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Payment Method</th>
                <th className="border border-gray-300 p-3 text-left">Refund Method</th>
                <th className="border border-gray-300 p-3 text-left">Processing Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">Credit/Debit Card</td>
                <td className="border border-gray-300 p-3">Original payment method</td>
                <td className="border border-gray-300 p-3">5-10 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">PayPal</td>
                <td className="border border-gray-300 p-3">PayPal account</td>
                <td className="border border-gray-300 p-3">3-5 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">Bank Transfer</td>
                <td className="border border-gray-300 p-3">Bank account</td>
                <td className="border border-gray-300 p-3">7-14 business days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">Store Credit</td>
                <td className="border border-gray-300 p-3">E-gift card</td>
                <td className="border border-gray-300 p-3">24-48 hours</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-yellow-800 mb-1">Important Notice</h5>
                <p className="text-yellow-700 text-sm">
                  Refund processing times are estimates and may vary based on your financial institution. 
                  The refund will appear on your statement under the original transaction description.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. Shipping & Handling Charges",
      icon: <FiTruck />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3 text-center">Customer Responsibility</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Return shipping costs</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Customer Pays</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Restocking fee (if applicable)</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">15%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Original shipping charges</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Non-refundable</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3 text-center">Company Responsibility</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Defective/wrong items</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">We Pay</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Quality issues</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">We Pay</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Company errors</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">We Pay</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Free Return Shipping:</strong> We provide prepaid return labels for orders where the return 
              is due to our error (wrong item shipped, defective product, etc.).
            </p>
          </div>
        </div>
      )
    },
    {
      title: "5. Damaged or Defective Items",
      icon: <FiPackage />,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h5 className="font-semibold text-red-800 mb-3">Immediate Action Required</h5>
            <p className="text-red-700 mb-4">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery 
              to expedite resolution.
            </p>
            <div className="space-y-2 text-sm text-red-700">
              <li>Take clear photographs of the damaged item and packaging</li>
              <li>Do not discard original packaging materials</li>
              <li>Contact customer service immediately</li>
              <li>Keep all shipping documents and labels</li>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h6 className="font-semibold text-gray-800 mb-2">Replacement Options</h6>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Immediate shipment of replacement item</li>
                <li>• Full refund including shipping costs</li>
                <li>• Store credit with 10% bonus</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h6 className="font-semibold text-gray-800 mb-2">Resolution Timeline</h6>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Initial response: 24 hours</li>
                <li>• Replacement shipped: 1-2 business days</li>
                <li>• Full resolution: 3-5 business days</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "6. Contact & Support Information",
      icon: <FiMail />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3">Returns Department</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-500 flex-shrink-0" />
                  <a href="mailto:returns@quickoo.com" className="text-blue-600 hover:text-blue-800">
                    returns@quickoo.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FiClock className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">Response Time: 24-48 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiFileText className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">Case Number Required</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3">Customer Service</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-500 flex-shrink-0" />
                  <a href="mailto:support@quickoo.com" className="text-blue-600 hover:text-blue-800">
                    support@quickoo.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FiClock className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">Mon-Fri, 9AM-6PM EST</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">Escalation Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-800 mb-2">Online Return Portal</h5>
            <p className="text-green-700 text-sm">
              For faster processing, use our online return portal at{' '}
              <a href="https://quickoo.com/returns" className="underline font-medium">quickoo.com/returns</a>. 
              Track your return status in real-time and receive instant updates.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Professional Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FiRefreshCw className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Return & Refund Policy</h1>
                <p className="text-sm text-gray-500">Quickoo E-Commerce Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Effective Date</p>
              <p className="font-semibold text-gray-900">January 1, 2024</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>Document Version:</strong> 2.1 | <strong>Last Updated:</strong> December 15, 2023 | 
              <strong> Policy ID:</strong> RRP-2024-01
            </p>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <FiClock className="text-blue-600 text-xl mx-auto mb-2" />
            <h4 className="font-semibold text-blue-800 text-sm">Return Window</h4>
            <p className="text-blue-700 font-bold">30 Days</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <FaRupeeSign className="text-green-600 text-xl mx-auto mb-2" />
            <h4 className="font-semibold text-green-800 text-sm">Refund Processing</h4>
            <p className="text-green-700 font-bold">5-10 Days</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <FiShield className="text-purple-600 text-xl mx-auto mb-2" />
            <h4 className="font-semibold text-purple-800 text-sm">Customer Support</h4>
            <p className="text-purple-700 font-bold">24/7 Available</p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-4">
          {policySections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-6 py-4 bg-white hover:bg-gray-50 text-left border-b border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-gray-600">
                    {section.icon}
                  </div>
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-400">
                  {openSections[index] ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </button>
              
              {openSections[index] && (
                <div className="px-6 py-4 bg-white">
                  <div className="prose prose-gray max-w-none">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Policy Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Policy Version:</span>
                    <span className="font-medium">2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Date:</span>
                    <span className="font-medium">January 1, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Review Cycle:</span>
                    <span className="font-medium">Semi-Annual</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Compliance</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Consumer Protection:</span>
                    <span className="font-medium">FTC Guidelines</span>
                  </div>
                  <div className="flex justify-between">
                    <span>E-commerce Standards:</span>
                    <span className="font-medium">PCI DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Quickoo E-Commerce Platform. All rights reserved. This return and refund policy 
                is subject to change without prior notice. Please check this page regularly for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;