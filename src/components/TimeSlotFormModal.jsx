import React, { useState, useEffect } from 'react';
import { addTimeSlot, updateTimeSlot } from '../api/adminApi'; // <-- IMPORT API functions

const TimeSlotFormModal = ({ isOpen, onClose, workshopId, editingSlot, onSave }) => {
  const [formData, setFormData] = useState({ startTime: '', endTime: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingSlot) {
      setFormData({ 
        startTime: editingSlot.startTime || '', 
        endTime: editingSlot.endTime || '', 
        availableSpots: editingSlot.availableSpots !== undefined ? editingSlot.availableSpots : ''
      });
    } else {
      setFormData({ startTime: '', endTime: '', availableSpots: '' });
    }
    setError('');
  }, [editingSlot, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (editingSlot) {
        // Use centralized API function
        await updateTimeSlot(editingSlot.id, formData);
      } else {
        // Use centralized API function
        await addTimeSlot(workshopId, formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  
  // The rest of the JSX for this component can remain exactly the same as before.
  // ... (paste the JSX from the previous response here)
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md mx-4 p-6 rounded-2xl shadow-xl transform transition-all">
        <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4">
          {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input type="text" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} placeholder="e.g., 10:00 AM" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input type="text" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} placeholder="e.g., 12:00 PM" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            {editingSlot && (
                 <div>
                    <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700">Available Spots</label>
                    <input type="number" id="availableSpots" name="availableSpots" value={formData.availableSpots} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                 </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={submitting} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={submitting} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:bg-teal-300">
              {submitting ? 'Saving...' : 'Save Time Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotFormModal;