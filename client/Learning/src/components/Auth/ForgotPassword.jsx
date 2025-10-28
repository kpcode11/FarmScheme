import React, { useState } from "react";
import { apiRequest } from "../../config/api.js";
import { useToast } from "../../context/ToastContext.jsx";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1=request, 2=reset
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);

  const request = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return pushToast({ type: "error", message: "Enter a valid email" });
    setLoading(true);
    try {
      const res = await apiRequest("/auth/forgot-password", { method: "POST", body: { email } });
      setToken(res.data?.token || "");
      pushToast({ type: "success", message: "If the email exists, a reset link was sent" });
      setStep(2);
    } catch (e) {
      pushToast({ type: "error", message: e.message || "Failed to request reset" });
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (!token.trim()) return pushToast({ type: "error", message: "Token is required" });
    if (!password || password.length < 6) return pushToast({ type: "error", message: "Password must be at least 6 chars" });
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", { method: "POST", body: { token, password } });
      pushToast({ type: "success", message: "Password reset successful" });
    } catch (e) {
      pushToast({ type: "error", message: e.message || "Failed to reset password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {step === 1 ? (
        <form onSubmit={request} className="space-y-3">
          <input className="input input-bordered w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? "Sending..." : "Send reset link"}</button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-3">
          <input className="input input-bordered w-full" placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
          <div className="relative">
            <input className="input input-bordered w-full pr-12" placeholder="New password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? (<span role="img" aria-hidden>🙈</span>) : (<span role="img" aria-hidden>👁️</span>)}
            </button>
          </div>
          <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? "Resetting..." : "Reset password"}</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;


