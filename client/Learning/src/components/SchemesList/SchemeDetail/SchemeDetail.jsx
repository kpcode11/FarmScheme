import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isTtsSupported, speakText, stopSpeaking, speakViaCloud, getPreferredLangCode } from '../../../utils/tts.js';
import { apiRequest, getAuthToken } from '../../../config/api.js';

const splitIntoDocuments = (documentsText) => {
  if (!documentsText || typeof documentsText !== 'string') return [];
  const normalized = documentsText
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
    .replace(/\u2022/g, ' ')
    .replace(/\*/g, ' ')
    .trim();

  const parts = normalized
    .split(/\n|\.|;|,/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const seen = new Set();
  const unique = [];
  for (const p of parts) {
    const key = p.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }
  return unique;
};

const mapToDocObjects = (items) => {
  return items.map((text) => {
    const lower = text.toLowerCase();
    const optional = lower.includes('optional') || lower.includes('if applicable');
    return {
      name: text,
      required: !optional,
      description: ''
    };
  });
};

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [eligibilityQuestions, setEligibilityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [ttsTitlePlaying, setTtsTitlePlaying] = useState(false);
  const [ttsOverviewPlaying, setTtsOverviewPlaying] = useState(false);
  const [ttsBenefitsPlaying, setTtsBenefitsPlaying] = useState(false);
  const [ttsEligibilityPlaying, setTtsEligibilityPlaying] = useState(false);
  const [ttsApplicationPlaying, setTtsApplicationPlaying] = useState(false);
  const [ttsDocumentsPlaying, setTtsDocumentsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userDocs, setUserDocs] = useState([]);

  // Refs for scrolling to sections
  const overviewRef = useRef(null);
  const benefitsRef = useRef(null);
  const eligibilityRef = useRef(null);
  const applicationRef = useRef(null);
  const documentsRef = useRef(null);
  // Refs for grabbing translated (visible) text
  const titleTextRef = useRef(null);
  const overviewTextRef = useRef(null);
  const benefitsTextRef = useRef(null);
  const eligibilityTextRef = useRef(null);
  const applicationTextRef = useRef(null);
  const documentsTextRef = useRef(null);

  // Icons
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

  useEffect(() => {
    const fetchSchemeDetail = async () => {
      try {
        setLoading(true);
        console.log('Fetching scheme with ID:', schemeId);
        
        const response = await apiRequest(`/schemes/${schemeId}`);
        
        console.log('Scheme detail response:', response.data);
        
        if (response.data && response.data.data) {
          setScheme(response.data.data);
        } else {
          setError('Scheme not found');
        }
      } catch (err) {
        console.error('Error fetching scheme details:', err);
        setError(`Failed to load scheme details: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (schemeId) {
      fetchSchemeDetail();
    }
  }, [schemeId]);

  useEffect(() => {
    setTtsAvailable(isTtsSupported());
    // In some browsers voices load async
    if (isTtsSupported()) {
      const onVoices = () => {};
      window.speechSynthesis.onvoiceschanged = onVoices;
    }
  }, []);

  const handleSpeak = async (text, fromRef) => {
    let toRead = text;
    if (fromRef && fromRef.current) {
      const visible = fromRef.current.innerText || fromRef.current.textContent || "";
      if (visible && visible.trim().length > 0) toRead = visible.trim();
    }
    if (!toRead) return;
    try {
      if (isTtsSupported()) {
        speakText(toRead, getPreferredLangCode());
      } else {
        await speakViaCloud(toRead, { lang: getPreferredLangCode() });
      }
    } catch (e) {
      try {
        await speakViaCloud(toRead, { lang: getPreferredLangCode() });
      } catch (_) {}
    }
  };

  // Load user info for docs and saved state
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    (async () => {
      try {
        const me = await apiRequest('/users/me');
        setUserDocs(Array.isArray(me.data?.documents) ? me.data.documents : []);
        // check saved schemes
        const saved = await apiRequest('/users/me/saved-schemes');
        const arr = Array.isArray(saved.data) ? saved.data : [];
        setIsSaved(arr.some((s) => (s?._id || s?.id) === schemeId));
      } catch (e) {
        // ignore if unauthenticated
      }
    })();
  }, [schemeId]);

  // Handle tab click and scroll to section
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Scroll to the corresponding section
    switch (tabId) {
      case 'overview':
        overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'benefits':
        benefitsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'eligibility':
        eligibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'application':
        applicationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'documents':
        documentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      default:
        break;
    }
  };

  const loadEligibilityQuestions = async () => {
    if (!schemeId) return;
    try {
      setEligibilityLoading(true);
      setEligibilityResult(null);
      const resp = await apiRequest(`/schemes/${schemeId}/eligibility-questions`);
      const questions = resp?.data?.data?.questions || [];
      setEligibilityQuestions(questions);
      const initial = {};
      questions.forEach(q => { initial[q.key] = ''; });
      setAnswers(initial);
    } catch (e) {
      setEligibilityResult({ eligible: false, failures: [{ key: 'load', question: 'Load questions', reason: e.response?.data?.message || e.message }] });
    } finally {
      setEligibilityLoading(false);
    }
  };

  const submitEligibility = async () => {
    if (!schemeId) return;
    try {
      setEligibilityLoading(true);
      const resp = await apiRequest(`/schemes/${schemeId}/check-eligibility`, { method: 'POST', body: { answers } });
      setEligibilityResult(resp?.data?.data || { eligible: false, failures: [] });
    } catch (e) {
      setEligibilityResult({ eligible: false, failures: [{ key: 'submit', question: 'Submit answers', reason: e.response?.data?.message || e.message }] });
    } finally {
      setEligibilityLoading(false);
    }
  };

  // Navigate to dedicated eligibility page
  const handleCheckEligibility = () => {
    navigate(`/schemes/${schemeId}/eligibility`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <Link to="/schemes" className="btn btn-primary mt-4">
          Back to Schemes
        </Link>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <span>Scheme not found</span>
        </div>
        <Link to="/schemes" className="btn btn-primary mt-4">
          Back to Schemes
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'application', label: 'Application Process' },
    { id: 'documents', label: 'Required Documents' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><Link to="/" className="text-white">Home</Link></li>
            <li><Link to="/schemes" className="text-white">Schemes</Link></li>
            <li className="text-white">{scheme.scheme_name || scheme.schemeName}</li>
          </ul>
        </div>
        
        <div className="flex justify-between items-start mt-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 ref={titleTextRef} className="text-4xl font-bold mb-2 text-white">
                {scheme.scheme_name || scheme.schemeName || 'Scheme Details'}
              </h1>
              {ttsAvailable && (
                <button
                  className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                  title={ttsTitlePlaying ? "Stop" : "Read title"}
                  onClick={() => {
                    if (ttsTitlePlaying) {
                      stopSpeaking();
                      setTtsTitlePlaying(false);
                    } else {
                      handleSpeak(scheme.scheme_name || scheme.schemeName || 'Scheme Details', titleTextRef);
                      setTtsTitlePlaying(true);
                    }
                  }}
                >
                  {ttsTitlePlaying ? <StopIcon /> : <SpeakerIcon />}
                </button>
              )}
            </div>
            <p className="text-lg opacity-70 text-white">
              {scheme.schemeCategory} • {scheme.level} Level
            </p>
          </div>
          
          <div className="flex gap-2">
            <button className="btn btn-primary">
              Apply Now
            </button>
            <button
              className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
              disabled={saving}
              onClick={async () => {
                const token = getAuthToken();
                if (!token) {
                  navigate('/login');
                  return;
                }
                setSaving(true);
                try {
                  if (isSaved) {
                    await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'DELETE' });
                    setIsSaved(false);
                  } else {
                    await apiRequest(`/users/me/saved-schemes/${schemeId}`, { method: 'POST' });
                    setIsSaved(true);
                  }
                } catch (e) {
                  console.error('Save toggle failed', e);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              className="btn btn-accent"
              onClick={handleCheckEligibility}
              disabled={eligibilityLoading}
            >
              {eligibilityLoading ? 'Loading...' : 'Check Eligibility'}
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-0 z-10 bg-base-100 pt-4 pb-4 mb-8">
        <div className="tabs tabs-boxed">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* All Content in One Page */}
      <div className="space-y-8">
        
        {/* Overview Section */}
        <div ref={overviewRef} id="overview-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="card-title text-2xl">Overview</h2>
                {ttsAvailable && (
                  <>
                    <button
                      className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                      title={ttsOverviewPlaying ? "Stop" : "Read overview"}
                      onClick={() => {
                        if (ttsOverviewPlaying) {
                          stopSpeaking();
                          setTtsOverviewPlaying(false);
                        } else {
                          handleSpeak(scheme.details || 'No detailed description available.', overviewTextRef);
                          setTtsOverviewPlaying(true);
                        }
                      }}
                    >
                      {ttsOverviewPlaying ? <StopIcon /> : <SpeakerIcon />}
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-4">
                <p ref={overviewTextRef} className="text-white text-lg">{scheme.details || 'No detailed description available.'}</p>
                
                <div className="flex flex-wrap gap-2">
                  {scheme.schemeCategory && (
                    <div className="badge badge-primary badge-lg">{scheme.schemeCategory}</div>
                  )}
                  
                  {scheme.level && (
                    <div className="badge badge-secondary badge-lg">{scheme.level}</div>
                  )}
                  
                  {/* Display tags as badges */}
                  {scheme.tags && scheme.tags.length > 0 && (
                    <>
                      {scheme.tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline badge-accent">
                          #{tag}
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                {scheme.ministry && (
                  <div className="mt-4">
                    <span className="font-semibold text-white">Ministry: </span>
                    <span className="text-white">{scheme.ministry}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div ref={benefitsRef} id="benefits-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="card-title text-2xl">Benefits</h2>
                {scheme.benefits && (
                  <>
                    <button
                      className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                      title={ttsBenefitsPlaying ? "Stop" : "Read benefits"}
                      onClick={() => {
                        if (ttsBenefitsPlaying) {
                          stopSpeaking();
                          setTtsBenefitsPlaying(false);
                        } else {
                          handleSpeak(scheme.benefits, benefitsTextRef);
                          setTtsBenefitsPlaying(true);
                        }
                      }}
                    >
                      {ttsBenefitsPlaying ? <StopIcon /> : <SpeakerIcon />}
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-4">
                {scheme.benefits ? (
                  <p ref={benefitsTextRef} className="text-white text-lg">{scheme.benefits}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="badge badge-success">✓</div>
                      <div>
                        <h4 className="font-semibold text-white">Financial Support</h4>
                        <p className="text-sm opacity-70 text-white">Direct financial assistance for eligible farmers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="badge badge-success">✓</div>
                      <div>
                        <h4 className="font-semibold text-white">Subsidies</h4>
                        <p className="text-sm opacity-70 text-white">Government subsidies on agricultural equipment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="badge badge-success">✓</div>
                      <div>
                        <h4 className="font-semibold text-white">Training</h4>
                        <p className="text-sm opacity-70 text-white">Free training and skill development programs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="badge badge-success">✓</div>
                      <div>
                        <h4 className="font-semibold text-white">Insurance Coverage</h4>
                        <p className="text-sm opacity-70 text-white">Crop insurance and risk coverage</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Section */}
        <div ref={eligibilityRef} id="eligibility-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="card-title text-2xl">Eligibility Criteria</h2>
                  {scheme.eligibility && (
                    <>
                      <button
                        className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                        title={ttsEligibilityPlaying ? "Stop" : "Read eligibility"}
                        onClick={() => {
                          if (ttsEligibilityPlaying) {
                            stopSpeaking();
                            setTtsEligibilityPlaying(false);
                          } else {
                            handleSpeak(scheme.eligibility, eligibilityTextRef);
                            setTtsEligibilityPlaying(true);
                          }
                        }}
                      >
                        {ttsEligibilityPlaying ? <StopIcon /> : <SpeakerIcon />}
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={handleCheckEligibility}
                  disabled={eligibilityLoading}
                >
                  {eligibilityLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      ✓ Check Eligibility
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-4">
                {(
                  <>
                    {scheme.eligibility && (
                      <p ref={eligibilityTextRef} className="text-white text-lg">{scheme.eligibility}</p>
                    )}
                    <div className="alert">
                      <div className="flex flex-col gap-2">
                        <span className="text-white">Click the "Check Eligibility" button to answer a few yes/no questions and instantly know your eligibility status.</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility modal replaced by dedicated page */}

        {/* Application Process Section */}
        <div ref={applicationRef} id="application-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="card-title text-2xl">Application Process</h2>
                {scheme.application && (
                  <>
                    <button
                      className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                      title={ttsApplicationPlaying ? "Stop" : "Read application process"}
                      onClick={() => {
                        if (ttsApplicationPlaying) {
                          stopSpeaking();
                          setTtsApplicationPlaying(false);
                        } else {
                          handleSpeak(scheme.application, applicationTextRef);
                          setTtsApplicationPlaying(true);
                        }
                      }}
                    >
                      {ttsApplicationPlaying ? <StopIcon /> : <SpeakerIcon />}
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-4">
                {scheme.application ? (
                  <p ref={applicationTextRef} className="text-white text-lg">{scheme.application}</p>
                ) : (
                  <div className="space-y-3">
                    <div className="alert alert-info">
                      <span>Check if you meet the following criteria:</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white">Must be a registered farmer with valid documents</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white">Age between 18-60 years</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white">Must have valid land ownership documents</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white">Annual income below specified limit</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white">Must belong to eligible category (if applicable)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents Section */}
        <div ref={documentsRef} id="documents-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="card-title text-2xl">Required Documents</h2>
                {scheme.documents && (
                  <>
                    <button
                      className="btn btn-ghost btn-xs btn-circle text-gray-200 hover:text-white"
                      title={ttsDocumentsPlaying ? "Stop" : "Read documents"}
                      onClick={() => {
                        if (ttsDocumentsPlaying) {
                          stopSpeaking();
                          setTtsDocumentsPlaying(false);
                        } else {
                          handleSpeak(scheme.documents, documentsTextRef);
                          setTtsDocumentsPlaying(true);
                        }
                      }}
                    >
                      {ttsDocumentsPlaying ? <StopIcon /> : <SpeakerIcon />}
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-4">
                <div className="alert alert-warning">
                  <span>Please ensure all documents are valid and clearly readable</span>
                </div>
                {(() => {
                  const parsed = mapToDocObjects(splitIntoDocuments(scheme?.documents));
                  const normalize = (s) => (s || '').toLowerCase();
                  const uploadedTypes = (userDocs || []).map((d) => normalize(d.type));
                  const isUploadedMatch = (docName) => {
                    const n = normalize(docName);
                    return uploadedTypes.some((t) => n.includes(t) || t.includes(n));
                  };
                  return (
                    <div ref={documentsTextRef} className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-white">Document</th>
                            <th className="text-white">Required</th>
                            <th className="text-white">Uploaded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(parsed.length > 0 ? parsed : [
                            { name: 'No documents information available for this scheme.', required: false, description: '' }
                          ]).map((doc, idx) => (
                            <tr key={idx}>
                              <td className="font-medium text-white">{doc.name}</td>
                              <td>
                                <div className={`badge ${doc.required ? 'badge-error' : 'badge-warning'}`}>
                                  {doc.required ? 'Required' : 'Optional'}
                                </div>
                              </td>
                              <td>
                                {isUploadedMatch(doc.name) ? (
                                  <div className="badge badge-success">Yes</div>
                                ) : (
                                  <div className="badge">No</div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Helpline Number</h4>
                <p className="text-primary text-lg">1800-XXX-XXXX</p>
                <p className="text-sm opacity-70 text-white">Toll-free, 24/7 support</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Email Support</h4>
                <p className="text-primary text-lg">support@farmerschemes.gov.in</p>
                <p className="text-sm opacity-70 text-white">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="mt-8">
        <div className="collapse collapse-arrow">
          <input type="checkbox" /> 
          <div className="collapse-title text-xl font-medium text-white">
            Debug Info
          </div>
          <div className="collapse-content"> 
            <pre className="bg-base-200 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(scheme, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;