import React from "react";
import { FiFileText, FiShoppingCart, FiCreditCard, FiBox, FiAlertCircle } from "react-icons/fi";

// Section component definition
const Section = ({ title, icon, children }) => (
  <div className="border-l-4 border-rose-300 pl-6 mb-8">
    <div className="flex items-center mb-3">
      <span className="text-rose-500 mr-3">{icon}</span>
      <h2 className="text-2xl font-semibold text-rose-800">{title}</h2>
    </div>
    <div className="text-rose-700">
      {children}
    </div>
  </div>
);

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center mb-8">
            <div className="bg-rose-100 p-3 rounded-full mr-4">
              <FiFileText className="text-rose-600 text-xl" />
            </div>
            <h1 className="text-4xl font-bold text-rose-800">Terms & Conditions</h1>
          </div>
          
          <div className="text-rose-900">
            <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 mb-8">
              <p className="text-rose-800 text-lg">
                Welcome to Quickoo. By accessing or using our website, you agree to the
                following terms and conditions. Please read them carefully.
              </p>
            </div>

            <Section title="Use of Website" icon={<FiFileText className="text-rose-500" />}>
              <p>
                You agree to use our services only for lawful purposes. Misuse,
                fraudulent activity, or violation of policies may result in account
                suspension. You must be at least 18 years old to use our services.
              </p>
            </Section>

            <Section title="Orders & Payments" icon={<FiShoppingCart className="text-rose-500" />}>
              <p>
                All purchases must be paid in full before shipping. We reserve the right
                to cancel or reject suspicious orders. Prices are subject to change without notice, but changes will not affect orders that have already been placed.
              </p>
            </Section>

            <Section title="Shipping & Delivery" icon={<FiBox className="text-rose-500" />}>
              <p>
                We aim to process and ship orders within 1-2 business days. Delivery times may vary based on your location and shipping method selected. Risk of loss passes to you upon delivery.
              </p>
            </Section>

            <Section title="Intellectual Property" icon={<FiFileText className="text-rose-500" />}>
              <p>
                All logos, trademarks, and content on this site belong to Quickoo and
                cannot be used without permission. You may not use our intellectual property without prior written consent.
              </p>
            </Section>

            <Section title="Limitation of Liability" icon={<FiAlertCircle className="text-rose-500" />}>
              <p>
                Quickoo is not responsible for indirect damages, delays, or losses
                beyond our control. Our total liability to you for any claim related to our services will not exceed the amount you paid for the products.
              </p>
            </Section>

            <Section title="Governing Law" icon={<FiFileText className="text-rose-500" />}>
              <p>
                These terms are governed by the laws of the state where our company is registered. Any disputes will be resolved in the courts of that jurisdiction.
              </p>
            </Section>
            
            <Section title="Changes to Terms" icon={<FiFileText className="text-rose-500" />}>
              <p>
                We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms. We will notify you of significant changes.
              </p>
            </Section>
            
            <div className="pt-6 border-t border-rose-200 text-sm text-rose-700">
              <p>Last updated: January 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}