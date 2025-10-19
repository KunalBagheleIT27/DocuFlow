import React, { useState } from "react";
import { FaLock, FaUser, FaSignInAlt, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) =>
    /^(?!\.)[A-Za-z0-9._%+-]+@gmail\.com$/i.test(email);
  const isStrongPassword = (pw: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Enter email and password");
      return;
    }
    if (!isValidEmail(username)) {
      setError("Email must be a valid @gmail.com address");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Password must be 8+ chars with upper, lower, number, special");
      return;
    }
    setLoading(true);
    try {
      // For demo, register behaves same as login but validates strictly
      await login(username, password, username.split("@")[0]);
      navigate("/");
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="card auth-card" onSubmit={onSubmit}>
        <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
          <div className="logo-badge" style={{ width: 60, height: 60 }}>
            <FaFileAlt size={28} />
          </div>
          <h1 className="title" style={{ fontSize: 32, marginBottom: 6 }}>
            DocuFlow
          </h1>
          <p className="subtitle">Document Management & Workflow</p>
        </div>
        {error && <div className="alert error">{error}</div>}
        <label className="field">
          <span>Email (Gmail only)</span>
          <div className="input-with-icon">
            <FaUser />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your.name@gmail.com"
            />
          </div>
        </label>
        <label className="field">
          <span>Password</span>
          <div className="input-with-icon">
            <FaLock />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>
        <div className="row-actions">
          <button className="btn-primary glow" type="submit" disabled={loading}>
            {loading ? (
              mode === "login" ? (
                "Signing in…"
              ) : (
                "Creating…"
              )
            ) : (
              <>
                <FaSignInAlt style={{ marginRight: 6 }} />{" "}
                {mode === "login" ? "Sign In" : "Register"}
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create account" : "Have an account? Sign in"}
          </button>
        </div>
        <p className="hint">
          Tip: include "reviewer" or "approver" in username to simulate roles.
        </p>
      </form>
    </div>
  );
}
