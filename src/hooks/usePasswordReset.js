import { useState } from 'react';
import config from "../config";


export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${config.BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSuccess(true);
        return true;
      } else {
        setError('Failed to send reset email');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.BASE_URL}/auth/verify-token?token=${encodeURIComponent(token)}`
      );
      if (response.ok) {
        return true;
      } else {
        setError('Token invalid or expired');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${config.BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (response.ok) {
        setSuccess(true);
        return true;
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    forgotPassword,
    verifyToken,
    resetPassword,
    loading,
    error,
    success,
  };
};