import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaArrowUp,
  FaApple,
  FaGooglePlay,
  FaShieldAlt,
  FaAward,
  FaHeadset,
  FaShippingFast,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcApplePay,
  FaGoogle,
  FaAmazon,
  FaLock,
  FaUserShield,
  FaRegThumbsUp,
} from "react-icons/fa";
import { BsTwitterX, BsShieldCheck } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io";
import { SiPayoneer } from "react-icons/si";
import SummaryApi from "../comman/summaryApi";
import toast from "react-hot-toast";
import Axios from "../utils/network/axios"

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false); // this comes from summary API also when logged in
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);

        const response = await Axios({
            ...SummaryApi.subscribeNewsletter,
            data: { email }
        });

        if(response.data.success){
            toast.dismiss();
            toast.success("Subscribed Successfully");
            setIsSubscribed(true);
            setEmail("");
        } else {
            toast.dismiss()
            toast.error(response.data.message || "Failed");
        }

    } catch (error) {
        toast.dismiss()
        toast.error(error.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
  }

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "Refund Policy", path: "/refund-policy" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: "#", label: "Facebook", hover: "hover:text-blue-500" },
    { icon: IoLogoInstagram, url: "#", label: "Instagram", hover: "hover:text-pink-500" },
    { icon: FaLinkedinIn, url: "https://linkedin.com", label: "LinkedIn", hover: "hover:text-blue-400", external: true },
    { icon: FaGithub, url: "#", label: "GitHub", hover: "hover:text-gray-400" },
    { icon: BsTwitterX, url: "#", label: "Twitter", hover: "hover:text-gray-300" },
  ];

  const trustBadges = [
    { icon: FaShieldAlt, text: "Secure Payments", subtext: "256-bit SSL Encrypted" },
    { icon: FaUserShield, text: "Buyer Protection", subtext: "Guaranteed Safe Checkout" },
    { icon: FaAward, text: "Premium Quality", subtext: "Top Rated Products" },
    { icon: FaHeadset, text: "24/7 Support", subtext: "Always Here for You" },
    { icon: FaShippingFast, text: "Fast Delivery", subtext: "Free Shipping over ₹999" },
  ];

  const trustExtras = [
    { icon: FaLock, label: "SSL Secured" },
    { icon: BsShieldCheck, label: "Verified by Payment Gateway" },
    { icon: FaRegThumbsUp, label: "100% Authentic Products" },
  ];

  const paymentMethods = [
    { icon: FaCcVisa, name: "Visa" },
    { icon: FaCcMastercard, name: "Mastercard" },
    { icon: FaCcAmex, name: "American Express" },
    { icon: FaCcPaypal, name: "PayPal" },
    { icon: FaCcApplePay, name: "Apple Pay" },
    { icon: FaGoogle, name: "Google Pay" },
    { icon: FaAmazon, name: "Amazon Pay" },
    { icon: SiPayoneer, name: "Payoneer" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden border-t border-gray-800">
      {/* Trust Line */}
      <div className="bg-gray-900 border-b border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-base font-semibold text-white mb-1 tracking-wide">
            Trusted by Over 10,000+ Customers
          </h3>
          <p className="text-xs text-gray-400">
            100% Secure Checkout • Free Returns • Genuine Products Guaranteed
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-800/60 p-3 rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all"
              >
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <badge.icon className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-white font-medium">{badge.text}</p>
                  <p className="text-[11px] text-gray-400">{badge.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center shadow-inner">
              <span className="font-bold text-lg text-white">Q</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Quick<span className="text-amber-500">oo</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Experience trusted online shopping with top-rated products,
            exclusive deals, and secure checkout every time.
          </p>
          <p className="text-xs text-gray-400 font-medium mb-2">Get our App</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="#"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-2 rounded-md text-xs transition"
            >
              <FaApple size={16} />
              <span>App Store</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-2 rounded-md text-xs transition"
            >
              <FaGooglePlay size={14} />
              <span>Google Play</span>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 border-b border-gray-800 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-xs text-gray-400 hover:text-amber-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 border-b border-gray-800 pb-2">
            Contact Us
          </h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>
              <span className="text-white font-medium">Email: </span>
              <a href="mailto:support@quickoo.com" className="hover:text-amber-400">
                support@quickoo.com
              </a>
            </li>
            <li>
              <span className="text-white font-medium">Phone: </span>
              <a href="tel:+917066893615" className="hover:text-amber-400">
                +91 7066 893 615
              </a>
            </li>
            <li>
              <span className="text-white font-medium">Bulk Orders: </span>
              <a href="tel:+917066987615" className="hover:text-amber-400">
                +91 7066 987 615
              </a>
            </li>
          </ul>
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-300 mb-2">
              Follow Us
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, url, hover, label, external }, i) => (
                <a
                  key={i}
                  href={url}
                  target={external ? "_blank" : "_self"}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 hover:scale-110 transition-all ${hover}`}
                  aria-label={label}
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 border-b border-gray-800 pb-2">
            Stay Updated
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Join our newsletter for exclusive offers, product drops, and early access.
          </p>
          {isSubscribed ? (
            <div className="bg-green-900/30 border border-green-700 rounded-md p-3 text-center text-xs text-green-400">
              🎉 You’re now subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-xs text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium py-2 rounded-md transition flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Payment and Trust */}
      <div className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {paymentMethods.map((method, i) => (
              <div
                key={i}
                className="w-10 h-7 bg-white flex items-center justify-center rounded-md shadow-sm hover:shadow-md transition"
                title={method.name}
              >
                <method.icon className="text-gray-700 text-lg" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            {trustExtras.map((trust, i) => (
              <div
                key={i}
                className="flex items-center gap-1 text-[11px] text-gray-400"
              >
                <trust.icon className="text-amber-500" size={12} />
                <span>{trust.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 py-4 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 space-y-3 md:space-y-0">
        <p>© {new Date().getFullYear()} Quickoo. All Rights Reserved.</p>
        <div className="flex gap-3">
          <Link to="/terms" className="hover:text-amber-400">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-amber-400">
            Privacy
          </Link>
          <Link to="/shipping" className="hover:text-amber-400">
            Shipping
          </Link>
        </div>
        <p className="flex items-center gap-1">
          Made with <span className="text-red-500"><IoHeart /></span> by Quickoo Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
