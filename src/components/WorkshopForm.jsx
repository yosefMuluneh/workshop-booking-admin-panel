import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

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

const WorkshopForm = ({ onSubmit, onCancel, defaultValues = {} }) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex items-center mb-6">
        <img
          src="/images/workshop.jpg"
          alt="Workshop Form"
          className="h-8 w-8 rounded-full object-cover mr-2"
          onError={() => console.error('Form image failed to load: /images/workshop.jpg')}
        />
        <h2 className="text-2xl font-bold text-gray-800 font-poppins sm:text-xl">
          Create a New Workshop
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Workshop Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...field}
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                  placeholder="Enter workshop title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.title.message}</p>
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
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                  placeholder="Enter workshop description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.description.message}</p>
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
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  {...field}
                  type="date"
                  className={`w-full px-4 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.date.message}</p>
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
                <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                  Max Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  {...field}
                  type="number"
                  className={`w-full px-4 py-2 border ${errors.maxCapacity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                  placeholder="Enter max capacity"
                />
                {errors.maxCapacity && (
                  <p className="mt-1 text-sm text-red-500 font-poppins">{errors.maxCapacity.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 font-poppins mb-2">Time Slots <span className="text-red-500">*</span></h3>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end space-x-2 mb-2">
              <div className="flex-1">
                <Controller
                  name={`timeSlots.${index}.startTime`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                        Start Time
                      </label>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-2 border ${errors.timeSlots?.[index]?.startTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                        placeholder="e.g., 10:00 AM"
                      />
                      {errors.timeSlots?.[index]?.startTime && (
                        <p className="mt-1 text-sm text-red-500 font-poppins">{errors.timeSlots[index].startTime.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  name={`timeSlots.${index}.endTime`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-poppins mb-1">
                        End Time
                      </label>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-2 border ${errors.timeSlots?.[index]?.endTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-poppins transition-all duration-300`}
                        placeholder="e.g., 12:00 PM"
                      />
                      {errors.timeSlots?.[index]?.endTime && (
                        <p className="mt-1 text-sm text-red-500 font-poppins">{errors.timeSlots[index].endTime.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                className={`p-2 text-gray-500 hover:text-red-500 ${fields.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'} rounded-full transition-all duration-300`}
              >
                <MinusIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {errors.timeSlots && (
            <p className="mt-1 text-sm text-red-500 font-poppins">{errors.timeSlots.message}</p>
          )}
          <button
            type="button"
            onClick={() => append({ startTime: '', endTime: '' })}
            className="mt-2 bg-amber-400 text-white px-4 py-2 rounded-lg font-poppins flex items-center space-x-2 hover:bg-amber-500 transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Time Slot</span>
          </button>
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-poppins hover:bg-gray-300 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-poppins hover:bg-indigo-700 transition-all duration-300"
        >
          Create Workshop
        </button>
      </div>
    </form>
  );
};

export default WorkshopForm;