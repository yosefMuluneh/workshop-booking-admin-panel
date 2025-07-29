import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, MinusIcon, SparklesIcon, CalendarDaysIcon, UserGroupIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Zod schema for frontend validation. Matches backend.
const timeSlotSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

const workshopSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  maxCapacity: z.coerce.number().int().positive('Must be a positive number'),
  timeSlots: z.array(timeSlotSchema).min(1, 'At least one time slot is required'),
});

const WorkshopForm = ({ onSubmit, onCancel, defaultValues = {}, isOpen = true }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      maxCapacity: 10,
      timeSlots: [{ startTime: '10:00 AM', endTime: '12:00 PM' }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeSlots',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>
        
        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Create New Workshop
                </h2>
                <p className="text-slate-600">Build an engaging learning experience</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="col-span-1 sm:col-span-2">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Workshop Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 bg-white border-2 ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200`}
                          placeholder="e.g., Advanced React Patterns"
                        />
                        {errors.title && (
                          <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>{errors.title.message}</span>
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...field}
                          rows={4}
                          className={`w-full px-4 py-3 bg-white border-2 ${errors.description ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none`}
                          placeholder="Describe what participants will learn and experience..."
                        />
                        {errors.description && (
                          <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>{errors.description.message}</span>
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                          <span>Date <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          {...field}
                          type="date"
                          className={`w-full px-4 py-3 bg-white border-2 ${errors.date ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200`}
                        />
                        {errors.date && (
                          <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>{errors.date.message}</span>
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="maxCapacity"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                          <UserGroupIcon className="w-4 h-4 text-indigo-500" />
                          <span>Max Capacity <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          {...field}
                          type="number"
                          min="1"
                          max="500"
                          className={`w-full px-4 py-3 bg-white border-2 ${errors.maxCapacity ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200`}
                          placeholder="e.g., 25"
                        />
                        {errors.maxCapacity && (
                          <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>{errors.maxCapacity.message}</span>
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Time Slots Section */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Time Slots <span className="text-red-500">*</span></span>
                </h3>
                <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                  {fields.length} slot{fields.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="group bg-white rounded-lg p-4 border-2 border-slate-200 hover:border-indigo-300 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Controller
                          name={`timeSlots.${index}.startTime`}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Start Time
                              </label>
                              <input
                                {...field}
                                type="text"
                                className={`w-full px-3 py-2 bg-slate-50 border ${errors.timeSlots?.[index]?.startTime ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200`}
                                placeholder="10:00 AM"
                              />
                              {errors.timeSlots?.[index]?.startTime && (
                                <p className="mt-1 text-xs text-red-600">{errors.timeSlots[index].startTime.message}</p>
                              )}
                            </div>
                          )}
                        />
                        
                        <Controller
                          name={`timeSlots.${index}.endTime`}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1">
                                End Time
                              </label>
                              <input
                                {...field}
                                type="text"
                                className={`w-full px-3 py-2 bg-slate-50 border ${errors.timeSlots?.[index]?.endTime ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200`}
                                placeholder="12:00 PM"
                              />
                              {errors.timeSlots?.[index]?.endTime && (
                                <p className="mt-1 text-xs text-red-600">{errors.timeSlots[index].endTime.message}</p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        className={`p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ${
                          fields.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.timeSlots && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{errors.timeSlots.message}</span>
                </p>
              )}
              
              <button
                type="button"
                onClick={() => append({ startTime: '', endTime: '' })}
                className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="font-medium">Add Time Slot</span>
              </button>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
              >
                Create Workshop
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkshopForm;