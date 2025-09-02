"use client";
import React from 'react';

function FooterComponent() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/vite.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Government Schemes Portal</span>
            </div>
            <p className="text-gray-300">
              Your trusted platform for accessing government schemes and benefits.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/schemes" className="text-gray-300 hover:text-white">All Schemes</a></li>
              <li><a href="/state" className="text-gray-300 hover:text-white">State Schemes</a></li>
              <li><a href="/central" className="text-gray-300 hover:text-white">Central Schemes</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 Government Schemes Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;