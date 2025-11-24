import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import {
  Calendar,
  MapPin,
  Users,
  BarChart2,
  Clock,
  Check,
  Info,
  X,
  Heart,
  Share2,
  Star,
  ChevronRight,
} from "lucide-react";

const tabs = [
  { label: "Overview", key: "overview", icon: <Info size={18} /> },
  { label: "Itinerary", key: "itinerary", icon: <Calendar size={18} /> },
  { label: "Inclusion/Exclusion", key: "inclusion", icon: <Check size={18} /> },
  {
    label: "Additional Info",
    key: "additionalInfo",
    icon: <BarChart2 size={18} />,
  },
];

const PackageDetail = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleBooking = () => {
    if (packageDetails && packageDetails._id) {
      navigate(`/package-planner/${packageDetails._id}`);
    } else {
      console.error("Package ID is undefined");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handlePackagesClick = () => {
    navigate("/packages");
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  // Fetch package details
  useEffect(() => {
    axios.get(`/packages/${id}`)
      .then(res => {
        setPackageDetails(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch package details');
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">
            Loading amazing destinations...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/packages")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-md w-full"
          >
            View Other Packages
          </button>
        </div>
      </div>
    );

  if (!packageDetails)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Package Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The package you're looking for doesn't seem to exist.
          </p>
          <button
            onClick={() => navigate("/packages")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-md w-full"
          >
            Explore Packages
          </button>
        </div>
      </div>
    );

  // Sample data for tabs in case backend doesn't provide it
  const dummyItinerary = [
    {
      day: 1,
      title: "Arrival & Welcome",
      description:
        "Arrive at the destination, transfer to your hotel and attend a welcome dinner.",
    },
    {
      day: 2,
      title: "Exploration Day",
      description: "Explore local attractions and immerse in the culture.",
    },
    {
      day: 3,
      title: "Adventure Activities",
      description:
        "Participate in various adventure activities tailored to the location.",
    },
    {
      day: 4,
      title: "Relaxation Day",
      description: "Relax at the beach or spa, or take optional excursions.",
    },
    {
      day: 5,
      title: "Departure",
      description: "Check out from hotel and transfer to airport.",
    },
  ];

  const inclusions = [
    "Accommodation in handpicked hotels",
    "Daily breakfast and selected meals",
    "Private air-conditioned transportation",
    "Professional English-speaking guides",
    "Entrance fees to all attractions as per itinerary",
    "Welcome dinner with local cuisine",
  ];

  const exclusions = [
    "International or domestic airfare",
    "Personal expenses and gratuities",
    "Travel insurance",
    "Optional activities not mentioned in the itinerary",
    "Meals not specified in the itinerary",
  ];

  const additionalInfo = [
    {
      title: "Best time to visit",
      content:
        "March to May and September to November offer the best weather conditions.",
    },
    {
      title: "What to pack",
      content:
        "Comfortable walking shoes, sunscreen, light clothing, and a light jacket for evenings.",
    },
    {
      title: "Currency",
      content:
        "Local currency is recommended for small purchases. Major credit cards are accepted in most establishments.",
    },
    {
      title: "Health & Safety",
      content:
        "No specific vaccinations required. Basic precautions regarding food and water apply.",
    },
  ];

  const relatedPackages = [
    {
      id: 1,
      name: "Mountain Trekking Adventure",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      price: 45000,
      duration: "7 Days",
    },
    {
      id: 2,
      name: "Beach Paradise Getaway",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: 38000,
      duration: "5 Days",
    },
    {
      id: 3,
      name: "Cultural Heritage Tour",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7",
      price: 52000,
      duration: "8 Days",
    },
  ];

  // Generate the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6" style={{ marginLeft: "50px" }}>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                About This Package
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {packageDetails.description ||
                  "Experience an unforgettable journey through breathtaking landscapes and immerse yourself in local culture. This carefully crafted package offers the perfect balance of adventure, relaxation, and authentic experiences."}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Guided tours with expert local guides",
                  "Authentic cultural experiences",
                  "Comfortable accommodation throughout",
                  "Carefully planned itinerary",
                  "Free time for personal exploration",
                  "24/7 customer support",
                ].map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="mt-1 flex-shrink-0">
                      <Check size={16} className="text-green-500" />
                    </div>
                    <p className="text-gray-600">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "itinerary":
        return (
          <div className="space-y-6" style={{ marginLeft: "50px" }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Day-by-Day Itinerary
            </h3>
            <div className="space-y-4">
              {(packageDetails.itinerary || dummyItinerary).map((day, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 pb-6 relative"
                >
               
                  <h4 className="font-bold text-gray-800">
                    Day {day.day}: {day.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "inclusion":
        return (
          <div className="space-y-6" style={{ marginLeft: "50px" }}>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <Check size={20} className="text-green-500 mr-2" />
                Inclusions
              </h3>
              <ul className="space-y-2">
                {(packageDetails.inclusions || inclusions).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={16}
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <X size={20} className="text-red-500 mr-2" />
                Exclusions
              </h3>
              <ul className="space-y-2">
                {(packageDetails.exclusions || exclusions).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <X
                      size={16}
                      className="text-red-500 mr-2 mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "additionalInfo":
        return (
          <div className="space-y-6" style={{ marginLeft: "50px" }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Additional Information
            </h3>
            <div className="space-y-5">
              {(packageDetails.additionalInfo || additionalInfo).map((info, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <h4 className="font-bold text-gray-800 mb-1">{info.title}</h4>
                  <p className="text-gray-600">{info.content}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Enhanced Hero Section with Parallax Effect */}
      <div className="relative h-96 md:h-screen overflow-hidden group">
        {/* Background Image with Enhanced Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110 transition-all duration-[1000ms] ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url('${packageDetails.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}')`,
            transformOrigin: "center center",
            filter: "brightness(0.85) contrast(1.1) saturate(1.2)"
          }}
        ></div>

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl animate-fade-in">
            {/* Enhanced Category Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white py-2 px-6 font-bold text-sm shadow-2xl tracking-widest uppercase hover:from-cyan-500 hover:via-teal-500 hover:to-emerald-600 transition-all duration-500 rounded-full border border-white/30 backdrop-blur-sm transform hover:scale-105 cursor-pointer"
                style={{
                  padding: "10px 20px",

                }}>
                ✈️ {packageDetails.category || "Adventure"}
              </span>
            </div>

            {/* Enhanced Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-none">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse-subtle">
                {packageDetails.name}
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-8 drop-shadow-lg"
              style={{ color: "white", fontSize: "15px", padding: "10px 20px", marginLeft: "100px", marginRight: "100px" }}
            >
              {packageDetails.shortDescription || "Discover the perfect adventure that combines exploration, relaxation, and unforgettable experiences."}
            </p>

            {/* Enhanced Quick Info Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
                style={{ padding: "10px 20px" }}
              >
                <Clock size={20} className="text-cyan-300 mr-3 drop-shadow-lg" />
                <span className="text-white font-semibold text-lg">
                  {packageDetails.duration} Days
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
                style={{ padding: "10px 20px" }}>
                <MapPin size={20} className="text-emerald-300 mr-3 drop-shadow-lg" />
                <span className="text-white font-semibold text-lg">
                  {packageDetails.location || "Multiple Destinations"}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
                style={{ padding: "10px 20px" }}>
                <Users size={20} className="text-purple-300 mr-3 drop-shadow-lg" />
                <span className="text-white font-semibold text-lg">
                  Max {packageDetails.maxGroupSize} People
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl"
                style={{ padding: "10px 20px" }}>
                <Star size={20} className="text-yellow-300 mr-3 drop-shadow-lg fill-current" />
                <span className="text-white font-semibold text-lg">
                  {packageDetails.rating || "4.8"} Rating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Breadcrumb */}
      <div
        className="w-full bg-white shadow-sm relative overflow-hidden"
        style={{ height: "40px", backgroundColor: "white" }}
      >
        {/* Animated top border */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent transform -translate-x-full animate-pulse"
          style={{ height: "1px", marginLeft: "20px" }}
        ></div>

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

                    <svg
                      className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>

              <li className="animate-slideIn animation-delay-200">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden border-2 border-green-300"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "25px",
                    fontSize: "14px",
                    minWidth: "100px",
                  }}
                >
                  Packages
                </button>
              </li>

              <li className="animate-slideIn animation-delay-300">
                <svg
                  className="w-5 h-5 text-gray-300 transition-all duration-300 hover:text-green-400 hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>

              <li className="animate-slideIn animation-delay-400">
                <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden border-2 border-green-300"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "25px",
                    fontSize: "14px",
                    minWidth: "220px",
                    padding: "2px 8px",
                  }}>{packageDetails.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="max-w-5xl w-full mx-auto px-2 py-8 flex flex-col lg:flex-row gap-6"
        style={{ marginTop: "30px", marginBottom: "30px", marginLeft: "200px" }}
      >
        {/* Main Package Details */}
        <div className="w-full lg:w-2/3">
          {/* Navigation Tabs */}
          <div className="w-full bg-[#f0f6ff] py-4">
            {/* Tabs Container */}
            <div className="flex justify-start px-4 space-x-2 mb-2" style={{marginTop: "20px"}}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-t-xl text-sm font-semibold transition-all duration-300 border border-b-0
          ${activeTab === tab.key
                      ? "bg-blue-800 text-white shadow-md z-10"
                      : "bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 hover:from-blue-200 hover:to-blue-300"
                    }
        `}
                  style={{ padding: "10px 20px" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Blue bar underneath tabs */}
            <div className="h-2 bg-blue-800 rounded-b-md mx-4" style={{marginBottom:"20px"}}></div>
            {/* Tab Content */}
            <div className="p-6" style={{marginBottom:"20px"}}>{renderTabContent()}</div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8" >
            <div className="flex items-center justify-between mb-6" style={{ marginBottom: "30px", marginRight: "50px" }}>
              <h3
                className="text-xl font-bold text-gray-800"
                style={{ marginLeft: "50px", marginRight: "50px" }}
              >
                Customer Reviews
              </h3>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= (packageDetails.rating || 4.8)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {packageDetails.reviewCount || 24} reviews
                </span>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6">
              {[
                {
                  name: "Sarah Johnson",
                  date: "10 May, 2025",
                  rating: 5,
                  comment:
                    "This was the trip of a lifetime! Every detail was perfectly planned, and our guide was exceptional. Would highly recommend this package to anyone looking for an authentic experience.",
                },
                {
                  name: "David Thompson",
                  date: "15 May, 2025",
                  rating: 4,
                  comment:
                    "Great experience overall. The accommodations were comfortable and the itinerary was well-balanced. Only suggestion would be to allow more free time for personal exploration.",
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-0"
                  style={{ marginLeft: "50px", marginRight: "50px" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 flex-shrink-0" style={{ marginTop: "10px" }}>
          {/* Booking Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 sticky top-4" style={{ marginBottom: "50px", marginTop: "50px" }}>
            <div className="p-6">
              <div
                className="flex items-center justify-between mb-4"
                style={{ marginLeft: "50px", marginRight: "50px" }}
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800" style={{ marginTop: "10px" }}>
                  Package Price: ₹{packageDetails.price}
                  </h3>
                  <p className="text-sm text-black">per person</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      size={22}
                      className={
                        isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4" style={{ marginTop: "1px", marginBottom: "10px" }}>
                <div className="flex justify-between items-center mb-2" style={{ marginLeft: "50px", marginRight: "50px", marginTop: "10px" }}>
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium" style={{ color: "black" }}>
                    ₹{packageDetails.basePrice || packageDetails.price}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2" style={{ marginLeft: "50px", marginRight: "50px", marginBottom: "10px" }}>
                  <span style={{ color: "black" }}>Taxes & Fees</span>
                  <span className="font-medium" style={{ color: "black" }}>
                    ₹{packageDetails.taxes || Math.round(packageDetails.price * 0.18)}
                  </span>
                </div>
                {packageDetails.discount && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{packageDetails.discount}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleBooking}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" style={{ marginLeft: "115px", marginRight: "50px",padding:"10px 20px" } }
              >
                Book Now
              </button>
            </div>

            {/* Tour Guide */}
            <div className="bg-white p-6 border-t border-gray-200" style={{ marginLeft: "50px", marginRight: "50px", marginTop: "10px" }}>
              <h3 className="font-medium text-gray-800 mb-3">
                Your Tour Guide
              </h3>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                    alt="Tour Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                  <h5 className="font-medium text-gray-800" style={{ marginTop: "5px" }}>
                    {packageDetails.guideName || "Emily Chen"}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {packageDetails.guideExperience || "5+ years experience"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help Card */}
          <div className="bg-blue-600 rounded-xl shadow-md overflow-hidden p-6 mb-8 text-white" style={{ marginBottom: "20px" }}>
            <h3 className="font-bold text-xl mb-3" style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>Need Help?</h3>
            <p className="mb-4" style={{ marginLeft: "10px", marginRight: "10px" }}>
              Our travel experts are here to assist you with your booking and
              answer any questions.
            </p>
            <div className="flex items-center mb-3" style={{ marginLeft: "10px", marginRight: "10px" }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3" style={{ marginBottom: "10px", marginRight: "10px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm opacity-80" style={{ marginBottom: "5px", marginTop: "10px" }}>Call us at</p>
                <p className="font-medium" style={{ marginBottom: "10px", marginTop: "10px" }}>+91 12345 67890</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3" style={{ marginBottom: "10px", marginLeft: "10px", marginRight: "10px" }} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm opacity-80" style={{ marginBottom: "5px", marginTop: "10px" }}>Email us at</p>
                <p className="font-medium">support@destinex.com</p>
              </div>
            </div>
          </div>
        </div>
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
          <div className="mb-6 flex flex-col items-center" style={{ marginTop: "20px" }}>
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
              <button className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none text-left p-0">
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
            <p>Destinex © 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PackageDetail;