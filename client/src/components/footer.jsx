import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="bg-[#fdfaeb] text-black py-12 px-6 sm:px-12 select-none"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand + Description + App Buttons */}
        <div className="flex flex-col space-y-5 animate-fadeIn">
          <h2 className="text-2xl font-extrabold text-green-500 tracking-tight select-text">
            Q<span className="text-amber-500">uickoo</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Your one-stop shop for quality products with unbeatable style & prices.
          </p>

          {/* App Store Buttons */}
          <div className="flex space-x-3">
            <a
              href="#"
              aria-label="Download on the App Store"
              className="flex items-center gap-2 bg-white hover:bg-amber-50 transition rounded-lg px-3 py-1.5 shadow-md text-amber-600 font-semibold text-xs max-w-[130px]"
              style={{ minWidth: '130px' }}
            >
              <FaApple size={20} />
              <div className="text-left leading-tight">
                <div className="text-[8px]">Download on the</div>
                <div className="text-sm font-bold leading-none">App Store</div>
              </div>
            </a>
            <a
              href="#"
              aria-label="Get it on Google Play"
              className="flex items-center gap-2 bg-white hover:bg-amber-50 transition rounded-lg px-3 py-1.5 shadow-md text-amber-600 font-semibold text-xs max-w-[130px]"
              style={{ minWidth: '130px' }}
            >
              <FaGooglePlay size={18} />
              <div className="text-left leading-tight">
                <div className="text-[8px]">Get it on</div>
                <div className="text-sm font-bold leading-none">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav className="animate-fadeIn" aria-label="Quick Links">
          <h3 className="text-lg font-semibold text-amber-500 mb-4 border-b border-amber-300 pb-1">
            Quick Links
          </h3>
          {/* <ul className="flex flex-col gap-2 text-gray-700 text-sm">
            {['Home', 'Shop', 'About Us', 'Contact'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-amber-500 transition"
                  tabIndex={0}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul> */}
          <ul className="flex flex-col gap-2 text-gray-700 text-sm">
            {['Home', 'Shop', 'About Us', 'Contact', "Refund Policy", "Privacy Policy"].map((link) => (
              <li key={link}>
                <Link
                  to={`/${link.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-amber-500 transition"
                  tabIndex={0}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + Social */}
        <section
          className="animate-fadeIn"
          aria-labelledby="contact-us-heading"
        >
          <h3
            id="contact-us-heading"
            className="text-lg font-semibold text-amber-500 mb-4 border-b border-amber-300 pb-1"
          >
            Contact Us
          </h3>
          <address className="not-italic text-sm text-gray-700 mb-6 space-y-1">
            <div>
              Email:{' '}
              <a
                href="mailto:support@quickoo.com"
                className="underline hover:text-amber-500 transition"
              >
                support@quickoo.com
              </a>
            </div>
            <div>
              Phone:{' '}
              <a
                href="tel:+917066893615"
                className="underline hover:text-amber-500 transition"
              >
                +91 7066893615
              </a>
            </div>
            <div>
              For Bulk Order{' '}
              <a
                href=""
                className="underline hover:text-amber-500 transition"
              >
                +91 7066987615
              </a>
            </div>
          </address>

          <div className="flex space-x-6 text-gray-700 text-xl">
            {[{
              icon: FaFacebookF,
              url: '#',
              label: 'Facebook',
              hoverColor: 'hover:text-blue-600',
            }, {
              icon: IoLogoInstagram,
              url: '#',
              label: 'Instagram',
              hoverColor: 'hover:text-pink-500',
            }, {
              icon: FaLinkedinIn,
              url: 'https://www.linkedin.com/in/vikas-prasad-216365324/',
              label: 'LinkedIn',
              hoverColor: 'hover:text-blue-500',
              external: true,
            }, {
              icon: FaGithub,
              url: '#',
              label: 'Github',
              hoverColor: 'hover:text-gray-600',
            }, {
              icon: FaTwitter,
              url: '#',
              label: 'Twitter',
              hoverColor: 'hover:text-sky-500',
            }].map(({ icon: Icon, url, label, hoverColor, external }, i) => (
              <a
                key={i}
                href={url}
                target={external ? '_blank' : '_self'}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className={`${hoverColor} transition transform hover:scale-110`}
                tabIndex={0}
              >
                <Icon />
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section
          className="animate-fadeIn"
          aria-labelledby="newsletter-heading"
        >
          <h3
            id="newsletter-heading"
            className="text-lg font-semibold text-amber-500 mb-4 border-b border-amber-300 pb-1"
          >
            Newsletter
          </h3>
          <p className="text-sm text-gray-700 mb-5 max-w-md">
            Subscribe to get the latest deals, offers & updates right in your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md md:flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Subscribed!');
            }}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-grow px-3 py-2 rounded-md border border-amber-400 bg-white placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-gray-700 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-semibold text-sm transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-amber-300 pt-5 text-center text-amber-500 text-xs flex flex-col">
        &copy; {new Date().getFullYear()} Quickoo. All rights reserved.
        <Link to={"/terms"}>Terms And Conditions</Link>
      </div>

      {/* Simple fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
