import React, { useState } from 'react';
import { usePasswordReset } from '../hooks/usePasswordReset';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter token & new password
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { forgotPassword, verifyToken, resetPassword, loading, error, success } =
    usePasswordReset();

  // Step 1: User enters email and requests reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }
    const success = await forgotPassword(email);
    if (success) {
      alert('✅ Check your email for the password reset link');
      setStep(2);
    }
  };

  // Step 2: User enters token (from email link or manually) and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please enter the token from your email');
      return;
    }

    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Verify token first
    const isValid = await verifyToken(token);
    if (!isValid) {
      alert('❌ Token is invalid or expired');
      return;
    }

    // Reset password
    const result = await resetPassword(token, newPassword);
    if (result) {
      alert('✅ Password reset successful! You can now log in with your new password');
      // Redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Password Reset</h2>

      {/* Step 1: Request Reset */}
      {step === 1 && (
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && (
            <p style={{ color: 'green' }}>Email sent successfully!</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white' }}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
      )}

      {/* Step 2: Reset Password */}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label>Reset Token (from email):</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the token from your email"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && (
            <p style={{ color: 'green' }}>Password reset successful!</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setEmail('');
              setToken('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
            }}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;