import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { ArrowLeftIcon, ArchiveBoxIcon, ArrowUturnUpIcon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

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
  const isExpired = new Date(workshop.date) <= new Date();

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/workshops')} className="flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors">
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

          {/* Right Column: Status & Actions */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800">Status & Actions</h2>
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <Chip label={isExpired ? "Out Dated" : isArchived ? 'Archived' : 'Active'} color={(isArchived || isExpired) ? 'default' : 'success'} />
                </div>
                {isArchived ? (
                    <button disabled={isExpired} onClick={handleRestore} className="w-full cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg font-poppins flex items-center justify-center space-x-2 hover:bg-green-600 transition-all duration-300">
                        <ArrowUturnUpIcon className="w-5 h-5" />
                        <span>Restore Workshop</span>
                    </button>
                ) : (
                    <button disabled={isExpired} onClick={handleArchive} className="w-full cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg font-poppins flex items-center justify-center space-x-2 hover:bg-red-600 transition-all duration-300">
                        <ArchiveBoxIcon className="w-5 h-5" />
                        <span>Archive Workshop</span>
                    </button>
                )}
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