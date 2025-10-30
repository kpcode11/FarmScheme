import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api.js";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest, getAuthToken } from "../../config/api.js";
import { isTtsSupported, speakText, stopSpeaking, speakViaCloud, getPreferredLangCode } from "../../utils/tts.js";

// Icon components defined outside to prevent re-render issues
const SavedIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
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

const SpeakerIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H7L11 6V18L7 14H4V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.54 8.46C16.4779 9.39788 17.0054 10.6699 17.0054 12C17.0054 13.3301 16.4779 14.6021 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.07 5.93C19.9377 7.79766 20.9974 10.337 20.9974 13C20.9974 15.663 19.9377 18.2023 18.07 20.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StopIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SchemesList = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [savingStates, setSavingStates] = useState({});
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [ttsPlayingMap, setTtsPlayingMap] = useState({});
  // Refs to extract translated (visible) text per card
  const titleRefs = React.useRef({});
  const summaryRefs = React.useRef({});

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

  // Init TTS availability
  useEffect(() => {
    setTtsAvailable(isTtsSupported());
    if (isTtsSupported()) {
      const onVoices = () => {};
      window.speechSynthesis.onvoiceschanged = onVoices;
    }
  }, []);

  const handleSpeak = async (text) => {
    if (!text) return;
    try {
      if (isTtsSupported()) {
        speakText(text, getPreferredLangCode());
      } else {
        await speakViaCloud(text, { lang: getPreferredLangCode() });
      }
    } catch (e) {
      try {
        await speakViaCloud(text, { lang: getPreferredLangCode() });
      } catch (_) {}
    }
  };

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
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-sm mb-6 border border-blue-500/50 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Government Schemes Portal
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Government Schemes</span>
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">for Every Farmer</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 font-light">
              Discover hundreds of government schemes designed to support farmers across India. 
              Find the right scheme for your needs with our advanced filtering system.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">{totalSchemes || '500+'}</div>
                <div className="text-sm text-gray-300 font-medium">Total Schemes</div>
              </div>
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2">🗺️</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">28</div>
                <div className="text-sm text-gray-300 font-medium">States Covered</div>
              </div>
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">10+</div>
                <div className="text-sm text-gray-300 font-medium">Categories</div>
              </div>
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">95%</div>
                <div className="text-sm text-gray-300 font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Advanced Search & Filters */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-5 border-b border-gray-600">
            <h2 className="text-2xl font-bold text-gray-100 flex items-center">
              <svg className="w-7 h-7 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Your Perfect Scheme
            </h2>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  value={uiQ}
                  onChange={(e) => setUiQ(e.target.value)}
                  placeholder="Search schemes by name, description, or benefits..."
                  className="w-full pl-14 pr-4 py-5 text-lg border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 bg-gray-700/50 text-gray-100 placeholder-gray-400 backdrop-blur-sm"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-300 mb-2.5">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Level
                  </label>
                  <div className="relative">
                    <select
                      value={uiLevel}
                      onChange={(e) => setUiLevel(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-gray-700/50 text-gray-100 appearance-none cursor-pointer transition-all duration-200 backdrop-blur-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="State">🏢 State Level</option>
                      <option value="Central">🏛️ Central Level</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-300 mb-2.5">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Category
                  </label>
                  <input
                    type="text"
                    value={uiSchemeCategory}
                    onChange={(e) => setUiSchemeCategory(e.target.value)}
                    placeholder="e.g. Agriculture, Insurance"
                    className="w-full px-4 py-3.5 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-gray-700/50 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-300 mb-2.5">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Tags
                  </label>
                  <input
                    type="text"
                    value={uiTags}
                    onChange={(e) => setUiTags(e.target.value)}
                    placeholder="comma,separated,tags"
                    className="w-full px-4 py-3.5 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-gray-700/50 text-gray-100 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-300 mb-2.5">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                    </svg>
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={uiSort}
                      onChange={(e) => setUiSort(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-gray-700/50 text-gray-100 appearance-none cursor-pointer transition-all duration-200 backdrop-blur-sm"
                    >
                      <option value="createdAt:desc">📅 Newest First</option>
                      <option value="createdAt:asc">📅 Oldest First</option>
                      <option value="scheme_name:asc">🔤 Name A-Z</option>
                      <option value="scheme_name:desc">🔤 Name Z-A</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center shadow-lg hover:shadow-xl border border-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                  className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Clear Filters
                </button>
              </div>

              {/* Active Filters */}
              {(level !== "all" || schemeCategory || tags || q) && (
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl p-5 border border-gray-600 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-gray-200 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Active Filters:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {level !== "all" && (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-500 shadow-md">
                        Level: {level}
                      </span>
                    )}
                    {schemeCategory && (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-500 shadow-md">
                        Category: {schemeCategory}
                      </span>
                    )}
                    {tags && (
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-500 shadow-md">
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

                  {/* Title with TTS */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3
                      ref={(el) => { if (el) titleRefs.current[scheme._id] = el; }}
                      className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-200 leading-tight"
                    >
                      {scheme.scheme_name || scheme.schemeName || "No Name"}
                    </h3>
                    {ttsAvailable && (
                      <button
                        className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 border border-gray-600 flex-shrink-0"
                        title={ttsPlayingMap[scheme._id] ? "Stop" : "Read name and summary"}
                        onClick={() => {
                          const isPlaying = !!ttsPlayingMap[scheme._id];
                          if (isPlaying) {
                            stopSpeaking();
                            setTtsPlayingMap((s) => ({ ...s, [scheme._id]: false }));
                          } else {
                            const nameVis = titleRefs.current[scheme._id]?.innerText || titleRefs.current[scheme._id]?.textContent || (scheme.scheme_name || scheme.schemeName || "");
                            const sumVis = summaryRefs.current[scheme._id]?.innerText || summaryRefs.current[scheme._id]?.textContent || (scheme.details || "");
                            const summary = (sumVis || "").trim().slice(0, 220);
                            const text = summary ? `${nameVis}. ${summary}` : nameVis;
                            handleSpeak(text);
                            setTtsPlayingMap((s) => ({ ...s, [scheme._id]: true }));
                          }
                        }}
                      >
                        {ttsPlayingMap[scheme._id] ? <StopIcon /> : <SpeakerIcon />}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  {scheme.details && (
                    <p
                      ref={(el) => { if (el) summaryRefs.current[scheme._id] = el; }}
                      className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed"
                    >
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
                      to={`/schemes/${scheme._id}`}
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
                      onClick={() => handleSaveToggle(scheme._id)}
                      disabled={savingStates[scheme._id]}
                      className={`w-full px-5 py-3 rounded-xl font-semibold transition-all duration-200 border flex items-center justify-center ${
                        savedSchemes.has(scheme._id)
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg'
                          : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-600 hover:border-gray-500'
                      } ${savingStates[scheme._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {savingStates[scheme._id] ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : savedSchemes.has(scheme._id) ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          Saved
                        </>
                      ) : (
                        <>
                          <SavedIcon className="w-5 h-5 mr-2" />
                          Save Scheme
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 flex items-center gap-2 ${
                  currentPage === 1
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border-gray-600'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white transform hover:scale-105 border-gray-600 shadow-lg hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-3">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 border-2 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl transform scale-110 border-blue-500'
                        : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500'
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
                className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 flex items-center gap-2 ${
                  currentPage === totalPages
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border-gray-600'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white transform hover:scale-105 border-gray-600 shadow-lg hover:shadow-xl'
                }`}
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-6 text-gray-300 font-medium">
              Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span> • 
              Total <span className="text-white font-bold">{totalSchemes}</span> schemes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesList;
