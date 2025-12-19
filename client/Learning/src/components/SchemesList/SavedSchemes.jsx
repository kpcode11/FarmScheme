import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react';
import { apiRequest, getAuthToken } from "../../config/api.js";

const SavedSchemes = () => {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingStates, setRemovingStates] = useState({});

  useEffect(() => {
    const loadSavedSchemes = async () => {
      if (!isSignedIn) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();
        const response = await apiRequest('/users/me/saved-schemes', { clerkToken: token });
        setSavedSchemes(response.data || []);
        setError(null);
      } catch (err) {
        setError(`Failed to load saved schemes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSavedSchemes();
  }, [navigate, isSignedIn, getToken]);

  const handleRemoveSaved = async (schemeId) => {
    setRemovingStates(prev => ({ ...prev, [schemeId]: true }));
    
    try {
      const token = await getToken();
      await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'DELETE', clerkToken: token });
      setSavedSchemes(prev => prev.filter(scheme => (scheme._id || scheme.id) !== schemeId));
    } catch (error) {
      console.error('Failed to remove saved scheme:', error);
    } finally {
      setRemovingStates(prev => ({ ...prev, [schemeId]: false }));
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'agriculture': return '🌾';
      case 'insurance': return '🛡️';
      case 'education': return '📚';
      case 'healthcare': return '🏥';
      case 'housing': return '🏠';
      case 'employment': return '💼';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'agriculture': return 'from-green-500 to-emerald-600';
      case 'insurance': return 'from-blue-500 to-cyan-600';
      case 'education': return 'from-purple-500 to-pink-600';
      case 'healthcare': return 'from-red-500 to-rose-600';
      case 'housing': return 'from-orange-500 to-amber-500';
      case 'employment': return 'from-indigo-500 to-blue-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'central': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'state': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/50 rounded-full mb-6">
            <svg className="animate-spin h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-300">Loading your saved schemes...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-red-500/30">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
            <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Error Loading Schemes</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-sm mb-6 border border-blue-500/50 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Your Saved Collection
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Saved Schemes</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quick Access Anytime</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 font-light">
              All your bookmarked government schemes in one place. 
              Easy to find, ready to apply.
            </p>

            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-600 max-w-xs mx-auto shadow-xl">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                {savedSchemes.length}
              </div>
              <div className="text-sm text-gray-300 font-medium">Saved Schemes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {savedSchemes.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-12 text-center border border-gray-700">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-700/50 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-100 mb-3">No Saved Schemes Yet</h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Start exploring government schemes and bookmark the ones that matter to you.
            </p>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse All Schemes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedSchemes.map((scheme) => (
              <div
                key={scheme._id || scheme.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 overflow-hidden group relative"
              >
                {/* Gradient Accent Bar */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(scheme.schemeCategory)}`}></div>
                
                <div className="p-6">
                  {/* Category & Level Badges */}
                  {scheme.schemeCategory && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getCategoryColor(scheme.schemeCategory)} shadow-lg`}>
                        <span className="text-2xl">{getCategoryIcon(scheme.schemeCategory)}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-700/80 text-gray-200 border border-gray-600 backdrop-blur-sm">
                          {scheme.schemeCategory}
                        </span>
                        {scheme.level && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getLevelColor(scheme.level)}`}>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                            {scheme.level}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-200 leading-tight mb-3">
                    {scheme.scheme_name || scheme.schemeName || "No Name"}
                  </h3>

                  {/* Description */}
                  {scheme.details && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {scheme.details.length > 150 
                        ? `${scheme.details.substring(0, 150)}...`
                        : scheme.details
                      }
                    </p>
                  )}

                  {/* Tags */}
                  {scheme.tags && scheme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {scheme.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 text-xs font-medium rounded-full border border-gray-600 hover:border-gray-500 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          {tag}
                        </span>
                      ))}
                      {scheme.tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-700/50 text-gray-400 text-xs font-medium rounded-full border border-gray-600">
                          +{scheme.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2.5">
                    <Link
                      to={`/schemes/${scheme._id || scheme.id}`}
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 transform group-hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Details
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    
                    <button
                      onClick={() => handleRemoveSaved(scheme._id || scheme.id)}
                      disabled={removingStates[scheme._id || scheme.id]}
                      className={`w-full px-5 py-3 rounded-xl font-semibold transition-all duration-200 border flex items-center justify-center ${
                        removingStates[scheme._id || scheme.id]
                          ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {removingStates[scheme._id || scheme.id] ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Removing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove from Saved
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSchemes;
