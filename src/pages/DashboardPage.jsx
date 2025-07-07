import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stats`, config);
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChartToggle = () => {
    setChartType(chartType === 'bar' ? 'line' : 'bar');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-teal-500"
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm font-poppins">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-gray-200 text-gray-700 p-4 rounded-lg text-sm font-poppins">
          No stats available.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div
        className="relative h-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/workshop.jpg)' }}
        onError={() => console.error('Header image failed to load: /images/workshop.jpg')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/50 to-indigo-600/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-poppins sm:text-3xl">Admin Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 font-poppins sm:text-xl">
            Workshop Statistics
          </h2>
          <button
            onClick={handleChartToggle}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-poppins hover:bg-indigo-700 transition-all duration-300"
          >
            Switch to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-teal-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-medium font-poppins">Total Bookings</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-4 text-sm text-teal-100 hover:underline font-poppins"
            >
              View Details
            </button>
          </div>
          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-medium font-poppins">Active Workshops</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalWorkshops}</p>
            <button
              onClick={() => navigate('/workshops')}
              className="mt-4 text-sm text-indigo-100 hover:underline font-poppins"
            >
              View Details
            </button>
          </div>
          <div className="bg-amber-400 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-medium font-poppins">Slots Filled</h3>
            <p className="text-3xl font-bold mt-2">{stats.slotsFilled}</p>
            <p className="text-sm mt-1">{stats.slotsFilledPercentage}% Capacity</p>
            <button
              onClick={() => navigate('/slots')}
              className="mt-4 text-sm text-amber-100 hover:underline font-poppins"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-medium text-indigo-600 font-poppins mb-4">Most Popular Workshops</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={stats.popularWorkshops} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-15} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8884d8" name="Total Bookings" />
                </BarChart>
              ) : (
                <LineChart data={stats.popularWorkshops} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-15} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" name="Total Bookings" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;