import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../config/api.js";
import { useToast } from "../../context/ToastContext.jsx";

function ForgotPassword() {
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      pushToast({ type: "error", message: "Please enter your email address" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      pushToast({ type: "error", message: "Please enter a valid email address" });
      return;
    }
    
    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", { 
        method: "POST", 
        body: { email } 
      });
      setEmailSent(true);
      pushToast({ 
        type: "success", 
        message: "Password reset link sent to your email" 
      });
    } catch (err) {
      pushToast({ 
        type: "error", 
        message: err.message || "Failed to send reset email" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Success Card */}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Check Your Email!</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              We've sent a password reset link to <span className="font-semibold text-white">{email}</span>. 
              Please check your inbox and follow the instructions.
            </p>
            <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-sm text-white/70">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
            </div>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/20 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password?</h1>
            <p className="text-white/80 text-sm">
              No worries! Enter your email and we'll send you reset instructions
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter your email address" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-white/70">
                  We'll send a password reset link to this email
                </p>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                disabled={loading} 
                type="submit"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Link...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link 
                className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors duration-200 group"
                to="/login"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Help Note */}
        <div className="mt-6 text-center text-white/80 text-sm bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Need Help?</span>
          </div>
          <p className="text-xs">
            If you don't receive an email, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
