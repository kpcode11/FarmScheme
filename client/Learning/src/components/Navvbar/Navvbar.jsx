import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Link as RouterLink } from "react-router-dom";

function Navvbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Saved Icon SVG
  const SavedIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );

  // Profile Icon SVG
  const ProfileIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  // User Menu Icon SVG
  const MenuIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDropdownOpen(false);
  };

  return (
    <Navbar fluid rounded className="bg-gray-800 border-b border-gray-700">
      <NavbarBrand as={Link} to="/" className="hover:opacity-80 transition-opacity">
        <span className="self-center whitespace-nowrap text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          🌾 Farmer Sahayak
        </span>
      </NavbarBrand>
      
      <div className="flex md:order-2 items-center gap-3">
        {/* Language Selector */}
        <select
          className="select select-bordered select-sm bg-gray-700 text-gray-100 border-gray-600 hover:border-gray-500 focus:border-gray-500 transition-colors"
          onChange={(e) => {
            const lang = e.target.value;
            if (window.setLanguage) window.setLanguage(lang);
            if (window.setAppLanguage) window.setAppLanguage(lang);
          }}
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
          <option value="te">తెలుగు</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="ur">اردو</option>
          <option value="gu">ગુજરાતી</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="or">ଓଡ଼ିଆ</option>
          <option value="as">অসমীয়া</option>
        </select>

        {user ? (
          <div className="flex items-center gap-2">
            {/* Saved Schemes Button */}
            <button
              onClick={() => navigate("/saved-schemes")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === "/saved-schemes"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white border border-gray-600"
              }`}
              title="View Saved Schemes"
            >
              <SavedIcon />
              <span className="hidden sm:inline">Saved</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  profileDropdownOpen
                    ? "bg-gray-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white border border-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline text-sm">
                    {user.name?.split(" ")[0] || "User"}
                  </span>
                  <MenuIcon />
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-semibold text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email || ""}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ProfileIcon />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Button
            as={RouterLink}
            to="/login"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 transition-all duration-200"
          >
            Login
          </Button>
        )}
        <NavbarToggle />
      </div>
      
      <NavbarCollapse className="bg-gray-800 md:bg-transparent">
        <NavbarLink
          as={Link}
          to="/"
          active={location.pathname === "/"}
          className={`${
            location.pathname === "/"
              ? "text-emerald-400 font-semibold"
              : "text-gray-300 hover:text-white"
          } transition-colors`}
        >
          Home
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/schemes"
          active={location.pathname === "/schemes"}
          className={`${
            location.pathname === "/schemes"
              ? "text-emerald-400 font-semibold"
              : "text-gray-300 hover:text-white"
          } transition-colors`}
        >
          Schemes
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/maps"
          active={location.pathname === "/maps"}
          className={`${
            location.pathname === "/maps"
              ? "text-emerald-400 font-semibold"
              : "text-gray-300 hover:text-white"
          } transition-colors`}
        >
          Help-Centers
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Navvbar;
