import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../Utils/config.js";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setIsTokenValid(false);
      setMessageType('error');
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword.length < 6) {
      setMessageType('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/email/reset-password`,
        { token, newPassword }
      );

      if (response.data.success) {
        setMessageType('success');
        setMessage('Password reset successfully! Redirecting to login...');
        
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
      } else {
        setMessageType('error');
        setMessage(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(
        error.response?.data?.message || 
        'An error occurred. Please try again or request a new reset link.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-black">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-96 text-white text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-4">Invalid Reset Link</h2>
          <p className="text-gray-300 mb-6">{message}</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-lg transition duration-300 font-semibold"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-black">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-96 text-white">
        <h2 className="text-center text-3xl mb-6 font-bold">Set New Password</h2>
        <p className="text-center text-gray-300 mb-6">
          Enter your new password below.
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${
            messageType === "success" 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-lg transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/Login')}
            className="text-blue-300 hover:text-blue-400 transition duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
