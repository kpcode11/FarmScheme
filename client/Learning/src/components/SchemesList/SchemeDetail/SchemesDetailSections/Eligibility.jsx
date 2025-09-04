import React from 'react';

const Eligibility = ({ scheme }) => {
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Eligibility Criteria</h3>
          <div className="space-y-4">
            {scheme.eligibility ? (
              <div className="prose max-w-none">
                <p>{scheme.eligibility}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="alert alert-info">
                  <span>Check if you meet the following criteria:</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="checkbox checkbox-primary" disabled />
                    <span>Must be a registered farmer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="checkbox checkbox-primary" disabled />
                    <span>Age between 18-60 years</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="checkbox checkbox-primary" disabled />
                    <span>Must have valid land ownership documents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <input type="checkbox" className="checkbox checkbox-primary" disabled />
                    <span>Annual income below specified limit</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eligibility;