import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { apiRequest } from "../../config/api.js";
import { useToast } from "../../context/ToastContext.jsx";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { pushToast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      pushToast({ type: "error", message: "Invalid reset link" });
      navigate("/forgot-password");
    }
  }, [token, navigate, pushToast]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      pushToast({ type: "error", message: "Password must be at least 6 characters" });
      return;
    }
    if (password !== confirmPassword) {
      pushToast({ type: "error", message: "Passwords do not match" });
      return;
    }
    
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", { method: "POST", body: { token, password } });
      pushToast({ type: "success", message: "Password reset successful" });
      navigate("/login");
    } catch (err) {
      pushToast({ type: "error", message: err.message || "Reset failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="relative">
          <input 
            className="input input-bordered w-full pr-12" 
            placeholder="New password" 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center hover:bg-base-200 rounded"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.658 0 3.227-.363 4.646-1.014M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.066 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <input 
          className="input input-bordered w-full" 
          placeholder="Confirm password" 
          type={showPassword ? "text" : "password"} 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      <p className="mt-3 text-sm text-center">
        <Link className="link" to="/login">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
