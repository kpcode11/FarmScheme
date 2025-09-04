import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Scheme Details</h3>
                <p className="text-white">{scheme.details || 'No detailed description available.'}</p>
                
                <div className="flex gap-2 mt-4">
                  {scheme.schemeCategory && (
                    <div className="badge badge-primary">{scheme.schemeCategory}</div>
                  )}
                  
                  {scheme.level && (
                    <div className="badge badge-secondary">{scheme.level}</div>
                  )}
                </div>
                
                {scheme.eligibility && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-white">Eligibility:</h4>
                    <p className="text-white">{scheme.eligibility}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'benefits':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Benefits</h3>
              <p className="text-white">{scheme.benefits || 'Benefits information will be available soon.'}</p>
            </div>
          </div>
        );
      case 'eligibility':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Eligibility Criteria</h3>
              <p className="text-white">{scheme.eligibility || 'Eligibility criteria will be available soon.'}</p>
            </div>
          </div>
        );
      case 'application':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Application Process</h3>
              <p className="text-white">Application process information will be available soon.</p>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Required Documents</h3>
              <p className="text-white">Required documents list will be available soon.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
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