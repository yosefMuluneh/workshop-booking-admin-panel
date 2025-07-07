import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import { login } from '../api/adminApi';
import Wave from 'react-wavify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
    <div className="min-h-screen bg-gray-100 flex">
      <div className="hidden md:block w-1/2 relative min-h-screen">
        <img
          src="/images/cover.jpg"
          alt="Workshop"
          className="absolute inset-0 w-full h-full object-cover rounded-r-[16px]"
          onError={() => console.error('Image failed to load: /images/workshop.jpg')}
        />
      </div>
      <div className="relative w-full md:w-1/2 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-pink-100/20 z-[-1]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[20%] opacity-30">
          <Wave
            fill="#1976d2"
            paused={false}
            options={{
              height: 20,
              amplitude: 30,
              speed: 0.15,
              points: 3,
            }}
          />
        </div>
        <div className="max-w-md w-full mx-4 bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-500 rounded-full p-3">
              <LockOutlinedIcon className="text-white !w-8 !h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-center font-poppins text-gray-800 mb-2 sm:text-3xl">
            Welcome Admin
          </h1>
          <p className="text-center text-gray-600 font-poppins mb-6 sm:text-sm">
            Sign in to manage your workshop system
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-poppins">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder='user@workshop.com'
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 disabled:opacity-70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-poppins">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder='********'
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 disabled:opacity-70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-6 w-6 mx-auto text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;