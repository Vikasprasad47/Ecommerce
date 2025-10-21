import React, { useState } from "react";
import { 
  FiFileText, 
  FiShoppingCart, 
  FiCreditCard, 
  FiBox, 
  FiAlertCircle,
  FiUser,
  FiShield,
  FiGlobe,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiXCircle,
  FiCheckCircle
} from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";


const TermsAndConditions = () => {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const legalSections = [
    {
      title: "1. Agreement to Terms",
      icon: <FiFileText />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            These Terms and Conditions ("Terms") govern your access to and use of Quickoo E-Commerce Platform 
            ("we," "our," or "us") website, services, and applications (collectively, the "Services"). 
            By accessing or using our Services, you ("User," "you," or "your") agree to be bound by these Terms.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-800 text-sm">
              <strong>Important:</strong> If you do not agree to these Terms, you may not access or use our Services. 
              These Terms constitute a legally binding agreement between you and Quickoo.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. Eligibility and Account Registration",
      icon: <FiUser />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <FiCheckCircle className="text-green-600" />
                <h4 className="font-semibold text-green-800">Requirements</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Must be 18 years or older</li>
                <li>• Valid email address required</li>
                <li>• Accurate and complete information</li>
                <li>• One account per individual</li>
              </ul>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-center space-x-2 mb-2">
                <FiXCircle className="text-red-600" />
                <h4 className="font-semibold text-red-800">Prohibited</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• False or misleading information</li>
                <li>• Automated account creation</li>
                <li>• Account sharing or transfer</li>
                <li>• Multiple accounts per person</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700">
            You are responsible for maintaining the confidentiality of your account credentials and 
            for all activities that occur under your account. You must immediately notify us of any 
            unauthorized use of your account.
          </p>
        </div>
      )
    },
    {
      title: "3. Products and Pricing",
      icon: <FiShoppingCart />,
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Aspect</th>
                  <th className="border border-gray-300 p-3 text-left">Policy</th>
                  <th className="border border-gray-300 p-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Product Information</td>
                  <td className="border border-gray-300 p-3">Accuracy</td>
                  <td className="border border-gray-300 p-3">
                    We strive for accuracy but cannot guarantee all product descriptions, images, 
                    or specifications are error-free
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Pricing</td>
                  <td className="border border-gray-300 p-3">Subject to change</td>
                  <td className="border border-gray-300 p-3">
                    Prices may change without notice. Price at time of order confirmation is binding
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Availability</td>
                  <td className="border border-gray-300 p-3">Limited stock</td>
                  <td className="border border-gray-300 p-3">
                    Products may be unavailable after order placement. We reserve right to cancel 
                    orders for out-of-stock items
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Errors</td>
                  <td className="border border-gray-300 p-3">Correction rights</td>
                  <td className="border border-gray-300 p-3">
                    We reserve right to correct pricing errors and cancel orders resulting from such errors
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: "4. Orders and Payment Terms",
      icon: <FiCreditCard />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3">Order Process</h5>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Order Submission</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Offer to Purchase</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Order Confirmation</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Acceptance</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Payment Processing</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Pre-requisite</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h5 className="font-semibold text-gray-800 mb-3">Payment Methods</h5>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Credit/Debit Cards</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Accepted</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">Digital Wallets</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Accepted</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Cash on Delivery</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Limited Availability</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Order Cancellation:</strong> We reserve the right to refuse or cancel any order for any reason, 
              including but not limited to product availability, errors in product or pricing information, 
              or suspicion of fraudulent activity.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "5. Shipping and Delivery",
      icon: <FiBox />,
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Shipping Aspect</th>
                  <th className="border border-gray-300 p-3 text-left">Policy</th>
                  <th className="border border-gray-300 p-3 text-left">Timeframe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Order Processing</td>
                  <td className="border border-gray-300 p-3">1-2 business days</td>
                  <td className="border border-gray-300 p-3">Excludes weekends and holidays</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Shipping Methods</td>
                  <td className="border border-gray-300 p-3">Various carriers</td>
                  <td className="border border-gray-300 p-3">Based on customer selection and availability</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Delivery Times</td>
                  <td className="border border-gray-300 p-3">Estimates only</td>
                  <td className="border border-gray-300 p-3">Subject to carrier schedules and external factors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-medium">Risk of Loss</td>
                  <td className="border border-gray-300 p-3">Transfers upon delivery</td>
                  <td className="border border-gray-300 p-3">Customer assumes risk after delivery confirmation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Shipping Delays:</strong> We are not responsible for delays caused by shipping carriers, 
              weather conditions, customs processing, or other circumstances beyond our reasonable control. 
              Estimated delivery dates are not guaranteed.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "6. Returns and Refunds",
      icon: <FiShoppingCart />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Our return and refund policies are detailed in our separate Return Policy. By using our Services, 
            you acknowledge and agree to the terms outlined in that policy. Key points include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>30-day return window for most items from delivery date</li>
            <li>Products must be in original condition with tags and packaging</li>
            <li>Refunds processed to original payment method within 5-10 business days</li>
            <li>Customer responsible for return shipping costs unless item is defective or incorrect</li>
            <li>Certain items (perishables, intimate products, digital goods) are non-returnable</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800 text-sm">
              Please refer to our complete Return Policy for detailed information about returns, 
              exchanges, and refund procedures.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "7. Intellectual Property Rights",
      icon: <FiFileText />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Protected Content</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Website design and layout</li>
                <li>• Logos and trademarks</li>
                <li>• Product descriptions and images</li>
                <li>• Software and source code</li>
                <li>• Business processes and methods</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Prohibited Uses</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Copying or reproducing content</li>
                <li>• Creating derivative works</li>
                <li>• Commercial use without license</li>
                <li>• Reverse engineering</li>
                <li>• Removing copyright notices</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <strong>Enforcement:</strong> Any unauthorized use of our intellectual property may result in 
              legal action, including but not limited to injunctive relief and monetary damages. 
              We actively monitor for infringement and will pursue all available legal remedies.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "8. User Conduct and Prohibited Activities",
      icon: <FiUser />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h5 className="font-semibold text-red-800 mb-3">Strictly Prohibited</h5>
              <ul className="text-sm text-red-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Fraudulent activities or misrepresentation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Attempting to gain unauthorized access</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Interfering with site functionality</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Uploading malicious code or viruses</span>
                </li>
              </ul>
            </div>

            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <h5 className="font-semibold text-orange-800 mb-3">Commercial Restrictions</h5>
              <ul className="text-sm text-orange-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Reselling products for commercial gain</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Data mining or scraping</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Automated purchasing bots</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FiXCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Price manipulation attempts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "9. Limitation of Liability",
      icon: <FiAlertCircle />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h5 className="font-semibold text-gray-800 mb-3">Liability Cap</h5>
            <p className="text-gray-700 text-sm mb-3">
              To the maximum extent permitted by applicable law, Quickoo's total cumulative liability 
              to you for all claims arising from or related to these Terms or your use of our Services 
              shall not exceed the greater of:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-3 border border-gray-300 rounded">
                <div className="text-2xl font-bold text-gray-800">$100</div>
                <div className="text-xs text-gray-600">OR</div>
              </div>
              <div className="text-center p-3 border border-gray-300 rounded">
                <div className="text-lg font-bold text-gray-800">Amount Paid</div>
                <div className="text-xs text-gray-600">For the specific product/service giving rise to the claim</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">Excluded Damages</h5>
            <p className="text-gray-700 text-sm">
              In no event shall we be liable for any indirect, punitive, incidental, special, 
              consequential, or exemplary damages, including without limitation damages for 
              loss of profits, goodwill, use, data, or other intangible losses.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "10. Indemnification",
      icon: <FiShield />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            You agree to defend, indemnify, and hold harmless Quickoo, its affiliates, officers, 
            directors, employees, and agents from and against any claims, liabilities, damages, 
            judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) 
            arising out of or relating to your violation of these Terms or your use of the Services.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              This indemnification obligation includes, but is not limited to, claims related to: 
              (a) your use of the Services; (b) user content you submit; (c) your violation of any laws; 
              (d) your violation of any third-party rights; and (e) any disputes between you and other users.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "11. Governing Law and Dispute Resolution",
      icon: <FiGlobe />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Governing Law</h5>
              <p className="text-gray-700 text-sm">
                These Terms shall be governed by and construed in accordance with the laws of 
                India, without regard to its conflict of law principles.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Jurisdiction</h5>
              <p className="text-gray-700 text-sm">
                Any legal action or proceeding arising under these Terms will be brought 
                exclusively in the courts located in Pune, Maharashtra, India.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-800 mb-2">Dispute Resolution Process</h5>
            <ol className="text-sm text-green-700 space-y-2 list-decimal list-inside">
              <li>Informal negotiation (30 days)</li>
              <li>Mediation (if negotiation fails)</li>
              <li>Binding arbitration (if mediation fails)</li>
              <li>Court proceedings (if arbitration fails or for injunctive relief)</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "12. Termination",
      icon: <FiXCircle />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            We may terminate or suspend your account and bar access to the Services immediately, 
            without prior notice or liability, under our sole discretion, for any reason whatsoever, 
            including but not limited to a breach of the Terms.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Upon termination:</strong> Your right to use the Services will immediately cease. 
              All provisions of the Terms which by their nature should survive termination shall 
              survive termination, including, without limitation, ownership provisions, warranty 
              disclaimers, indemnity, and limitations of liability.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "13. Changes to Terms",
      icon: <FiClock />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material, we will provide at least 30 days' notice prior to any new terms 
            taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Continued Use:</strong> By continuing to access or use our Services after any 
              revisions become effective, you agree to be bound by the revised terms. If you do not 
              agree to the new terms, you are no longer authorized to use the Services.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "14. Contact Information",
      icon: <FiMail />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <a href="mailto:legal@quickoo.co" className="text-blue-600 hover:text-blue-800 font-medium">
                  legal@quickoo.co
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Quickoo Legal Department<br />
                  Warje Malwadi, Pune 411058<br />
                  Maharashtra, India
                </span>
              </div>
            </div>
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiFileText className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
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
              <strong>Document Version:</strong> 3.0 | <strong>Last Updated:</strong> December 15, 2023 | 
              <strong> Policy ID:</strong> TAC-2024-01
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <FiAlertCircle className="text-red-600 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Legal Binding Agreement</h3>
              <p className="text-red-700 text-sm">
                These Terms and Conditions constitute a legally binding agreement between you and Quickoo. 
                By using our services, you acknowledge that you have read, understood, and agree to be bound 
                by all terms and conditions contained herein. If you do not agree to these terms, you must 
                immediately discontinue use of our services.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {legalSections.map((section, index) => (
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
                <h4 className="font-semibold text-gray-800 mb-3">Document Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Policy Version:</span>
                    <span className="font-medium">3.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Date:</span>
                    <span className="font-medium">January 1, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Review Cycle:</span>
                    <span className="font-medium">Annual</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Legal Compliance</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Governing Law:</span>
                    <span className="font-medium">Indian Law</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jurisdiction:</span>
                    <span className="font-medium">Pune, India</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Quickoo E-Commerce Platform. All rights reserved. These Terms and Conditions 
                are proprietary and confidential. Unauthorized reproduction or distribution is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;