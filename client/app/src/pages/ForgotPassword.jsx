import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/email/request-password-reset',
        { email }
      );

      if (response.data.success) {
        setMessageType('success');
        setMessage('Password reset link has been sent to your email. Please check your inbox.');
        setEmail('');
        
        setTimeout(() => {
          navigate('/Login');
        }, 3000);
      } else {
        setMessageType('error');
        setMessage(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-black">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-96 text-white">
        <h2 className="text-center text-3xl mb-6 font-bold">Reset Password</h2>
        <p className="text-center text-gray-300 mb-6">
          Enter your email address and we'll send you a link to reset your password.
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
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-lg transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
