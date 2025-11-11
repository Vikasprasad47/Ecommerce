// import React, { useState } from "react";
// import { 
//   FiMail, 
//   FiUser, 
//   FiMessageSquare, 
//   FiSend, 
//   FiPhone, 
//   FiMapPin, 
//   FiClock,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiHeadphones,
//   FiHelpCircle,
//   FiShoppingBag,
//   FiArrowRight
// } from "react-icons/fi";
// import Axios from "../utils/network/axios"
// import SummaryApi from "../comman/summaryApi";

// const Contact = () => {
//   const [form, setForm] = useState({ 
//     name: "", 
//     email: "", 
//     phone: "",
//     subject: "",
//     department: "general",
//     message: "" 
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     // Simulate API call
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setSubmitStatus('success');
//       setForm({ name: "", email: "", phone: "", subject: "", department: "general", message: "" });
//     } catch (error) {
//       setSubmitStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const contactMethods = [
//     {
//       icon: <FiHeadphones className="text-xl" />,
//       title: "Customer Support",
//       description: "Get help with orders, returns, and product questions",
//       contact: "support@quickoo.co",
//       hours: "24/7 Available",
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       iconColor: "text-blue-600"
//     },
//     {
//       icon: <FiShoppingBag className="text-xl" />,
//       title: "Sales Inquiries",
//       description: "Interested in bulk orders or partnership opportunities",
//       contact: "sales@quickoo.co",
//       hours: "Mon-Fri, 9AM-6PM",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//       iconColor: "text-green-600"
//     },
//     {
//       icon: <FiHelpCircle className="text-xl" />,
//       title: "Technical Support",
//       description: "Need help with platform issues or technical problems",
//       contact: "tech@quickoo.co",
//       hours: "24/7 Critical Support",
//       bgColor: "bg-purple-50",
//       borderColor: "border-purple-200",
//       iconColor: "text-purple-600"
//     }
//   ];

//   const departments = [
//     { value: "general", label: "General Inquiry" },
//     { value: "support", label: "Customer Support" },
//     { value: "sales", label: "Sales Department" },
//     { value: "technical", label: "Technical Support" },
//     { value: "billing", label: "Billing & Payments" },
//     { value: "partnership", label: "Partnership Opportunities" }
//   ];

//   return (
//     <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header - Matching Legal Pages Style */}
//         <div className="border-b border-gray-200 pb-8 mb-12">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <FiMail className="text-white text-lg" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
//                 <p className="text-sm text-gray-500">Quickoo E-Commerce Platform</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Response Time</p>
//               <p className="font-semibold text-gray-900">Within 24 Hours</p>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
//             <p className="text-gray-700 text-sm">
//               <strong>Support Channels:</strong> Email • Phone • Live Chat • Help Center
//             </p>
//           </div>
//         </div>

