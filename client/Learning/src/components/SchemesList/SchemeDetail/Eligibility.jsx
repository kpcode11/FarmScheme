import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Eligibility() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
  // Behave like a popup/modal: lock body scroll and close on ESC
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') navigate(-1); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`http://localhost:8001/api/v1/schemes/${schemeId}/eligibility-questions`);
        const qs = resp?.data?.data?.questions || [];
        setQuestions(qs);
        const init = {};
        qs.forEach(q => { init[q.key] = ''; });
        setAnswers(init);
      } finally {
        setLoading(false);
      }
    };
    if (schemeId) load();
  }, [schemeId]);

  const submit = async () => {
    try {
      setLoading(true);
      const resp = await axios.post(`http://localhost:8001/api/v1/schemes/${schemeId}/check-eligibility`, { answers });
      setResult(resp?.data?.data || { eligible: false, failures: [] });
    } catch (e) {
      setResult({ eligible: false, failures: [{ key: 'submit', question: 'Submit answers', reason: e.response?.data?.message || e.message }] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => navigate(-1)}>
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-base-200 flex items-center justify-between sticky top-0 bg-base-100 z-10">
          <h1 className="text-xl font-semibold text-white">Check Eligibility</h1>
          <div className="flex gap-2">
            <button className="btn btn-sm" onClick={() => navigate(-1)}>✕</button>
          </div>
        </div>
        <div className="p-4">
          {questions.length === 0 && !loading && (
            <div className="alert">
              <span className="text-white">No eligibility questions configured for this scheme.</span>
            </div>
          )}

          {questions.map(q => (
            <div key={q.key} className="flex flex-col gap-2 p-3 rounded border border-base-200 mb-3">
              <label className="text-white font-medium">{q.question}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    name={q.key}
                    className="radio radio-primary"
                    checked={answers[q.key] === 'yes'}
                    onChange={() => setAnswers({ ...answers, [q.key]: 'yes' })}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    name={q.key}
                    className="radio radio-primary"
                    checked={answers[q.key] === 'no'}
                    onChange={() => setAnswers({ ...answers, [q.key]: 'no' })}
                  />
                  No
                </label>
              </div>
            </div>
          ))}

          {result && (
            <div className={`alert ${result.eligible ? 'alert-success' : 'alert-error'}`}>
              <div className="flex flex-col gap-2">
                <span className="text-white font-semibold">
                  {result.eligible ? 'You are eligible for this scheme.' : 'You are not eligible for this scheme.'}
                </span>
                {!result.eligible && result.failures?.length > 0 && (
                  <ul className="list-disc ml-6 text-white">
                    {result.failures.map((f) => (
                      <li key={f.key}>
                        {f.question}: {f.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-base-200 flex justify-end gap-2 sticky bottom-0 bg-base-100">
            <button className="btn" onClick={() => navigate(-1)}>Close</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading || questions.length === 0}>
              {loading ? 'Checking...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eligibility;


