import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axiosInstance from "../utils/axiosInstance";
import { loginWithGoogle } from "../api/services/authService";
import { getEmailFromGoogleIdToken } from "../utils/googleAuth";
import { usePasswordReset } from "../hooks/usePasswordReset";
import GoogleSignInButton from "./GoogleSignInButton";
import logo from "../assets/logo.png";

import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
} from "mdb-react-ui-kit";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { forgotPassword, resetPassword, loading, error } = usePasswordReset();
  const navigate = useNavigate();

  const persistSessionAndRedirect = (token, userId, role = "USER") => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    window.dispatchEvent(new Event("storage"));
    setMessage("✅ Login successful!");
    setTimeout(() => navigate(`/dashboard/${userId}`), 1000);
  };

  const handleGoogleCredential = async (idToken) => {
    setGoogleLoading(true);
    setMessage("");
    try {
      const data = await loginWithGoogle(idToken);
      if (data?.token && data?.userId) {
        persistSessionAndRedirect(data.token, data.userId, data.role || "USER");
        return;
      }
      if (data?.needsRegistration) {
        const email = getEmailFromGoogleIdToken(idToken);
        navigate(email ? `/?email=${encodeURIComponent(email)}` : "/");
        return;
      }
      setMessage("❌ Google sign-in failed. Unexpected server response.");
    } catch (err) {
      console.error("Google login error:", err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error;

      if (status === 404 || status === 400) {
        const email = getEmailFromGoogleIdToken(idToken);
        setMessage(
          "ℹ️ No account linked to this Google email. Redirecting to registration…"
        );
        setTimeout(
          () => navigate(email ? `/?email=${encodeURIComponent(email)}` : "/"),
          1200
        );
      } else if (status === 501) {
        setMessage(
          "❌ Google sign-in is not enabled on the server yet. Ask admin to add POST /users/google-login."
        );
      } else {
        setMessage(
          serverMsg
            ? `❌ ${serverMsg}`
            : "❌ Google sign-in failed. Try email login or register first."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post(`/users/login`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const { token, userId, role } = response.data;

        if (token && userId) {
          persistSessionAndRedirect(token, userId, role || "USER");
        } else {
          setMessage("❌ Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage("❌ Login failed. Please try again.");
      });
  };

  const goToRegister = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const success = await forgotPassword(resetEmail);
    if (success) setShowReset(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const success = await resetPassword(resetToken, newPassword);
    if (success) {
      alert("✅ Password reset! Please login.");
      setShowForgot(false);
      setShowReset(false);
      setResetToken("");
      setNewPassword("");
    }
  };

  const isSuccessMessage = message.includes("successful");

  return (
    <div className="login-page">
      <MDBCard className="login-card">
        <div className="login-card-accent" />
        <MDBCardBody className="login-card-body">
          <div className="login-brand">
            <img src={logo} alt="Shastra Digital Library" className="login-logo" />
            <h1 className="login-title">
              {!showForgot && !showReset && "Welcome"}
              {showForgot && !showReset && "Reset password"}
              {showReset && "Set new password"}
            </h1>
            <p className="login-subtitle">
              {!showForgot && !showReset && "Student login · Shastra Digital Library"}
              {showForgot && !showReset && "We’ll email you a reset link"}
              {showReset && "Enter the token from your email"}
            </p>
          </div>

          {message && (
            <div
              className={`login-alert ${
                isSuccessMessage ? "login-alert--success" : "login-alert--error"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          {!showForgot && !showReset && (
            <>
            <div className="login-google-section mb-4">
              <GoogleSignInButton
                disabled={googleLoading}
                onCredential={handleGoogleCredential}
                onError={() =>
                  setMessage("❌ Google sign-in was cancelled or failed.")
                }
              />
              {googleLoading && (
                <p className="login-google-loading text-muted small text-center mt-2 mb-0">
                  Signing in with Google…
                </p>
              )}
            </div>

            <div className="login-divider" role="separator">
              <span>or sign in with email</span>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <MDBInput
                id="login-email"
                label="Email address / Enrollment No."
                name="email"
                type="email"
                autoComplete="username"
                value={formData.email}
                onChange={handleChange}
                className="mb-4"
                required
              />
              <div className="login-password-wrap">
                <MDBInput
                  id="login-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="login-form-row">
                <MDBCheckbox name="remember" label="Remember me" />
                <a
                  href="#forgot"
                  className="login-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgot(true);
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <MDBBtn className="login-btn-primary mb-2" type="submit">
                Sign in
              </MDBBtn>
              <div className="login-footer">
                <p>
                  Don’t have an account?{" "}
                  <a href="#signup" className="login-signup-link" onClick={goToRegister}>
                    Register here
                  </a>
                </p>
              </div>
            </form>
            </>
          )}

          {showForgot && !showReset && (
            <form onSubmit={handleForgotPassword} className="login-form">
              <p className="login-section-hint">
                Enter the email linked to your account and we’ll send reset instructions.
              </p>
              <MDBInput
                id="reset-email"
                label="Your email"
                type="email"
                autoComplete="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mb-4"
                required
              />
              <MDBBtn className="login-btn-primary mb-3" type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send reset email"}
              </MDBBtn>
              {error && <div className="login-alert login-alert--error">{error}</div>}
              <div className="login-footer">
                <a
                  href="#login"
                  className="login-forgot-link login-back-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgot(false);
                  }}
                >
                  ← Back to login
                </a>
              </div>
            </form>
          )}

          {showReset && (
            <form onSubmit={handleResetPassword} className="login-form">
              <p className="login-section-hint">
                Paste the token from your email, then choose a new password.
              </p>
              <MDBInput
                id="reset-token"
                label="Reset token"
                type="text"
                autoComplete="one-time-code"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="mb-4"
                required
              />
              <MDBInput
                id="reset-password"
                label="New password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4"
                required
              />
              <MDBBtn className="login-btn-primary mb-3" type="submit" disabled={loading}>
                {loading ? "Resetting…" : "Update password"}
              </MDBBtn>
              {error && <div className="login-alert login-alert--error">{error}</div>}
              <div className="login-footer">
                <a
                  href="#login"
                  className="login-forgot-link login-back-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowReset(false);
                    setShowForgot(false);
                  }}
                >
                  ← Back to login
                </a>
              </div>
            </form>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Login;
