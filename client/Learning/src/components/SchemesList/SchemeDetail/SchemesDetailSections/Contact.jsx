import React from 'react';

const Contact = ({ scheme }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Helpline Number</h4>
                <p className="text-primary">1800-XXX-XXXX</p>
                <p className="text-sm opacity-70">Toll-free, 24/7 support</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-primary">support@farmerschemes.gov.in</p>
                <p className="text-sm opacity-70">Response within 24 hours</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Office Address</h4>
                <p>Department of Agriculture<br />
                Government Building<br />
                Your City, State - 123456</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Quick Help</h3>
            <div className="space-y-4">
              <button className="btn btn-outline w-full">
                Download Application Form
              </button>
              <button className="btn btn-outline w-full">
                View FAQ
              </button>
              <button className="btn btn-outline w-full">
                Track Application Status
              </button>
              <button className="btn btn-primary w-full">
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;