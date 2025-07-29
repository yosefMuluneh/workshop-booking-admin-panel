import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UsersIcon, CalendarDaysIcon, ChartBarSquareIcon, EyeIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('area');
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
    if (chartType === 'area') {
      setChartType('bar');
    } else if (chartType === 'bar') {
      setChartType('line');
    } else {
      setChartType('area');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-slate-50 border border-slate-200 text-slate-700 p-6 rounded-xl shadow-sm max-w-md text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarSquareIcon className="w-6 h-6 text-slate-500" />
          </div>
          <p className="font-medium">No statistics available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl mx-4 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <ChartBarSquareIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/80 text-lg">Monitor your workshop system performance</p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analytics Overview</h2>
            <p className="text-slate-600">Track your workshop performance and engagement</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleChartToggle}
              className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 shadow-sm"
            >
              <ArrowTrendingUpIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {chartType === 'area' ? 'Area' : chartType === 'bar' ? 'Bar' : 'Line'} Chart
              </span>
            </button>
          </div>
        </div>

        {/* Modern Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Bookings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBookings}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 text-sm font-medium">+12.5%</span>
                  <span className="text-slate-500 text-sm">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-4 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              <span>View Details</span>
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Active Workshops Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Active Workshops</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalWorkshops}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 text-sm font-medium">+3 new</span>
                  <span className="text-slate-500 text-sm">this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <button
              onClick={() => navigate('/workshops')}
              className="mt-4 flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              <span>View Details</span>
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Slots Filled Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Capacity Utilization</p>
                <p className="text-3xl font-bold text-slate-800">{stats.slotsFilledPercentage}%</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-slate-600 text-sm">{stats.slotsFilled} slots filled</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.slotsFilledPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <ChartBarSquareIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Workshop Performance</h3>
                <p className="text-sm text-slate-600 mt-1">Booking trends across all workshops</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleChartToggle}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  Switch View
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={stats.popularWorkshops} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="title" 
                      angle={-15} 
                      textAnchor="end" 
                      height={60} 
                      fontSize={12}
                      stroke="#64748b"
                    />
                    <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorBookings)" 
                      name="Total Bookings" 
                    />
                  </AreaChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={stats.popularWorkshops} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="title" 
                      angle={-15} 
                      textAnchor="end" 
                      height={60} 
                      fontSize={12}
                      stroke="#64748b"
                    />
                    <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="bookings" 
                      fill="#6366f1" 
                      name="Total Bookings" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={stats.popularWorkshops} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="title" 
                      angle={-15} 
                      textAnchor="end" 
                      height={60} 
                      fontSize={12}
                      stroke="#64748b"
                    />
                    <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                      name="Total Bookings" 
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;