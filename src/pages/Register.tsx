import { useState } from "react";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { registerUser } from "../lib/auth";

export default function Register({ onSuccess, goHome, goLogin }: { onSuccess: () => void; goHome: () => void; goLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password should be at least 6 characters."); return; }
    const res = registerUser({ name, email, phone, password });
    if (!res.ok) { setError(res.error || "Registration failed."); return; }
    onSuccess();
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a className="brand auth-brand" href="#home" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <img src="/logo.png" className="logo" alt="Food Express Foundation logo" />
          <span>FOOD EXPRESS<small>FOUNDATION</small></span>
        </a>
        <h1>Create your account</h1>
        <p className="auth-sub">Join as a donor or volunteer to stay updated on our work.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit}>
          <label>Full name</label>
          <div className="input-icon"><User size={16} /><input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <label>Email address</label>
          <div className="input-icon"><Mail size={16} /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <label>Mobile number</label>
          <div className="input-icon"><Phone size={16} /><input placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <label>Password</label>
          <div className="input-icon"><Lock size={16} /><input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button className="donate full" type="submit">Create Account <ArrowRight size={16} /></button>
        </form>

        <p className="auth-switch">Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); goLogin(); }}>Login</a></p>
        <button className="back" onClick={goHome}>← Back to website</button>
      </div>
      <p className="auth-note">Demo account system — stored on this device only, no server or database yet.</p>
    </div>
  );
}
