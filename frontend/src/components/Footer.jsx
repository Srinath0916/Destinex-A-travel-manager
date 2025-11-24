import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // Scroll to top handler
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-200 w-full" style={{height: '350px'}}>
      <div
        className="max-w-7xl mx-auto py-12 px-4 w-full flex flex-col items-center"
        style={{ margin: '0 auto'}}
      >
        {/* Logo and tagline */}
        <div className="flex flex-col items-center mb-10"style={{marginTop: '20px'}}>
          <img
            src="/images/logo.png"
            alt="Destinex Logo"
            className="h-14 w-auto mb-2"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <h2 className="text-2xl font-bold tracking-wide text-white">Destinex</h2>
          <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
            Explore the world with confidence and comfort.
          </p>
        </div>
        {/* Footer Links and Socials */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8" style={{marginLeft: '200px'}}>
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-semibold mb-2 text-white">Quick Links</h3>
            <Link to="/" onClick={handleHomeClick} className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </div>
          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-semibold mb-2 text-white">Contact</h3>
            <span className="text-gray-300">info@destinex.com</span>
            <span className="text-gray-300">+91 12345 67890</span>
          </div>
          {/* Socials */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="font-semibold mb-2 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-xl transition-colors duration-200"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-xl transition-colors duration-200"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-xl transition-colors duration-200"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Copyright Bar */}
        <div className="border-t border-gray-800 pt-6 mt-2 w-full text-center text-gray-400 text-sm">
          <p>Destinex © {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
// The Footer component is a functional React component that renders a footer section for a website.
// It includes a subscription form, links to various pages, and social media icons.