//         {/* Contact Methods */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           {contactMethods.map((method, index) => (
//             <div 
//               key={index}
//               className={`${method.bgColor} border ${method.borderColor} rounded-xl p-6 hover:shadow-md transition-all duration-300`}
//             >
//               <div className={`bg-white p-3 rounded-lg inline-flex items-center justify-center ${method.iconColor} mb-4`}>
//                 {method.icon}
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
//               <p className="text-gray-600 text-sm mb-4">{method.description}</p>
//               <div className="space-y-2">
//                 <a 
//                   href={`mailto:${method.contact}`}
//                   className="block text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   {method.contact}
//                 </a>
//                 <div className="flex items-center space-x-2 text-sm text-gray-500">
//                   <FiClock className="text-gray-400" />
//                   <span>{method.hours}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Contact Information */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
//               <div className="space-y-6">
//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white p-2 rounded-lg border border-gray-200">
//                     <FiPhone className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm">Phone Number</h3>
//                     <a href="tel:+917066893615" className="text-gray-700 hover:text-blue-600 block text-lg">
//                       +91 70668 93615
//                     </a>
//                     <p className="text-xs text-gray-500 mt-1">Primary Support Line</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white p-2 rounded-lg border border-gray-200">
//                     <FiMail className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm">Email Address</h3>
//                     <a href="mailto:support@quickoo.co" className="text-gray-700 hover:text-blue-600 block text-lg">
//                       support@quickoo.co
//                     </a>
//                     <p className="text-xs text-gray-500 mt-1">General Inquiries</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white p-2 rounded-lg border border-gray-200">
//                     <FiMapPin className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm">Office Address</h3>
//                     <p className="text-gray-700 text-sm">
//                       Warje Malwadi<br />
//                       Pune, Maharashtra 411058<br />
//                       India
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="bg-white p-2 rounded-lg border border-gray-200">
//                     <FiClock className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm">Business Hours</h3>
//                     <p className="text-gray-700 text-sm">
//                       Monday - Friday: 9:00 AM - 6:00 PM<br />
//                       Saturday: 10:00 AM - 4:00 PM<br />
//                       Sunday: Closed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <div className="border border-gray-200 rounded-xl p-6">
//               <div className="mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
//                 <p className="text-gray-600 text-sm">
//                   Fill out the form below and our team will get back to you within 24 hours.
//                 </p>
//               </div>

