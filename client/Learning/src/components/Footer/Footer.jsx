"use client";
import React from 'react';

const FooterComponent = () => {
  const helplineNumbers = [
    { name: "Agriculture Helpline", number: "1800-180-1551" },
    { name: "PM-KISAN Support", number: "155261" },
    { name: "Crop Insurance", number: "1800-200-5350" }
  ];

  const quickLinks = [
    { name: "Government Portal", url: "#" },
    { name: "Scheme Guidelines", url: "#" },
    { name: "Document Checklist", url: "#" },
    { name: "FAQ", url: "#" }
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Farmer Sahayak</h3>
                <p className="text-sm text-gray-300">Government Scheme Assistant</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Empowering rural India by bridging the gap between farmers and government welfare schemes.
            </p>
          </div>

          {/* Helpline Numbers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Helpline Numbers</h4>
            <div className="space-y-3">
              {helplineNumbers.map((helpline, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium">{helpline.name}</p>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">📞</span>
                    <span className="text-sm text-gray-300">{helpline.number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                  <span className="ml-1">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm mr-2">✉️</span>
                <span className="text-sm text-gray-300">support@farmersahayak.gov.in</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">📍</span>
                <span className="text-sm text-gray-300">Ministry of Agriculture, New Delhi</span>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="bg-transparent border border-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm">
                Feedback & Support
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-gray-300">
              <span>Made with</span>
              <span className="mx-1 text-red-400">❤️</span>
              <span>for Indian Farmers</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <span>© 2024 Government of India</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
