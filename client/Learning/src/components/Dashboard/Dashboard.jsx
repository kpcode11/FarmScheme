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
    //   link: "/schemes",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Check Eligibility",
      description: "Quick eligibility assessment",
      icon: "✔️",
    //   link: "/eligibility",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Find Help Centers",
      description: "Locate nearby assistance centers",
      icon: "📍",
    //   link: "/help-centers",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Contact Support",
      description: "Get help and guidance",
      icon: "📞",
    //   link: "/support",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm">
                  🇮🇳 भारत सरकार की पहल
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="block">सरकारी योजनाओं का</span>
                  <span className="block text-yellow-300">डिजिटल सहारा</span>
                </h1>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                  किसानों के लिए बनी सरकारी योजनाओं की जानकारी, आवेदन प्रक्रिया और सहायता - 
                  सब कुछ एक ही जगह। आसान भाषा में, मुफ्त सेवा。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/schemes"
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Check Schemes
                  <span className="ml-2">→</span>
                </Link>
                
                <Link 
                  to="/maps"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full border border-white/30 transition-all duration-300"
                >
                  Check Help Centers
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img
                  src={heroFarmers}
                  alt="Indian farmers in field"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-90">भारतीय किसान</p>
                  <p className="font-semibold">हमारे अन्नदाता 🙏</p>
                </div>
              </div>

              {/* Floating Elements */}
              {/* <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-4 rounded-lg font-bold animate-bounce">
                ✓ सत्यापित
              </div> */}
              
              {/* <div className="absolute -bottom-4 -left-4 bg-white text-green-600 p-4 rounded-lg font-bold animate-bounce" style={{ animationDelay: '0.5s' }}>
                🏛️ सरकारी
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600">
              आज ही अपनी जरूरत के अनुसार विकल्प चुनें
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">लोकप्रिय योजनाएं</h2>
              <p className="text-gray-600">सबसे ज्यादा उपयोग की जाने वाली योजनाएं</p>
            </div>
            <Link 
              to="/schemes" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              सभी योजनाएं देखें
              <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredSchemes.map((scheme, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{scheme.icon}</span>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {scheme.category}
                      </span>
                      <div className="text-2xl font-bold text-green-600 mt-1">{scheme.amount}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{scheme.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">स्थिति: {scheme.status}</span>
                    <Link 
                      to="/schemes" 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      विवरण देखें
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}

      {/* Call to Action */}
      {/* <section className="py-16 bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            अभी शुरू करें अपनी योजना का सफर
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            हजारों किसान भाई पहले से ही सरकारी योजनाओं का लाभ उठा रहे हैं। आप भी जुड़ें!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/schemes"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              योजना खोजें
              <span className="ml-2">🔍</span>
            </Link>
            <Link 
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full border-2 border-gray-300 transition-all duration-300"
            >
              पंजीकरण करें
              <span className="ml-2">📝</span>
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Dashboard;
