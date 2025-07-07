import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import { HomeIcon, CalendarIcon, UserGroupIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-35 bg-gradient-to-r from-teal-500 to-indigo-600 shadow-lg">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
          <div className="flex items-center">
            {/* <img
              src="/images/workshop.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover mr-3"
              onError={() => console.error('Logo image failed to load: /images/workshop.jpg')}
            /> */}
            <h1 className="text-4xl font-bold text-white font-poppins sm:text-xl">Admin Panel</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="sm:hidden text-white hover:text-teal-100 focus:outline-none"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 text-white px-4 py-2 rounded-lg font-poppins hover:bg-indigo-800 transition-all duration-300 sm:px-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 sm:static sm:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="mt-24">
          {menuItems.map((item) => (
            <div
              key={item.text}
              className={`px-4 py-3 mx-2 my-1 rounded-lg hover:bg-${item.color}-100 transition-all duration-300 ${
                location.pathname === item.path
                  ? `bg-${item.color}-200 font-bold border-l-4 border-${item.color}-600 bg-${item.color}-100`
                  : ''
              }`}
            >
              <a
                href={item.path}
                className={`flex items-center text-gray-700 hover:text-${item.color}-600 font-poppins ${
                  location.pathname === item.path ? `text-${item.color}-600` : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <span className={`text-${item.color}-600 mr-3`}>{item.icon}</span>
                <span>{item.text}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;