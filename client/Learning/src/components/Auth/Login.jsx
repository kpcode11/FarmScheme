import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../context/ToastContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email");
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");
      await login(email, password, remember);
      pushToast({ type: "success", message: "Logged in successfully" });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error ? <div className="alert alert-error mb-3">{error}</div> : null}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input className="input input-bordered w-full pr-16" placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((s) => !s)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="checkbox checkbox-sm" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="link" to="/register">Register</Link></p>
    </div>
  );
}

export default Login;


