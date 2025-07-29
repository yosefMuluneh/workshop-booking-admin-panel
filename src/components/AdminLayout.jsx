import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import { HomeIcon, CalendarIcon, UserGroupIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/dashboard', color: 'teal-500' },
    { text: 'Workshops', icon: <CalendarIcon className="w-6 h-6" />, path: '/workshops', color: 'indigo-600' },
    { text: 'Bookings', icon: <UserGroupIcon className="w-6 h-6" />, path: '/bookings', color: 'amber-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Modern Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">WorkshopAdmin</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 w-72 bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-xl transform transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-20 pb-6 h-full overflow-y-auto">
          <div className="px-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Navigation</h2>
          </div>
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.text}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}>
                      <div className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-600'
                      }`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className="font-medium">{item.text}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-500">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 lg:pt-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;