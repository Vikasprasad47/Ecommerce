import React, { useState } from "react";
import { FiMail, FiUser, FiMessageSquare, FiSend, FiPhone, FiMapPin, FiHeart } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you for contacting us. We'll get back to you soon!");
      setForm({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Fill out the form below and we'll respond promptly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Contact Info */}
          <div className="lg:w-2/5 bg-gray-100 text-gray-900 p-10 lg:p-12">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="mb-8 text-gray-700">You can also reach us via email, phone, or visit our office.</p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-gray-200 p-3 rounded-full mr-4">
                  <FiMail className="text-xl text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-700">support@quickoo.co</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-200 p-3 rounded-full mr-4">
                  <FiPhone className="text-xl text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-700">+91 7066893615</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-200 p-3 rounded-full mr-4">
                  <FiMapPin className="text-xl text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-700">Warje Malwadi, Pune 411058</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
                  <FiHeart />
                </a>
                <a href="#" className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
                  <FiHeart />
                </a>
                <a href="#" className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
                  <FiHeart />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-3/5 p-10 lg:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Send a Message</h2>
            <p className="text-gray-600 mb-8">Our team will get back to you as soon as possible.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FiMessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows="5"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition disabled:opacity-75"
              >
                {isSubmitting ? "Sending..." : <><FiSend className="mr-2" /> Send Message</>}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 text-gray-800 rounded-full p-2">
                    <FiHeart className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    We'll respond to your message within 24 hours during business days. We value your feedback and questions!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
