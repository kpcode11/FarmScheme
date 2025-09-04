import React from 'react';

const Benefits = ({ scheme }) => {
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Key Benefits</h3>
          <div className="space-y-4">
            {scheme.benefits ? (
              <div className="prose max-w-none">
                <p>{scheme.benefits}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="badge badge-success">✓</div>
                  <div>
                    <h4 className="font-semibold">Financial Support</h4>
                    <p className="text-sm opacity-70">Direct financial assistance for eligible farmers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-success">✓</div>
                  <div>
                    <h4 className="font-semibold">Subsidies</h4>
                    <p className="text-sm opacity-70">Government subsidies on agricultural equipment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-success">✓</div>
                  <div>
                    <h4 className="font-semibold">Training</h4>
                    <p className="text-sm opacity-70">Free training and skill development programs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="badge badge-success">✓</div>
                  <div>
                    <h4 className="font-semibold">Insurance</h4>
                    <p className="text-sm opacity-70">Crop insurance and risk coverage</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;