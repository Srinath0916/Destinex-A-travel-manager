import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";

const Packages = () => {
  const { destinationId } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/destination/destinations/${destinationId}/packages`)
      .then(res => {
        setPackages(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch packages');
        setLoading(false);
      });
  }, [destinationId]);

  const handleBookNow = (pkg) => {
    navigate(`/package/${pkg._id}`);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handlePackagesClick = () => {
    navigate('/packages');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  // Get unique categories for filter
  const categories = [
    "All",
    ...new Set(packages.map((pkg) => pkg.category).filter(Boolean)),
  ];

  // Filter packages by selected category
  const filteredPackages =
    selectedCategory === "All"
      ? packages
      : packages.filter((pkg) => pkg.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-300 border-l-blue-500 border-r-blue-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading amazing travel packages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-center text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add the CSS styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        /* Focus styles for accessibility */
        a:focus, button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>

    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-80"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-blue-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              Discover Our Packages
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto font-medium">
              Find the perfect travel experience tailored just for you
            </p>
          </div>
        </div>
      </div>

{/* Breadcrumb Navigation */}
<div className="w-full bg-white shadow-sm relative overflow-hidden" style={{height:"40px",backgroundColor:"white"}}>
  {/* Animated top border */}
  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent transform -translate-x-full animate-pulse"></div>
  
  <div className="max-w-7xl mx-auto px-4 py-3 h-full flex items-center">
    <nav className="flex w-full" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <li className="animate-slideIn">
          <div className="flex items-center">
            <button 
              onClick={handleHomeClick}
              className="group p-2 rounded-xl text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden"
            >
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              
              <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
          </div>
        </li>
        
        <li className="animate-slideIn animation-delay-100">
          <svg 
            className="w-5 h-5 text-gray-300 transition-all duration-300 hover:text-green-400 hover:translate-x-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        
        <li className="animate-slideIn animation-delay-200">
          <div className="flex items-center">
            <div className="group relative">
              <button 
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden border-2 border-green-300"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '25px',
                  fontSize: '14px',
                  minWidth: '100px'
                }}
              >
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 origin-center"></div>
                
                <span className="relative z-10">Packages</span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300/30 to-green-500/30 blur-sm group-hover:blur-md transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  </div>
</div>

      {/* Content Section - full width, no right white space */}
      <div className="w-full px-2 py-12 flex-grow">
        {/* Package Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            marginLeft: "50px",
            marginRight: "50px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {filteredPackages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-300 p-10"
            >
              {/* Package Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    pkg.image ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  }
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {pkg.category && (
                <div className="absolute top-6 left-0 bg-gradient-to-r from-green-700 to-yellow-500 text-white py-2 px-6 font-extrabold text-sm shadow-lg tracking-wide flex items-center gap-2 uppercase hover:from-yellow-500 hover:to-green-700 transition-all duration-300 rounded-r-md" style={{width:"90px"}}>
                    {" "}
                    {pkg.category}
                  </div>
                )}
              </div>

              {/* Package Content */}
              <div style={{ padding: "15px" }}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {pkg.name}
                </h3>
                <div className="w-10 h-1 bg-blue-500 rounded mb-4"></div>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                  {pkg.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 font-bold text-2xl">
                    ₹{pkg.price}
                  </div>
                  <button
                    onClick={() => handleBookNow(pkg)}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded transition-colors duration-200 shadow-md text-center"
                    style={{ width: "150px" }}
                  >
                    View Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-blue-50 inline-block p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No packages found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any packages for this destination. Please check
              back later.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 w-full">
        <div
          className="max-w-7xl mx-auto py-12 px-4 flex flex-col items-center w-full"
          style={{
            marginLeft: "50px",
            marginRight: "50px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Destinex Logo Centered */}
          <div className="mb-6 flex flex-col items-center" style ={{ marginTop: "20px" }}>
            <img
              src="/images/logo.png"
              alt="Destinex Logo"
              className="h-12 w-auto mb-2"
            />
            <h2 className="text-2xl font-bold tracking-wide">Destinex</h2>
            <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
              Explore the world with confidence and comfort.
            </p>
          </div>
          {/* Footer Links and Socials */}
          <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 mt-8">
            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <button 
                onClick={handleHomeClick}
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none text-left p-0"
              >
                Home
              </button>
              <button 
                className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none text-left p-0"
              >
                Contact
              </button>
            </div>
            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-semibold mb-2">Contact</h3>
              <span className="text-gray-300">info@destinex.com</span>
              <span className="text-gray-300">+91 12345 67890</span>
            </div>
            {/* Socials */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          {/* Copyright Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm w-full">
            <p >Destinex © 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Packages;