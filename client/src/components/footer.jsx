import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 py-14 px-6 sm:px-12">
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        {/* Brand + Description */}
        <div className="flex flex-col space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Q<span className="text-amber-600">uickoo</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            Delivering quality products with unbeatable style & trusted service.
          </p>
          <div className="flex space-x-3">
            <a
              href="#"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 transition rounded-lg px-3 py-2 shadow-sm border border-gray-200 text-gray-800 font-medium text-xs w-[130px]"
            >
              <FaApple size={20} />
              <div className="text-left leading-tight">
                <div className="text-[9px]">Download on</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 transition rounded-lg px-3 py-2 shadow-sm border border-gray-200 text-gray-800 font-medium text-xs w-[130px]"
            >
              <FaGooglePlay size={18} />
              <div className="text-left leading-tight">
                <div className="text-[9px]">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav aria-label="Quick Links">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            {["Home", "Shop", "About Us", "Contact", "Refund Policy", "Privacy Policy"].map((link) => (
              <li key={link}>
                <Link
                  to={`/${link.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + Social */}
        <section aria-labelledby="contact-us-heading">
          <h3
            id="contact-us-heading"
            className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2"
          >
            Contact Us
          </h3>
          <address className="not-italic text-sm text-gray-600 mb-6 space-y-1">
            <p>
              Email:{" "}
              <a href="mailto:support@quickoo.com" className="hover:text-amber-600">
                support@quickoo.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+917066893615" className="hover:text-amber-600">
                +91 7066893615
              </a>
            </p>
            <p>
              Bulk Orders:{" "}
              <a href="tel:+917066987615" className="hover:text-amber-600">
                +91 7066987615
              </a>
            </p>
          </address>

          <div className="flex space-x-5 text-gray-500 text-xl">
            {[
              { icon: FaFacebookF, url: "#", hover: "hover:text-blue-600" },
              { icon: IoLogoInstagram, url: "#", hover: "hover:text-pink-500" },
              { icon: FaLinkedinIn, url: "https://linkedin.com", hover: "hover:text-blue-500", external: true },
              { icon: FaGithub, url: "#", hover: "hover:text-gray-700" },
              { icon: BsTwitterX, url: "#", hover: "hover:text-black" },
            ].map(({ icon: Icon, url, hover, external }, i) => (
              <a
                key={i}
                href={url}
                target={external ? "_blank" : "_self"}
                rel={external ? "noopener noreferrer" : undefined}
                className={`${hover} transition-colors`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section aria-labelledby="newsletter-heading">
          <h3
            id="newsletter-heading"
            className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2"
          >
            Newsletter
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            Get the latest deals, offers & updates straight to your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed!");
            }}
            className="flex flex-col sm:flex-row md:flex-col gap-3"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-grow px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-sm transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-200 pt-5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <span>&copy; {new Date().getFullYear()} Quickoo. All rights reserved.</span>
        <Link to="/terms" className="hover:text-amber-600 mt-2 md:mt-0 transition">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
