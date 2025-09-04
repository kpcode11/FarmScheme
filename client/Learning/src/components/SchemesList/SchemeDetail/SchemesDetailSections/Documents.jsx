import React from 'react';

const Documents = ({ scheme }) => {
  const documents = [
    { name: "Aadhaar Card", required: true, description: "Valid Aadhaar card for identity verification" },
    { name: "Land Ownership Documents", required: true, description: "Revenue records, patta, or land title documents" },
    { name: "Bank Account Details", required: true, description: "Bank passbook or statement for fund transfer" },
    { name: "Income Certificate", required: true, description: "Certificate showing annual income" },
    { name: "Caste Certificate", required: false, description: "If applicable for reserved category benefits" },
    { name: "Passport Size Photos", required: true, description: "Recent photographs as per specifications" }
  ];

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Required Documents</h3>
          
          <div className="space-y-4">
            <div className="alert alert-warning">
              <span>Please ensure all documents are valid and clearly readable</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index}>
                      <td className="font-medium">{doc.name}</td>
                      <td>
                        <div className={`badge ${doc.required ? 'badge-error' : 'badge-warning'}`}>
                          {doc.required ? 'Required' : 'Optional'}
                        </div>
                      </td>
                      <td className="text-sm opacity-70">{doc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;