//               {submitStatus && (
//                 <div className={`mb-6 p-4 rounded-lg border ${
//                   submitStatus === 'success' 
//                     ? 'bg-green-50 border-green-200 text-green-800' 
//                     : 'bg-red-50 border-red-200 text-red-800'
//                 }`}>
//                   <div className="flex items-center space-x-3">
//                     {submitStatus === 'success' ? (
//                       <FiCheckCircle className="text-green-600 text-xl flex-shrink-0" />
//                     ) : (
//                       <FiAlertCircle className="text-red-600 text-xl flex-shrink-0" />
//                     )}
//                     <div>
//                       <p className="font-medium text-sm">
//                         {submitStatus === 'success' 
//                           ? 'Message sent successfully!' 
//                           : 'Failed to send message. Please try again.'}
//                       </p>
//                       {submitStatus === 'success' && (
//                         <p className="text-xs mt-1">
//                           We'll get back to you within 24 hours.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form className="space-y-6" onSubmit={handleSubmit}>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FiUser className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         name="name"
//                         value={form.name}
//                         onChange={handleChange}
//                         required
//                         className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FiMail className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                         className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
//                         placeholder="your@email.com"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number <span className="text-gray-600 font-semibold">(Optional)</span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FiPhone className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={form.phone}
//                         onChange={handleChange}
//                         className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
//                         placeholder="+91 12345 67890"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Department <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="department"
//                       value={form.department}
//                       onChange={handleChange}
//                       required
//                       className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
//                     >
//                       {departments.map(dept => (
//                         <option key={dept.value} value={dept.value}>
//                           {dept.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={form.subject}
//                     onChange={handleChange}
//                     required
//                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
//                     placeholder="Brief description of your inquiry"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Message <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute top-3 left-3 pointer-events-none">
//                       <FiMessageSquare className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <textarea
//                       name="message"
//                       value={form.message}
//                       onChange={handleChange}
//                       required
//                       rows="6"
//                       className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-sm"
//                       placeholder="Please provide detailed information about your inquiry..."
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? (
//                     "Sending Message..."
//                   ) : (
//                     <>
//                       Send Message
//                       <FiArrowRight className="ml-2" />
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* Response Time Info */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <div className="flex items-start space-x-4">
//                   <div className="bg-blue-50 p-2 rounded-lg">
//                     <FiClock className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-sm mb-1">Response Time</h3>
//                     <p className="text-gray-700 text-sm">
//                       We typically respond to all inquiries within <strong>24 hours</strong> during business days. 
//                       For urgent matters, please call our support line for immediate assistance.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <div className="bg-gray-50 rounded-lg p-6">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Quickoo Support Center</h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 We're committed to providing exceptional customer service and support for all your needs.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
//                 <div className="flex items-center space-x-2">
//                   <FiClock className="text-gray-400" />
//                   <span>Average Response Time: 2-4 hours</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <FiCheckCircle className="text-gray-400" />
//                   <span>Customer Satisfaction: 98%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import React, { useState, useRef } from "react";
import {
  FiMail,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiHeadphones,
  FiHelpCircle,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import Axios from "../utils/network/axios"; // your axios wrapper
import SummaryApi from "../comman/summaryApi"; // your api definition object
// Note: ensure these two imports paths match your project structure

/**
 * Production-ready Contact page
 * - handles all exceptions
 * - 2s simulated sending delay
 * - custom modal popup on success
 * - custom select (no native outline)
 * - accessible focus styles (custom ring)
 */

const departments = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Customer Support" },
  { value: "sales", label: "Sales Department" },
  { value: "technical", label: "Technical Support" },
  { value: "billing", label: "Billing & Payments" },
  { value: "partnership", label: "Partnership Opportunities" },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"
  const [serverMessage, setServerMessage] = useState(""); // message from backend or validation
  const [showModal, setShowModal] = useState(false);

  const formRef = useRef(null);
  const firstInvalidRef = useRef(null);

  // basic client validation (returns first invalid field name or null)
  const validate = () => {
    if (!form.name?.trim()) return { field: "name", message: "Name is required" };
    if (!form.email?.trim()) return { field: "email", message: "Email is required" };
    // basic email regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email.trim())) return { field: "email", message: "Invalid email" };
    if (!form.subject?.trim()) return { field: "subject", message: "Subject is required" };
    if (!form.message?.trim()) return { field: "message", message: "Message cannot be empty" };
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const focusField = (fieldName) => {
    // Try to find the input inside the form and focus it
    if (!formRef.current) return;
    const el = formRef.current.querySelector(`[name="${fieldName}"]`);
    if (el) {
      el.focus();
      // smooth scroll into view if necessary
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setServerMessage("");

    const invalid = validate();
    if (invalid) {
      setSubmitStatus("error");
      setServerMessage(invalid.message);
      focusField(invalid.field);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2 second sending delay + subtle sending animation
      await new Promise((r) => setTimeout(r, 2000));

      // Make API call (use your Axios wrapper & SummaryApi)
      const response = await Axios({
        url: SummaryApi.submitContactForm.url,
        method: SummaryApi.submitContactForm.method,
        data: form,
        timeout: 15000, // 15s timeout in axios wrapper
      });

      // backend success case
      if (response?.data?.success) {
        setSubmitStatus("success");
        setServerMessage(response.data.message || "Message received successfully.");
        setShowModal(true);
        // reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          department: "general",
          message: "",
        });
      } else {
        // backend returned non-success (400-ish)
        const msg = response?.data?.message || "Server rejected the request";
        setSubmitStatus("error");
        setServerMessage(msg);
      }
    } catch (err) {
      // handle axios/network errors
      console.error("Contact submit error:", err);
      // try to extract friendly message
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Network or server error. Please try again later.";
      setSubmitStatus("error");
      setServerMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiMail className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
                <p className="text-sm text-gray-500">Quickoo E-Commerce Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Response Time</p>
              <p className="font-semibold text-gray-900">Within 24 Hours</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>Support Channels:</strong> Email • Phone • Live Chat • Help Center
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <FiHeadphones className="text-xl" />,
              title: "Customer Support",
              description: "Get help with orders, returns, and product questions",
              contact: "support@quickoo.co",
              hours: "24/7 Available",
              bgColor: "bg-blue-50",
              borderColor: "border-blue-200",
              iconColor: "text-blue-600",
            },
            {
              icon: <FiShoppingBag className="text-xl" />,
              title: "Sales Inquiries",
              description: "Interested in bulk orders or partnership opportunities",
              contact: "sales@quickoo.co",
              hours: "Mon-Fri, 9AM-6PM",
              bgColor: "bg-green-50",
              borderColor: "border-green-200",
              iconColor: "text-green-600",
            },
            {
              icon: <FiHelpCircle className="text-xl" />,
              title: "Technical Support",
              description: "Need help with platform issues or technical problems",
              contact: "tech@quickoo.co",
              hours: "24/7 Critical Support",
              bgColor: "bg-purple-50",
              borderColor: "border-purple-200",
              iconColor: "text-purple-600",
            },
          ].map((method, i) => (
            <div
              key={i}
              className={`${method.bgColor} border ${method.borderColor} rounded-xl p-6 hover:shadow-md transition-all duration-300`}
            >
              <div
                className={`bg-white p-3 rounded-lg inline-flex items-center justify-center ${method.iconColor} mb-4`}
              >
                {method.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{method.description}</p>
              <div className="space-y-2">
                <a
                  href={`mailto:${method.contact}`}
                  className="block text-blue-600 hover:text-blue-800 font-medium"
                >
                  {method.contact}
                </a>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FiClock className="text-gray-400" />
                  <span>{method.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <FiPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Phone Number</h3>
                    <a href="tel:+917066893615" className="text-gray-700 hover:text-blue-600 block text-lg">
                      +91 70668 93615
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Primary Support Line</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <FiMail className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Email Address</h3>
                    <a href="mailto:support@quickoo.co" className="text-gray-700 hover:text-blue-600 block text-lg">
                      support@quickoo.co
                    </a>
                    <p className="text-xs text-gray-500 mt-1">General Inquiries</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <FiMapPin className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Office Address</h3>
                    <p className="text-gray-700 text-sm">
                      Warje Malwadi
                      <br />
                      Pune, Maharashtra 411058
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <FiClock className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Business Hours</h3>
                    <p className="text-gray-700 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600 text-sm">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* status block */}
              {submitStatus && serverMessage && (
                <div
                  className={`mb-6 p-4 rounded-lg border ${
                    submitStatus === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {submitStatus === "success" ? (
                      <FiCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                    ) : (
                      <FiAlertCircle className="text-red-600 text-xl flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{serverMessage}</p>
                      {submitStatus === "success" && <p className="text-xs mt-1">We'll get back to you within 24 hours.</p>}
                    </div>
                  </div>
                </div>
              )}

              <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        aria-required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        aria-required
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-600 font-semibold">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition text-sm"
                        placeholder="+91 12345 67890"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>

                    {/* Custom dropdown wrapper */}
                    <div className="relative">
                      <select
                        id="department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition text-sm pr-10"
                        aria-label="Select department"
                      >
                        {departments.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>

                      {/* custom arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" aria-hidden>
                          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    aria-required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition text-sm"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FiMessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      aria-required
                      rows="6"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-60 transition resize-none text-sm"
                      placeholder="Please provide detailed information about your inquiry..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-disabled={isSubmitting}
                >
                  {/* sending animation + text */}
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Send Message</span>
                      <FiArrowRight className="ml-2" />
                    </div>
                  )}
                </button>
              </form>

              {/* Response Time Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FiClock className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Response Time</h3>
                    <p className="text-gray-700 text-sm">
                      We typically respond to all inquiries within <strong>24 hours</strong> during business days.
                      For urgent matters, please call our support line for immediate assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quickoo Support Center</h3>
              <p className="text-gray-600 text-sm mb-4">
                We're committed to providing exceptional customer service and support for all your needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-400" />
                  <span>Average Response Time: 2-4 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-gray-400" />
                  <span>Customer Satisfaction: 98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* max-w container */}

      {/* Success Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <FiCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold">Message Sent Successfully!</h3>
              <p className="text-gray-500 text-sm mt-1">{serverMessage || "We will contact you shortly."}</p>
              <p className="text-gray-500 text-sm mt-1">Thank You!</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg w-full transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
