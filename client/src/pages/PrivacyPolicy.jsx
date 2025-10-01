import React, { useState } from "react";
import { FiShield, FiUser, FiFileText, FiTruck, FiLock, FiMail, FiChevronDown, FiChevronUp } from "react-icons/fi";

const sections = [
  { title: "Information We Collect", icon: <FiUser />, content: "We may collect your name, email, address, phone, and payment info. Browsing data may also be collected to improve experience.", color: "bg-blue-100 text-blue-700" },
  { title: "How We Use Your Data", icon: <FiFileText />, content: "Data is used to process orders, improve services, send updates, and ensure secure transactions. We may personalize your shopping experience.", color: "bg-green-100 text-green-700" },
  { title: "Third-Party Services", icon: <FiTruck />, content: "We may share data with trusted payment processors and shipping providers. We never sell your info for marketing.", color: "bg-yellow-100 text-yellow-700" },
  { title: "Cookies & Tracking", icon: <FiLock />, content: "Cookies enhance browsing and show relevant ads. You can control cookies via browser settings.", color: "bg-pink-100 text-pink-700" },
  { title: "Your Rights", icon: <FiShield />, content: "You can access, correct, delete your info, object to processing, or request data portability.", color: "bg-purple-100 text-purple-700" },
  { title: "Contact Us", icon: <FiMail />, content: <>Questions? Email us at <a href="mailto:quickoo.co@gmail.com" className="underline text-blue-600 font-medium">quickoo.co@gmail.com</a></>, color: "bg-indigo-100 text-indigo-700" },
];

export default function PrivacyPolicy() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen relative py-16 px-4 bg-gray-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 rounded-full opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-40 w-96 h-96 bg-pink-200 rounded-full opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-50 p-6 rounded-full mb-4 shadow-lg">
            <FiShield className="text-blue-500 text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            At Quickoo, your privacy is our priority. Learn how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="relative rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className={`flex items-center justify-between w-full px-6 py-4 ${sec.color} rounded-xl`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-full shadow">{sec.icon}</div>
                  <span className="font-semibold text-lg">{sec.title}</span>
                </div>
                {open === idx ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {open === idx && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 text-gray-700">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          Last updated: January 2023
        </div>
      </div>
    </div>
  );
}
