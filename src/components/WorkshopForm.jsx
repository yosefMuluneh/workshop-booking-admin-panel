import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PlusIcon, MinusIcon, CalendarDaysIcon, UserGroupIcon, ClockIcon,
  XMarkIcon, SparklesIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline';

const toTimeInputValue = (value = '') => {
  if (!value) return '';
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return value;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
};

const toApiTimeValue = (value = '') => {
  if (!value) return '';
  const [rawHours, minutes] = value.split(':');
  const hours = Number(rawHours);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${String(hours % 12 || 12).padStart(2, '0')}:${minutes} ${suffix}`;
};

const timeSlotSchema = z.object({
  startTime: z.string().min(1, 'Choose a start time'),
  endTime: z.string().min(1, 'Choose an end time'),
}).refine(({ startTime, endTime }) => !startTime || !endTime || endTime > startTime, {
  message: 'End time must be later than start time',
  path: ['endTime'],
});

const workshopSchema = z.object({
  title: z.string().min(3, 'Enter at least 3 characters'),
  description: z.string().min(10, 'Enter at least 10 characters'),
  date: z.string().min(1, 'Choose a workshop date'),
  maxCapacity: z.coerce.number().int().positive('Capacity must be greater than zero'),
  timeSlots: z.array(timeSlotSchema).min(1, 'Add at least one time slot'),
});

const inputClass = 'mt-2 w-full rounded-xl border border-[#e3e8e1] bg-white px-4 py-3 text-sm text-[#303a32] shadow-sm outline-none transition placeholder:text-[#a0a89f] hover:border-[#cbd7ca] focus:border-[#426b55] focus:ring-4 focus:ring-[#426b55]/10';
const labelClass = 'block text-xs font-bold uppercase tracking-[.08em] text-[#69756a]';

const WorkshopForm = ({ onSubmit, onCancel, defaultValues = {}, isOpen = true, isSubmitting = false }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      maxCapacity: 10,
      ...defaultValues,
      timeSlots: (defaultValues.timeSlots || [{ startTime: '10:00 AM', endTime: '12:00 PM' }]).map((slot) => ({
        startTime: toTimeInputValue(slot.startTime),
        endTime: toTimeInputValue(slot.endTime),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'timeSlots' });

  const handleFormSubmit = (values) => onSubmit({
    ...values,
    timeSlots: values.timeSlots.map((slot) => ({
      startTime: toApiTimeValue(slot.startTime),
      endTime: toApiTimeValue(slot.endTime),
    })),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17231f]/45 px-3 py-6 backdrop-blur-sm sm:px-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onCancel(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="workshop-modal-title" className="my-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fbfcf9] shadow-[0_30px_100px_rgba(13,32,22,.28)]">
        <header className="relative overflow-hidden border-b border-[#e8ede6] bg-white px-6 py-6 sm:px-8">
          <div className="absolute -right-12 -top-20 h-48 w-48 rounded-full border border-[#e9eee7]" />
          <div className="absolute -right-2 -top-10 h-32 w-32 rounded-full border border-[#e9eee7]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#426b55]"><SparklesIcon className="h-6 w-6" /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#64816b]">Workshop management</p>
                <h2 id="workshop-modal-title" className="mt-1 text-xl font-bold tracking-tight text-[#26342a] sm:text-2xl">Create new workshop</h2>
                <p className="mt-1 text-sm text-[#879087]">Set up the details and schedule for your next session.</p>
              </div>
            </div>
            <button type="button" onClick={onCancel} disabled={isSubmitting} aria-label="Close modal" className="rounded-xl p-2 text-[#879087] transition hover:bg-[#f2f5f0] hover:text-[#34443a] disabled:opacity-40"><XMarkIcon className="h-5 w-5" /></button>
          </div>
        </header>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="max-h-[calc(100vh-190px)] space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          <section className="rounded-2xl border border-[#e8ede6] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-[#64866a]" />
              <div><h3 className="text-sm font-bold text-[#34443a]">Basic information</h3><p className="mt-0.5 text-xs text-[#929b91]">Give participants a clear idea of what to expect.</p></div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Workshop title <span className="text-[#b75b4d]">*</span></label>
                <Controller name="title" control={control} render={({ field }) => <input {...field} className={inputClass} placeholder="e.g. Introduction to Product Design" />} />
                {errors.title && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.title.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description <span className="text-[#b75b4d]">*</span></label>
                <Controller name="description" control={control} render={({ field }) => <textarea {...field} rows={4} className={`${inputClass} resize-y leading-6`} placeholder="Describe what participants will learn, build, or take away..." />} />
                {errors.description && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.description.message}</p>}
              </div>
              <div>
                <label className={labelClass}><CalendarDaysIcon className="mr-1.5 inline h-4 w-4" /> Workshop date <span className="text-[#b75b4d]">*</span></label>
                <Controller name="date" control={control} render={({ field }) => <input {...field} type="date" min={new Date().toISOString().slice(0, 10)} className={inputClass} />} />
                {errors.date && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.date.message}</p>}
              </div>
              <div>
                <label className={labelClass}><UserGroupIcon className="mr-1.5 inline h-4 w-4" /> Maximum capacity <span className="text-[#b75b4d]">*</span></label>
                <Controller name="maxCapacity" control={control} render={({ field }) => <input {...field} type="number" min="1" max="500" className={inputClass} placeholder="e.g. 25" />} />
                {errors.maxCapacity && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.maxCapacity.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e8ede6] bg-white p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3"><span className="h-7 w-1 rounded-full bg-[#64866a]" /><div><h3 className="text-sm font-bold text-[#34443a]">Schedule and time slots</h3><p className="mt-0.5 text-xs text-[#929b91]">Choose start and end times using the time picker.</p></div></div>
              <span className="rounded-full bg-[#edf4ee] px-3 py-1.5 text-xs font-bold text-[#426b55]">{fields.length} {fields.length === 1 ? 'slot' : 'slots'}</span>
            </div>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-[#e9ede7] bg-[#fafbf8] p-4 transition hover:border-[#d2dfd2]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-[#718071]"><ClockIcon className="h-4 w-4 text-[#64866a]" /> Session {index + 1}</span>
                    <button type="button" onClick={() => remove(index)} disabled={fields.length <= 1 || isSubmitting} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#a16a62] transition hover:bg-[#fbefed] disabled:cursor-not-allowed disabled:opacity-35"><MinusIcon className="h-3.5 w-3.5" /> Remove</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Controller name={`timeSlots.${index}.startTime`} control={control} render={({ field }) => <div><label className={labelClass}>Start time</label><input {...field} type="time" className={inputClass} />{errors.timeSlots?.[index]?.startTime && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.timeSlots[index].startTime.message}</p>}</div>} />
                    <Controller name={`timeSlots.${index}.endTime`} control={control} render={({ field }) => <div><label className={labelClass}>End time</label><input {...field} type="time" className={inputClass} />{errors.timeSlots?.[index]?.endTime && <p className="mt-1.5 text-xs font-medium text-[#b75b4d]">{errors.timeSlots[index].endTime.message}</p>}</div>} />
                  </div>
                </div>
              ))}
            </div>
            {errors.timeSlots?.message && <p className="mt-2 text-xs font-medium text-[#b75b4d]">{errors.timeSlots.message}</p>}
            <button type="button" onClick={() => append({ startTime: '', endTime: '' })} disabled={isSubmitting} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b9cbbd] bg-[#f6f9f5] px-4 py-3 text-sm font-bold text-[#426b55] transition hover:border-[#789b7d] hover:bg-[#edf4ee] disabled:opacity-50"><PlusIcon className="h-4 w-4" /> Add another time slot</button>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f5f7f2] px-3.5 py-3 text-xs leading-5 text-[#7b867b]"><InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#789477]" /> Use the time picker to avoid formatting mistakes. Times are saved in the workshop's existing 12-hour format.</div>
          </section>

          <footer className="flex flex-col-reverse gap-3 border-t border-[#e9ede7] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-full border border-[#e1e7df] px-6 py-3 text-sm font-semibold text-[#68746a] transition hover:bg-[#f4f6f2] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#426b55] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#345640] disabled:cursor-wait disabled:opacity-70">
              {isSubmitting ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Creating workshop…</> : 'Create workshop'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default WorkshopForm;
