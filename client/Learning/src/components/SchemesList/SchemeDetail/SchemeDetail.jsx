import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Refs for scrolling to sections
  const overviewRef = useRef(null);
  const benefitsRef = useRef(null);
  const eligibilityRef = useRef(null);
  const applicationRef = useRef(null);
  const documentsRef = useRef(null);

  useEffect(() => {
    const fetchSchemeDetail = async () => {
      try {
        setLoading(true);
        console.log('Fetching scheme with ID:', schemeId);
        
        const response = await axios.get(`http://localhost:8001/api/v1/schemes/${schemeId}`);
        
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
            <h1 className="text-4xl font-bold mb-2 text-white">
              {scheme.scheme_name || scheme.schemeName || 'Scheme Details'}
            </h1>
            <p className="text-lg opacity-70 text-white">
              {scheme.schemeCategory} • {scheme.level} Level
            </p>
          </div>
          
          <div className="flex gap-2">
            <button className="btn btn-primary">
              Apply Now
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
              <h2 className="card-title text-2xl mb-4">Overview</h2>
              <div className="space-y-4">
                <p className="text-white text-lg">{scheme.details || 'No detailed description available.'}</p>
                
                <div className="flex gap-2">
                  {scheme.schemeCategory && (
                    <div className="badge badge-primary badge-lg">{scheme.schemeCategory}</div>
                  )}
                  
                  {scheme.level && (
                    <div className="badge badge-secondary badge-lg">{scheme.level}</div>
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
              <h2 className="card-title text-2xl mb-4">Benefits</h2>
              <div className="space-y-4">
                {scheme.benefits ? (
                  <p className="text-white text-lg">{scheme.benefits}</p>
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
              <h2 className="card-title text-2xl mb-4">Eligibility Criteria</h2>
              <div className="space-y-4">
                {scheme.eligibility ? (
                  <p className="text-white text-lg">{scheme.eligibility}</p>
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

        {/* Application Process Section */}
        <div ref={applicationRef} id="eligibility-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Application Process</h2>
              <div className="space-y-4">
                {scheme.eligibility ? (
                  <p className="text-white text-lg">{scheme.application}</p>
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
        {/* <div ref={applicationRef} id="application-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Application Process</h2>
              <div className="space-y-6">
                <div className="steps steps-vertical lg:steps-horizontal">
                  <div className="step step-primary">Check Eligibility</div>
                  <div className="step step-primary">Gather Documents</div>
                  <div className="step step-primary">Fill Application</div>
                  <div className="step step-primary">Submit Application</div>
                  <div className="step">Track Status</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Check Eligibility</h4>
                      <p className="text-sm opacity-70 text-white">Verify that you meet all eligibility criteria before proceeding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Gather Documents</h4>
                      <p className="text-sm opacity-70 text-white">Collect all required documents and certificates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Fill Application</h4>
                      <p className="text-sm opacity-70 text-white">Complete the application form online or offline</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Submit Application</h4>
                      <p className="text-sm opacity-70 text-white">Submit your application with all required documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-400 text-gray-800 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Track Status</h4>
                      <p className="text-sm opacity-70 text-white">Monitor your application status online</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button className="btn btn-primary btn-lg">
                    Start Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Required Documents Section */}
        <div ref={documentsRef} id="documents-section" className="scroll-mt-32">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Required Documents</h2>
              <div className="space-y-4">
                <div className="alert alert-warning">
                  <span>Please ensure all documents are valid and clearly readable</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-white">Document</th>
                        <th className="text-white">Required</th>
                        <th className="text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-medium text-white">Aadhaar Card</td>
                        <td><div className="badge badge-error">Required</div></td>
                        <td className="text-sm opacity-70 text-white">Valid Aadhaar card for identity verification</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-white">Land Ownership Documents</td>
                        <td><div className="badge badge-error">Required</div></td>
                        <td className="text-sm opacity-70 text-white">Revenue records, patta, or land title documents</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-white">Bank Account Details</td>
                        <td><div className="badge badge-error">Required</div></td>
                        <td className="text-sm opacity-70 text-white">Bank passbook or statement for fund transfer</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-white">Income Certificate</td>
                        <td><div className="badge badge-error">Required</div></td>
                        <td className="text-sm opacity-70 text-white">Certificate showing annual income</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-white">Caste Certificate</td>
                        <td><div className="badge badge-warning">Optional</div></td>
                        <td className="text-sm opacity-70 text-white">If applicable for reserved category benefits</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-white">Passport Size Photos</td>
                        <td><div className="badge badge-error">Required</div></td>
                        <td className="text-sm opacity-70 text-white">Recent photographs as per specifications</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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