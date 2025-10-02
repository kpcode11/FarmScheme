import React from 'react';

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
      required: !optional
    };
  });
};

const Documents = ({ scheme }) => {
  const parsed = mapToDocObjects(splitIntoDocuments(scheme?.documents));

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
                  </tr>
                </thead>
                <tbody>
                  {(parsed.length > 0 ? parsed : [
                    { name: 'No documents information available for this scheme.', required: false }
                  ]).map((doc, index) => (
                    <tr key={index}>
                      <td className="font-medium">{doc.name}</td>
                      <td>
                        <div className={`badge ${doc.required ? 'badge-error' : 'badge-warning'}`}>
                          {doc.required ? 'Required' : 'Optional'}
                        </div>
                      </td>
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