import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../context/ToastContext.jsx";

function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!name.trim()) throw new Error("Name is required");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email");
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");
      if (password !== confirmPassword) throw new Error("Passwords do not match");
      await doRegister(name, email, password, remember);
      pushToast({ type: "success", message: "Registered successfully" });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error ? <div className="alert alert-error mb-3">{error}</div> : null}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input input-bordered w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input className="input input-bordered w-full pr-16" placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((s) => !s)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input className="input input-bordered w-full" placeholder="Confirm Password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="checkbox checkbox-sm" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? "Registering..." : "Register"}</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link className="link" to="/login">Login</Link></p>
    </div>
  );
}

export default Register;


