import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkshopById, softDeleteWorkshop, restoreWorkshop } from '../api/adminApi';
import { Chip } from '@mui/material';
import { ArrowLeftIcon, ArchiveBoxIcon, ArrowUturnUpIcon } from '@heroicons/react/24/solid';

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkshop = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkshopById(id);
      setWorkshop(data);
    } catch (err) {
      setError('Failed to fetch workshop details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);
  
  const handleArchive = async () => {
    if (window.confirm('Are you sure you want to archive this workshop?')) {
        try {
            await softDeleteWorkshop(id);
            // Optimistically update UI
            setWorkshop(prev => ({ ...prev, deletedAt: new Date().toISOString() }));
        } catch (err) {
            alert('Failed to archive workshop.');
        }
    }
  };
  
  const handleRestore = async () => {
    if (window.confirm('Are you sure you want to restore this workshop?')) {
        try {
            await restoreWorkshop(id);
            // Optimistically update UI
            setWorkshop(prev => ({ ...prev, deletedAt: null }));
        } catch (err) {
            alert('Failed to restore workshop.');
        }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="animate-spin h-10 w-10 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg m-8">{error}</div>;
  }

  if (!workshop) return null;

  const isArchived = !!workshop.deletedAt;

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Workshops
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workshop Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{workshop.title}</h1>
              <p className="text-gray-500 mb-4">{new Date(workshop.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
              <p className="text-gray-700 leading-relaxed">{workshop.description}</p>
            </div>

            {/* Time Slots Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Time Slots</h2>
               <ul className="space-y-2">
                {workshop.timeSlots.map(slot => (
                    <li key={slot.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700">{slot.startTime} - {slot.endTime}</span>
                        <span className="text-sm text-gray-500">{slot.availableSpots} / {workshop.maxCapacity} spots left</span>
                    </li>
                ))}
               </ul>
            </div>
            
            {/* Bookings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Current Bookings ({workshop.bookings.length})</h2>
               <div className="max-h-96 overflow-y-auto">
                    {workshop.bookings.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                        {workshop.bookings.map(booking => (
                            <li key={booking.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{booking.user.name}</p>
                                    <p className="text-sm text-gray-500">{booking.user.email}</p>
                                </div>
                                <Chip label={booking.status} size="small" color={booking.status === 'CONFIRMED' ? 'success' : 'warning'} />
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No bookings for this workshop yet.</p>
                    )}
               </div>
            </div>

          </div>

          {/* Right Column: Status & Actions */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800">Status & Actions</h2>
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <Chip label={isArchived ? 'Archived' : 'Active'} color={isArchived ? 'default' : 'success'} />
                </div>
                {isArchived ? (
                    <button onClick={handleRestore} className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-poppins flex items-center justify-center space-x-2 hover:bg-green-600 transition-all duration-300">
                        <ArrowUturnUpIcon className="w-5 h-5" />
                        <span>Restore Workshop</span>
                    </button>
                ) : (
                    <button onClick={handleArchive} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-poppins flex items-center justify-center space-x-2 hover:bg-red-600 transition-all duration-300">
                        <ArchiveBoxIcon className="w-5 h-5" />
                        <span>Archive Workshop</span>
                    </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailPage;