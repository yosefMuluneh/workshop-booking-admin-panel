import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { 
  ArrowLeftIcon, 
  ArchiveBoxIcon, 
  ArrowUturnUpIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

// Import all necessary functions from the centralized API file
import { 
  getWorkshopById, 
  softDeleteWorkshop, 
  restoreWorkshop,
  deleteTimeSlot
} from '../api/adminApi';

// Import our custom components
import TimeSlotFormModal from '../components/TimeSlotFormModal';
import ConfirmationModal from '../components/ConfirmationModal';

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // State for the generic confirmation modal
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    confirmColor: 'red',
  });

  const fetchWorkshop = useCallback(async () => {
    try {
      const data = await getWorkshopById(id);
      setWorkshop(data);
    } catch (err) {
      console.error(err)
      setError('Failed to fetch workshop details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);

  const handleOpenConfirmation = (config) => {
    setConfirmation({ isOpen: true, ...config });
  };
  
  const handleCloseConfirmation = () => {
    setConfirmation({ ...confirmation, isOpen: false });
  };

  const handleArchive = () => {
    handleOpenConfirmation({
      title: 'Archive Workshop?',
      message: 'This will hide the workshop from public view but preserve its data. You can restore it later.',
      onConfirm: async () => {
        await softDeleteWorkshop(id);
        fetchWorkshop();
      },
      confirmText: 'Archive',
      confirmColor: 'red',
    });
  };
  
  const handleRestore = () => {
    handleOpenConfirmation({
      title: 'Restore Workshop?',
      message: 'This will make the workshop visible and bookable to the public again.',
      onConfirm: async () => {
        await restoreWorkshop(id);
        fetchWorkshop();
      },
      confirmText: 'Restore',
      confirmColor: 'green',
    });
  };

  const handleDeleteTimeSlot = (slotId) => {
    handleOpenConfirmation({
        title: 'Delete Time Slot?',
        message: 'This action cannot be undone. You can only delete slots with no active bookings.',
        onConfirm: async () => {
            try {
                await deleteTimeSlot(slotId);
                fetchWorkshop(); // Refresh on success
            } catch (err) {
                // If the API call fails, the user will be notified
                alert(err.response?.data?.message || 'Failed to delete time slot.');
            }
        },
        confirmText: 'Delete',
        confirmColor: 'red',
    });
  };

  const handleTimeSlotModalOpen = (slot = null) => {
    setEditingSlot(slot);
    setIsTimeSlotModalOpen(true);
  };
  
  const handleTimeSlotModalClose = () => {
    setIsTimeSlotModalOpen(false);
    setEditingSlot(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading workshop details...</p>
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

  if (!workshop) return null;

  const isArchived = !!workshop.deletedAt;
  const isExpired = new Date(workshop.date) <= new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header with Breadcrumb */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/workshops')} 
            className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-all duration-200 group mb-6"
          >
            <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all duration-200">
              <ArrowLeftIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Workshops</span>
          </button>
          
          {/* Workshop Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{workshop.title}</h1>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(workshop.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{workshop.maxCapacity} max capacity</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="text-right">
                <Chip 
                  label={isExpired ? "Expired" : isArchived ? 'Archived' : 'Active'} 
                  color={(isArchived || isExpired) ? 'default' : 'success'}
                  className="mb-2"
                />
                <p className="text-sm text-slate-500">
                  {workshop.bookings?.length || 0} total bookings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Bookings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workshop Description Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-800">Description</h2>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">{workshop.description}</p>
            </div>

            {/* Time Slots Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Time Slots</h2>
                 <button onClick={() => handleTimeSlotModalOpen()} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-teal-200">
                    <PlusIcon className="w-4 h-4" />
                    <span>New Slot</span>
                 </button>
               </div>
               <ul className="space-y-3">
                {workshop.timeSlots.map(slot => (
                    <li key={slot.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-700">{slot.startTime} - {slot.endTime}</span>
                          <span className="block text-xs text-gray-500">{slot.availableSpots} / {workshop.maxCapacity} spots left</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <button onClick={() => handleTimeSlotModalOpen(slot)} className="text-gray-400 hover:text-blue-500"><PencilSquareIcon className="w-5 h-5" /></button>
                           <button onClick={() => handleDeleteTimeSlot(slot.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    </li>
                ))}
                {workshop.timeSlots.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No time slots have been added yet.</p>
                )}
               </ul>
            </div>
            
            {/* Bookings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Current Bookings ({workshop.bookings.length || 0})</h2>
               <div className="max-h-96 overflow-y-auto">
                    {workshop.bookings && workshop.bookings.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                        {workshop.bookings.map(booking => (
                            <li key={booking.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{booking.user?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</p>
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

          {/* Modern Right Column: Quick Stats & Actions */}
          <div className="lg:col-span-1">
             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 space-y-6 sticky top-8">
                {/* Quick Stats */}
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-slate-700">Time Slots</span>
                      </div>
                      <span className="font-bold text-slate-800">{workshop.timeSlots.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-slate-700">Total Bookings</span>
                      </div>
                      <span className="font-bold text-slate-800">{workshop.bookings?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ChartBarIcon className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-slate-700">Capacity</span>
                      </div>
                      <span className="font-bold text-slate-800">{workshop.maxCapacity}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Actions</h3>
                  {isArchived ? (
                      <button 
                        disabled={isExpired} 
                        onClick={handleRestore} 
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                          <ArrowUturnUpIcon className="w-5 h-5" />
                          <span className="font-medium">Restore Workshop</span>
                      </button>
                  ) : (
                      <button 
                        disabled={isExpired} 
                        onClick={handleArchive} 
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                          <ArchiveBoxIcon className="w-5 h-5" />
                          <span className="font-medium">Archive Workshop</span>
                      </button>
                  )}
                  
                  {isExpired && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Expired workshops cannot be modified
                    </p>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- RENDER OUR MODALS --- */}
      <TimeSlotFormModal
        isOpen={isTimeSlotModalOpen}
        onClose={handleTimeSlotModalClose}
        workshopId={workshop.id}
        editingSlot={editingSlot}
        onSave={fetchWorkshop}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        confirmColor={confirmation.confirmColor}
      />
    </div>
  );
};

export default WorkshopDetailPage;