import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, getAuthToken } from "../../config/api.js";

const SavedSchemes = () => {
  const navigate = useNavigate();
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingStates, setRemovingStates] = useState({});

  useEffect(() => {
    const loadSavedSchemes = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await apiRequest('/users/me/saved-schemes');
        setSavedSchemes(response.data || []);
        setError(null);
      } catch (err) {
        setError(`Failed to load saved schemes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSavedSchemes();
  }, [navigate]);

  const handleRemoveSaved = async (schemeId) => {
    setRemovingStates(prev => ({ ...prev, [schemeId]: true }));
    
    try {
      await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'DELETE' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading saved schemes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 text-center border border-gray-700">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Error Loading Saved Schemes</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-gray-600"
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
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gray-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-300 font-medium text-sm mb-6 border border-gray-700">
              💾 Your Saved Schemes
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block text-gray-100">Saved Schemes</span>
              <span className="block text-gray-400">Your Personal Collection</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Here are all the government schemes you've saved for easy access. 
              Click on any scheme to view full details or remove it from your saved list.
            </p>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700 max-w-xs mx-auto">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-2xl font-bold text-gray-100">{savedSchemes.length}</div>
              <div className="text-sm text-gray-400">Saved Schemes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {savedSchemes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">💾</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">No Saved Schemes Yet</h3>
            <p className="text-gray-400 mb-6">
              Start exploring government schemes and save the ones that interest you.
            </p>
            <Link
              to="/schemes"
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-gray-600"
            >
              Browse All Schemes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedSchemes.map((scheme) => (
              <div
                key={scheme._id || scheme.id}
                className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 overflow-hidden group"
              >
                {/* Card Header - Subtle accent */}
                <div className="h-1 bg-gray-600"></div>
                
                <div className="p-6">
                  {/* Category Badge */}
                  {scheme.schemeCategory && (
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">{getCategoryIcon(scheme.schemeCategory)}</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                        {scheme.schemeCategory}
                      </span>
                      {scheme.level && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500">
                          {scheme.level}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-gray-200 transition-colors duration-200">
                    {scheme.scheme_name || scheme.schemeName || "No Name"}
                  </h3>

                  {/* Description */}
                  {scheme.details && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {scheme.details.length > 150 
                        ? `${scheme.details.substring(0, 150)}...`
                        : scheme.details
                      }
                    </p>
                  )}

                  {/* Tags */}
                  {scheme.tags && scheme.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {scheme.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                      {scheme.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-full border border-gray-500">
                          +{scheme.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/schemes/${scheme._id || scheme.id}`}
                      className="inline-flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform group-hover:scale-105 border border-gray-600"
                    >
                      <span className="mr-2">📄</span>
                      View Full Details
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                    
                    <button
                      onClick={() => handleRemoveSaved(scheme._id || scheme.id)}
                      disabled={removingStates[scheme._id || scheme.id]}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 border bg-red-700 hover:bg-red-600 text-gray-100 border-red-600 ${
                        removingStates[scheme._id || scheme.id] ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {removingStates[scheme._id || scheme.id] ? (
                        <span className="flex items-center justify-center">
                          <span className="loading loading-spinner loading-xs mr-2"></span>
                          Removing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">🗑️</span>
                          Remove from Saved
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSchemes;
