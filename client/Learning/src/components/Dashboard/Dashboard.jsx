import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroFarmers from './hero-farmers.jpg';

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const stats = [
    { label: "Active Schemes", value: "400+", icon: "📊", color: "bg-blue-500" },
    { label: "Farmers Helped", value: "10L+", icon: "👥", color: "bg-green-500" },
    { label: "States Covered", value: "28", icon: "🗺️", color: "bg-orange-500" },
    { label: "Success Rate", value: "95%", icon: "✅", color: "bg-purple-500" }
  ];

  const quickActions = [
    {
      title: "Browse Schemes",
      description: "Explore schemes for farmers",
      icon: "📚",
      link: "/schemes",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Check Eligibility",
      description: "Quick eligibility assessment",
      icon: "✔️",
      link: "/schemes",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Find Help Centers",
      description: "Locate nearby assistance centers",
      icon: "📍",
      link: "/maps",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Contact Support",
      description: "Get help and guidance",
      icon: "📞",
      link: "/schemes",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const featuredSchemes = [
    {
      name: "PM-KISAN Samman Nidhi",
      description: "Direct income support to farmers",
      amount: "₹6,000/year",
      category: "Income Support",
      status: "Active",
      icon: "💰"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme",
      amount: "Up to ₹2L",
      category: "Insurance",
      status: "Active",
      icon: "🛡️"
    },
    {
      name: "Soil Health Card Scheme",
      description: "Soil testing and health cards",
      amount: "Free",
      category: "Advisory",
      status: "Active",
      icon: "🌱"
    }
  ];

  const testimonials = [
    {
      name: "राम प्रसाद शर्मा",
      location: "उत्तर प्रदेश",
      text: "इस प्लेटफॉर्म से मुझे सही योजना मिली और मेरी फसल का बीमा हो गया।",
      avatar: "👨‍🌾"
    },
    {
      name: "सुनीता देवी",
      location: "बिहार",
      text: "बहुत आसान है इस्तेमाल करना। सरकारी योजनाओं की पूरी जानकारी मिल जाती है।",
      avatar: "👩‍🌾"
    },
    {
      name: "मुकेश कुमार",
      location: "पंजाब",
      text: "PM-KISAN योजना के लिए आवेदन करने में बहुत मदद मिली।",
      avatar: "👨‍🌾"
    }
  ];

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm shadow-lg">
                  <span className="mr-2">🇮🇳</span>
                  भारत सरकार की पहल
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="block">Digital Support For</span>
                  <span className="block text-yellow-300 mt-2">Government Schemes</span>
                </h1>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                  किसानों के लिए बनी सरकारी योजनाओं की जानकारी, आवेदन प्रक्रिया और सहायता - 
                  सब कुछ एक ही जगह। <span className="font-semibold">आसान भाषा में, मुफ्त सेवा।</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/schemes"
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span>Check Schemes</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link 
                  to="/maps"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Help Centers
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
                  >
                    <div className="text-3xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>{stat.icon}</div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src={heroFarmers}
                  alt="Indian farmers in field"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-sm opacity-90 mb-1">भारतीय किसान</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    हमारे अन्नदाता 
                    <span className="text-2xl">🙏</span>
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              {/* <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold shadow-xl animate-bounce">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>सत्यापित</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              तेज़ एक्सेस
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              आज ही अपनी जरूरत के अनुसार विकल्प चुनें
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.link || "/schemes"} 
                className="group"
              >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 overflow-hidden h-full">
                  {/* Gradient top bar */}
                  <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                  
                  <div className="p-8 text-center">
                    <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300 inline-block">
                      {action.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              हम क्यों बेहतर हैं
            </h2>
            <p className="text-xl text-gray-600">
              किसानों के लिए विशेष सुविधाएं
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">बहुभाषी समर्थन</h3>
              <p className="text-gray-600">10+ भारतीय भाषाओं में उपलब्ध</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">सुरक्षित और विश्वसनीय</h3>
              <p className="text-gray-600">सरकारी योजनाओं की आधिकारिक जानकारी</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:rotate-6 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">पूरी तरह मुफ्त</h3>
              <p className="text-gray-600">कोई शुल्क नहीं, कोई छिपी लागत नहीं</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
