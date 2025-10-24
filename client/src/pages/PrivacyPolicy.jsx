import React, { useState } from "react";
import { 
  FiShield, 
  FiUser, 
  FiFileText, 
  FiTruck, 
  FiLock, 
  FiMail, 
  FiChevronDown, 
  FiChevronUp,
  FiCalendar,
  FiMapPin,
  FiGlobe
} from "react-icons/fi";

const ProfessionalPrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState({ 0: true }); // First section open by default

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const legalSections = [
    {
      title: "1. Introduction and Scope",
      icon: <FiFileText />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Quickoo E-Commerce Platform</strong> ("we," "our," or "us") is committed to protecting 
            your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our e-commerce platform, website, and related services (collectively, 
            the "Services").
          </p>
          <p>
            This policy applies to information we collect when you access our website at 
            <strong> quickoo.com</strong>, use our mobile application, place orders, or interact with our 
            customer service team.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <p className="text-blue-800 text-sm">
              <strong>Notice:</strong> By using our Services, you consent to the data practices described 
              in this Privacy Policy. If you do not agree with our policies and practices, please do not 
              use our Services.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. Information We Collect",
      icon: <FiUser />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">2.1 Personal Information</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Information:</strong> Full name, email address, phone number, password</li>
              <li><strong>Order Information:</strong> Billing and shipping addresses, payment method details</li>
              <li><strong>Communication Data:</strong> Customer service inquiries, feedback, and survey responses</li>
              <li><strong>Marketing Preferences:</strong> Communication preferences and consent records</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">2.2 Technical and Usage Data</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>IP address, browser type, device information, and operating system</li>
              <li>Website usage patterns, pages visited, and time spent on site</li>
              <li>Cookie identifiers and similar tracking technologies</li>
              <li>Order history and shopping cart behavior</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "3. Legal Basis and Purpose of Processing",
      icon: <FiShield />,
      content: (
        <div className="space-y-4">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Purpose</th>
                <th className="border border-gray-300 p-3 text-left">Legal Basis</th>
                <th className="border border-gray-300 p-3 text-left">Data Categories</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">Order fulfillment and delivery</td>
                <td className="border border-gray-300 p-3">Contractual necessity</td>
                <td className="border border-gray-300 p-3">Contact, payment, address</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">Customer support</td>
                <td className="border border-gray-300 p-3">Legitimate interest</td>
                <td className="border border-gray-300 p-3">Contact, communication</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">Marketing communications</td>
                <td className="border border-gray-300 p-3">Consent</td>
                <td className="border border-gray-300 p-3">Contact, preferences</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">Security and fraud prevention</td>
                <td className="border border-gray-300 p-3">Legal obligation</td>
                <td className="border border-gray-300 p-3">Technical, usage data</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      title: "4. Data Sharing and Third Parties",
      icon: <FiTruck />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            We share your information only with trusted third-party service providers who assist us in 
            operating our platform and providing services to you. All third parties are contractually 
            bound to protect your data and use it only for the purposes we specify.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Payment Processors</h5>
              <p className="text-sm text-gray-600">Stripe, PayPal - For secure payment processing</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Shipping Partners</h5>
              <p className="text-sm text-gray-600">FedEx, DHL, UPS - For order delivery</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Cloud Services</h5>
              <p className="text-sm text-gray-600">AWS, Google Cloud - For data storage and processing</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Analytics Providers</h5>
              <p className="text-sm text-gray-600">Google Analytics - For service improvement</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> We do not and will never sell your personal data to third parties 
              for marketing purposes. Data is shared only to the extent necessary to provide our Services.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "5. International Data Transfers",
      icon: <FiGlobe />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Your personal data may be transferred to, and processed in, countries other than the country 
            in which you are resident. These countries may have data protection laws that are different 
            from the laws of your country.
          </p>
          <p>
            We ensure appropriate safeguards are in place for international data transfers, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>EU Standard Contractual Clauses for transfers from the EEA</li>
            <li>Adequacy decisions for transfers to approved countries</li>
            <li>Binding corporate rules for intra-organizational transfers</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. Your Legal Rights",
      icon: <FiShield />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">
            Under data protection laws including GDPR, CCPA, and other applicable regulations, 
            you have the following rights regarding your personal data:
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-gray-800">Right of Access</h5>
                <p className="text-sm text-gray-600 mt-1">Request a copy of your personal data we hold</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GDPR Article 15</span>
            </div>
            
            <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-gray-800">Right to Rectification</h5>
                <p className="text-sm text-gray-600 mt-1">Correct inaccurate or incomplete data</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GDPR Article 16</span>
            </div>
            
            <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-gray-800">Right to Erasure</h5>
                <p className="text-sm text-gray-600 mt-1">Request deletion of your personal data</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GDPR Article 17</span>
            </div>
            
            <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-gray-800">Right to Object</h5>
                <p className="text-sm text-gray-600 mt-1">Object to certain processing activities</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">GDPR Article 21</span>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              To exercise any of these rights, please contact our Data Protection Officer using the 
              contact information in Section 9. We will respond to your request within 30 days as 
              required by law.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "7. Data Retention",
      icon: <FiCalendar />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We retain your personal data only for as long as necessary to fulfill the purposes 
            for which we collected it, including to satisfy any legal, accounting, or reporting 
            requirements.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Data Category</th>
                  <th className="border border-gray-300 p-3 text-left">Retention Period</th>
                  <th className="border border-gray-300 p-3 text-left">Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Order records</td>
                  <td className="border border-gray-300 p-3">7 years from transaction</td>
                  <td className="border border-gray-300 p-3">Legal requirement</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Account information</td>
                  <td className="border border-gray-300 p-3">3 years after last activity</td>
                  <td className="border border-gray-300 p-3">Legitimate interest</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Marketing data</td>
                  <td className="border border-gray-300 p-3">Until consent withdrawal</td>
                  <td className="border border-gray-300 p-3">Consent</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Customer service records</td>
                  <td className="border border-gray-300 p-3">3 years from resolution</td>
                  <td className="border border-gray-300 p-3">Contractual necessity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: "8. Security Measures",
      icon: <FiLock />,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            We implement appropriate technical and organizational security measures to protect your 
            personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <div className="grid gap-3 mt-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Data encryption in transit (TLS 1.2+) and at rest (AES-256)</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Regular security assessments and penetration testing</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Access controls and authentication mechanisms</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Employee training on data protection and privacy</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "9. Contact Information",
      icon: <FiMail />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Data Protection Officer</h4>
            <p className="text-gray-700 mb-4">
              For privacy-related inquiries, data subject requests, or to report a security incident, 
              please contact our Data Protection Officer:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="text-gray-500 flex-shrink-0" />
                <a href="mailto:privacy@quickoo.com" className="text-blue-600 hover:text-blue-800">
                  privacy@quickoo.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Quickoo Data Protection Office<br />
                  123 Commerce Street, Suite 500<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">Regulatory Authority</h5>
            <p className="text-gray-700 text-sm">
              You have the right to lodge a complaint with a supervisory authority if you believe 
              our processing of your personal data violates applicable data protection laws.
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiShield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
              <strong>Document Version:</strong> 3.2 | <strong>Last Updated:</strong> December 15, 2023 | 
              <strong> Applicable Laws:</strong> GDPR, CCPA, PIPEDA, LGPD
            </p>
          </div>
        </div>

        {/* Legal Document Sections */}
        <div className="space-y-4">
          {legalSections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between w-full px-4 py-4 bg-white hover:bg-gray-50 text-left border-b border-gray-200"
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
                <div className="px-4 py-4 bg-white">
                  <div className="prose prose-gray max-w-none">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legal Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Document Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Policy Version:</span>
                    <span className="font-medium">3.2</span>
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
                <h4 className="font-semibold text-gray-800 mb-3">Approval</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Data Protection Officer:</span>
                    <span className="font-medium">Sarah Chen</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal Counsel:</span>
                    <span className="font-medium">Johnson & Legal Partners</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © 2024 Quickoo E-Commerce Platform. All rights reserved. This document contains 
                proprietary and confidential information. Unauthorized distribution prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPrivacyPolicy;