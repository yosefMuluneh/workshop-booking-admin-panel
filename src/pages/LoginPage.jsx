import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import { login } from '../api/adminApi';
import Wave from 'react-wavify';
import { LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data.role !== 'ADMIN') {
        setError('Access Denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <img
            src="/images/cover.jpg"
            alt="Workshop"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            onError={() => console.error('Image failed to load: /images/cover.jpg')}
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">WorkshopAdmin</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Manage Your
              <br />
              Workshop Empire
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Streamline bookings, track analytics, and grow your workshop business with our comprehensive admin platform.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Real-time booking management</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Advanced analytics & insights</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Workshop performance tracking</span>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                <LockClosedIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-600">
                Sign in to access your admin dashboard
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Demo credentials: admin@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;