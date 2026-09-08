import { useState } from "react";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "../lib/auth";

export default function Login({ onSuccess, goHome, goRegister }: { onSuccess: () => void; goHome: () => void; goRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    const res = loginUser(email, password);
    if (!res.ok) { setError(res.error || "Login failed."); return; }
    onSuccess();
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a className="brand auth-brand" href="#home" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <img src="/logo.png" className="logo" alt="Food Express Foundation logo" />
          <span>FOOD EXPRESS<small>FOUNDATION</small></span>
        </a>
        <h1>Welcome back</h1>
        <p className="auth-sub">Login to track your donations and volunteering activity.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit}>
          <label>Email address</label>
          <div className="input-icon"><Mail size={16} /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <label>Password</label>
          <div className="input-icon"><Lock size={16} /><input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button className="donate full" type="submit">Login <ArrowRight size={16} /></button>
        </form>

        <p className="auth-switch">Don't have an account? <a href="#register" onClick={(e) => { e.preventDefault(); goRegister(); }}>Create one</a></p>
        <button className="back" onClick={goHome}>← Back to website</button>
      </div>
      <p className="auth-note"><Heart size={12} /> Demo account system — stored on this device only, no server or database yet.</p>
    </div>
  );
}
