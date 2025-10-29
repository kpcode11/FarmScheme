import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api.js";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest, getAuthToken } from "../../config/api.js";

const SchemesList = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [savingStates, setSavingStates] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [limit, setLimit] = useState(10);

  // URL search params syncing for filters/search
  const [searchParams, setSearchParams] = useSearchParams();
  // Applied filter state (drives fetching)
  const [level, setLevel] = useState(searchParams.get("level") || "all");
  const [schemeCategory, setSchemeCategory] = useState(searchParams.get("schemeCategory") || "");
  const [tags, setTags] = useState(searchParams.get("tags") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt:desc");

  // UI input state (does not trigger fetching until Apply)
  const [uiLevel, setUiLevel] = useState(searchParams.get("level") || "all");
  const [uiSchemeCategory, setUiSchemeCategory] = useState(searchParams.get("schemeCategory") || "");
  const [uiTags, setUiTags] = useState(searchParams.get("tags") || "");
  const [uiQ, setUiQ] = useState(searchParams.get("q") || "");
  const [uiSort, setUiSort] = useState(searchParams.get("sort") || "createdAt:desc");

  // Initialize page/limit from URL once on mount
  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    if (!isNaN(pageParam)) setCurrentPage(pageParam);
    if (!isNaN(limitParam)) setLimit(limitParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved schemes for logged-in users
  useEffect(() => {
    const loadSavedSchemes = async () => {
      const token = getAuthToken();
      if (!token) return;
      
      try {
        const response = await apiRequest('/users/me/saved-schemes');
        const saved = response.data || [];
        const savedIds = new Set(saved.map(s => s._id || s.id));
        setSavedSchemes(savedIds);
      } catch (error) {
        console.error('Failed to load saved schemes:', error);
      }
    };

    loadSavedSchemes();
  }, []);

  const queryObject = useMemo(() => {
    const obj = { page: currentPage, limit };
    if (level && level !== "all") obj.level = level;
    if (schemeCategory) obj.schemeCategory = schemeCategory;
    if (tags) obj.tags = tags;
    if (q) obj.q = q;
    if (sort) obj.sort = sort;
    return obj;
  }, [currentPage, limit, level, schemeCategory, tags, q, sort]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(queryObject).toString();
        const response = await axios.get(`${API_BASE_URL}/schemes?${params}`);

        if (response.data && response.data.data && response.data.data.scheme) {
          setSchemes(response.data.data.scheme);
          setTotalPages(response.data.data.TotalPages || 0);
          setCurrentPage(response.data.data.CurrentPage || 1);
          setTotalSchemes(
            response.data.data.TotalSchemes ||
              response.data.data.TotalPages * limit
          );
        } else {
          setSchemes([]);
          setTotalPages(0);
          setTotalSchemes(0);
        }

        setError(null);
      } catch (err) {
        setError(`Failed to load schemes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [queryObject]);

  // Reflect applied filters to URL
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("page", String(currentPage));
    next.set("limit", String(limit));
    if (level && level !== "all") next.set("level", level);
    if (schemeCategory) next.set("schemeCategory", schemeCategory);
    if (tags) next.set("tags", tags);
    if (q) next.set("q", q);
    if (sort) next.set("sort", sort);
    setSearchParams(next, { replace: true });
  }, [currentPage, limit, level, schemeCategory, tags, q, sort, setSearchParams]);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  // Handle items per page change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLevel(uiLevel);
    setSchemeCategory(uiSchemeCategory);
    setTags(uiTags);
    setQ(uiQ);
    setSort(uiSort);
    setCurrentPage(1);
  };

  // Handle save/unsave scheme
  const handleSaveToggle = async (schemeId) => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setSavingStates(prev => ({ ...prev, [schemeId]: true }));
    
    try {
      const isCurrentlySaved = savedSchemes.has(schemeId);
      
      if (isCurrentlySaved) {
        await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'DELETE' });
        setSavedSchemes(prev => {
          const newSet = new Set(prev);
          newSet.delete(schemeId);
          return newSet;
        });
      } else {
        await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'POST' });
        setSavedSchemes(prev => new Set([...prev, schemeId]));
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setSavingStates(prev => ({ ...prev, [schemeId]: false }));
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = 5;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
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
      case 'insurance': return 'from-blue-500 to-blue-600';
      case 'education': return 'from-purple-500 to-purple-600';
      case 'healthcare': return 'from-red-500 to-pink-600';
      case 'housing': return 'from-orange-500 to-yellow-500';
      case 'employment': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading schemes...</p>
          <p className="text-gray-500">Please wait while we fetch the latest schemes for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 text-center border border-gray-700">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Oops! Something went wrong</h2>
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
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gray-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-300 font-medium text-sm mb-6 border border-gray-700">
              🇮🇳 Government Schemes Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block text-gray-100">Government Schemes</span>
              <span className="block text-gray-400">for Every Farmer</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover hundreds of government schemes designed to support farmers across India. 
              Find the right scheme for your needs with our advanced filtering system.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-gray-100">{totalSchemes || '500+'}</div>
                <div className="text-sm text-gray-400">Total Schemes</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
                <div className="text-2xl mb-1">🗺️</div>
                <div className="text-2xl font-bold text-gray-100">28</div>
                <div className="text-sm text-gray-400">States Covered</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-2xl font-bold text-gray-100">10+</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-2xl font-bold text-gray-100">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Advanced Search & Filters */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 mb-8 overflow-hidden">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center">
              <span className="mr-2">🔍</span>
              Find Your Perfect Scheme
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="search"
                  value={uiQ}
                  onChange={(e) => setUiQ(e.target.value)}
                  placeholder="Search schemes by name, description, or benefits..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-600 rounded-xl focus:border-gray-500 focus:outline-none transition-colors duration-200 bg-gray-700 text-gray-100 placeholder-gray-400"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="mr-1">🏛️</span>Level
                  </label>
                  <select
                    value={uiLevel}
                    onChange={(e) => setUiLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:border-gray-500 focus:outline-none bg-gray-700 text-gray-100"
                  >
                    <option value="all">All Levels</option>
                    <option value="State">State Level</option>
                    <option value="Central">Central Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="mr-1">📂</span>Category
                  </label>
                  <input
                    type="text"
                    value={uiSchemeCategory}
                    onChange={(e) => setUiSchemeCategory(e.target.value)}
                    placeholder="e.g. Agriculture"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:border-gray-500 focus:outline-none bg-gray-700 text-gray-100 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="mr-1">🏷️</span>Tags
                  </label>
                  <input
                    type="text"
                    value={uiTags}
                    onChange={(e) => setUiTags(e.target.value)}
                    placeholder="comma,separated,tags"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:border-gray-500 focus:outline-none bg-gray-700 text-gray-100 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="mr-1">🔄</span>Sort By
                  </label>
                  <select
                    value={uiSort}
                    onChange={(e) => setUiSort(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:border-gray-500 focus:outline-none bg-gray-700 text-gray-100"
                  >
                    <option value="createdAt:desc">Newest First</option>
                    <option value="createdAt:asc">Oldest First</option>
                    <option value="scheme_name:asc">Name A-Z</option>
                    <option value="scheme_name:desc">Name Z-A</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center border border-gray-600"
                >
                  <span className="mr-2">🔍</span>
                  Search Schemes
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setUiLevel("all");
                    setUiSchemeCategory("");
                    setUiTags("");
                    setUiQ("");
                    setUiSort("createdAt:desc");
                    setLevel("all");
                    setSchemeCategory("");
                    setTags("");
                    setQ("");
                    setSort("createdAt:desc");
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 border-2 border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-all duration-200 flex items-center justify-center bg-gray-800"
                >
                  <span className="mr-2">🗑️</span>
                  Clear Filters
                </button>
              </div>

              {/* Active Filters */}
              {(level !== "all" || schemeCategory || tags || q) && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm font-medium text-gray-300 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {level !== "all" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500">
                        Level: {level}
                      </span>
                    )}
                    {schemeCategory && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500">
                        Category: {schemeCategory}
                      </span>
                    )}
                    {tags && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500">
                        Tags: {tags}
                      </span>
                    )}
                    {q && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500">
                        Search: {q}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                {totalSchemes > 0 ? (
                  <>Found <span className="text-gray-300">{totalSchemes}</span> schemes matching your criteria</>
                ) : (
                  'No schemes found'
                )}
              </h3>
              {totalSchemes > 0 && (
                <p className="text-gray-400">
                  Showing {schemes.length} schemes on page {currentPage} of {totalPages}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-300">Show:</label>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="px-3 py-2 border border-gray-600 rounded-lg focus:border-gray-500 focus:outline-none bg-gray-700 text-gray-100"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        {schemes.length === 0 && !loading ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">No Schemes Found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or clear all filters to see more results.
            </p>
            <button
              onClick={() => {
                setUiLevel("all");
                setUiSchemeCategory("");
                setUiTags("");
                setUiQ("");
                setLevel("all");
                setSchemeCategory("");
                setTags("");
                setQ("");
                setCurrentPage(1);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-200 border border-gray-600"
            >
              View All Schemes
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
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
                      to={`/schemes/${scheme._id}`}
                      className="inline-flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform group-hover:scale-105 border border-gray-600"
                    >
                      <span className="mr-2">📄</span>
                      View Full Details
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                    
                    <button
                      onClick={() => handleSaveToggle(scheme._id)}
                      disabled={savingStates[scheme._id]}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                        savedSchemes.has(scheme._id)
                          ? 'bg-gray-600 text-gray-100 border-gray-500'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                      } ${savingStates[scheme._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {savingStates[scheme._id] ? (
                        <span className="flex items-center justify-center">
                          <span className="loading loading-spinner loading-xs mr-2"></span>
                          Saving...
                        </span>
                      ) : savedSchemes.has(scheme._id) ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">💾</span>
                          Saved
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">💾</span>
                          Save
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-100 transform hover:scale-105 border-gray-600'
                }`}
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 border ${
                      currentPage === pageNum
                        ? 'bg-gray-600 text-gray-100 shadow-lg transform scale-110 border-gray-500'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-100 transform hover:scale-105 border-gray-600'
                }`}
              >
                Next →
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-gray-400">
              Page {currentPage} of {totalPages} • Total {totalSchemes} schemes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesList;
