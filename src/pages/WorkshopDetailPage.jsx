import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  UsersIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {
  getWorkshopById,
  softDeleteWorkshop,
  restoreWorkshop,
  deleteTimeSlot,
} from '../api/adminApi';
import TimeSlotFormModal from '../components/TimeSlotFormModal';
import ConfirmationModal from '../components/ConfirmationModal';

const formatWorkshopDate = (date) => {
  if (!date) return 'Date not set';
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: 'Africa/Addis_Ababa',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const StatusPill = ({ archived, expired }) => {
  const label = archived ? 'Archived' : expired ? 'Past' : 'Active';
  const styles = archived || expired
    ? 'bg-[#f0f2ef] text-[#727b72]'
    : 'bg-[#edf4ee] text-[#426b55]';
  const dot = archived || expired ? 'bg-[#9aa198]' : 'bg-[#5b9068]';

  return (
    <span className={`inline-flex h-7 shrink-0 items-center gap-2 rounded-full px-3 text-[11px] font-semibold leading-none ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

const BookingStatusPill = ({ status }) => {
  const styles = {
    CONFIRMED: 'bg-[#edf4ee] text-[#426b55]',
    PENDING: 'bg-[#fbf4e8] text-[#98713a]',
    CANCELED: 'bg-[#fbefed] text-[#a34d40]',
  };
  const style = styles[status] || 'bg-[#f0f2ef] text-[#727b72]';

  return (
    <span className={`inline-flex h-7 shrink-0 items-center rounded-full px-3 text-[11px] font-semibold leading-none ${style}`}>
      {status || 'Unknown'}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <div className="surface flex min-w-0 items-center gap-3 p-4 sm:p-5">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ee] text-[#557b60]">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-[#7b837b]">{label}</p>
      <p className="page-heading mt-0.5 text-xl font-bold leading-tight text-[#20251f]">{value}</p>
      {detail && <p className="mt-0.5 truncate text-[11px] text-[#929990]">{detail}</p>}
    </div>
  </div>
);

const SectionCard = ({ title, subtitle, action, children }) => (
  <section className="surface overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef0ec] px-5 py-4 sm:px-6">
      <div>
        <h2 className="text-sm font-semibold text-[#303a32]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-[#929990]">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
    confirmText: 'Confirm',
    confirmColor: 'red',
  });

  const fetchWorkshop = useCallback(async () => {
    setError('');
    try {
      const data = await getWorkshopById(id);
      setWorkshop(data);
    } catch (err) {
      console.error('Error fetching workshop details:', err);
      setError(err.response?.data?.message || 'We couldn’t load this workshop. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const openConfirmation = (config) => {
    setConfirmation({
      isOpen: true,
      confirmText: 'Confirm',
      confirmColor: 'red',
      ...config,
    });
  };

  const closeConfirmation = () => {
    setConfirmation((previous) => ({ ...previous, isOpen: false }));
  };

  const handleArchive = () => {
    openConfirmation({
      title: 'Archive workshop?',
      message: 'This workshop will be hidden from public view. Its information and booking history will be preserved, and you can restore it later.',
      confirmText: 'Archive workshop',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          await softDeleteWorkshop(id);
          await fetchWorkshop();
          showNotice('Workshop archived successfully.');
        } catch (err) {
          setError(err.response?.data?.message || 'Could not archive this workshop.');
        }
      },
    });
  };

  const handleRestore = () => {
    openConfirmation({
      title: 'Restore workshop?',
      message: 'This workshop will become visible and bookable to the public again.',
      confirmText: 'Restore workshop',
      confirmColor: 'green',
      onConfirm: async () => {
        try {
          await restoreWorkshop(id);
          await fetchWorkshop();
          showNotice('Workshop restored successfully.');
        } catch (err) {
          setError(err.response?.data?.message || 'Could not restore this workshop.');
        }
      },
    });
  };

  const handleDeleteTimeSlot = (slot) => {
    openConfirmation({
      title: 'Delete time slot?',
      message: `Delete the ${slot.startTime} – ${slot.endTime} time slot? This can only be done when it has no active bookings.`,
      confirmText: 'Delete time slot',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          await deleteTimeSlot(slot.id);
          await fetchWorkshop();
          showNotice('Time slot deleted successfully.');
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to delete this time slot.');
        }
      },
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

  const handleTimeSlotSaved = async () => {
    await fetchWorkshop();
    showNotice(editingSlot ? 'Time slot updated successfully.' : 'Time slot added successfully.');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <ArrowPathIcon className="h-7 w-7 animate-spin text-[#557b60]" />
          <p className="text-sm font-medium text-[#707a70]">Loading workshop details…</p>
        </div>
      </div>
    );
  }

  if (error && !workshop) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbefed] text-[#a34d40]">
          <ExclamationCircleIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-[#303a32]">Unable to load workshop</h2>
        <p role="alert" className="mt-2 text-sm text-[#7b837b]">{error}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => navigate('/workshops')} className="h-10 rounded-lg border border-[#e2e7e0] px-4 text-xs font-semibold text-[#5d685e] transition hover:bg-[#f6f8f5]">
            Back to workshops
          </button>
          <button type="button" onClick={() => { setLoading(true); fetchWorkshop(); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#426b55] px-4 text-xs font-semibold text-white transition hover:bg-[#345640]">
            <ArrowPathIcon className="h-4 w-4" /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!workshop) return null;

  const timeSlots = workshop.timeSlots || [];
  const bookings = workshop.bookings || [];
  const isArchived = Boolean(workshop.deletedAt);
  const isExpired = new Date(workshop.date) <= new Date();

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/workshops')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#778078] transition hover:text-[#426b55]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to workshops
        </button>

        <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="muted-label">Workshop overview</p>
              <StatusPill archived={isArchived} expired={isExpired} />
            </div>
            <h1 className="page-heading mt-2 break-words text-[30px] font-bold leading-tight text-[#20251f] sm:text-[34px]">
              {workshop.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#7b837b]">
              <span className="inline-flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-[#899188]" />
                {formatWorkshopDate(workshop.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4 text-[#899188]" />
                Capacity: {workshop.maxCapacity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-[#dce9dd] bg-[#f1f7f1] px-4 py-3 text-sm font-medium text-[#426b55]">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-[#f0d9d5] bg-[#fbf2f0] px-4 py-3 text-sm text-[#a34d40]">
          <span>{error}</span>
          <button type="button" onClick={fetchWorkshop} className="shrink-0 font-semibold hover:underline">Retry</button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={UsersIcon} label="Total bookings" value={bookings.length} detail="Reservations for this workshop" />
        <StatCard icon={ClockIcon} label="Time slots" value={timeSlots.length} detail="Scheduled sessions" />
        <StatCard icon={Squares2X2Icon} label="Maximum capacity" value={workshop.maxCapacity} detail="Participant limit" />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0 space-y-6">
          <SectionCard title="Description" subtitle="What participants can expect">
            {workshop.description ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#59645a]">{workshop.description}</p>
            ) : (
              <p className="text-sm text-[#929990]">No description has been added.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Time slots"
            subtitle={`${timeSlots.length} scheduled session ${timeSlots.length === 1 ? '' : 's'}`}
            action={
              <button
                type="button"
                onClick={() => handleTimeSlotModalOpen()}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#426b55] px-3 text-xs font-semibold text-white transition hover:bg-[#345640]"
              >
                <PlusIcon className="h-4 w-4" />
                Add time slot
              </button>
            }
          >
            {timeSlots.length > 0 ? (
              <div className="divide-y divide-[#eef0ec]">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f0] text-[#557b60]">
                        <ClockIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#303a32]">{slot.startTime} – {slot.endTime}</p>
                        <p className="mt-1 text-xs text-[#929990]">
                          {slot.availableSpots ?? 0} of {workshop.maxCapacity} spots available
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleTimeSlotModalOpen(slot)}
                        aria-label={`Edit time slot ${slot.startTime} to ${slot.endTime}`}
                        className="rounded-lg p-2 text-[#899188] transition hover:bg-[#f1f4f0] hover:text-[#426b55]"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTimeSlot(slot)}
                        aria-label={`Delete time slot ${slot.startTime} to ${slot.endTime}`}
                        className="rounded-lg p-2 text-[#899188] transition hover:bg-[#fbefed] hover:text-[#a34d40]"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1f4f0] text-[#829082]">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-[#59645a]">No time slots yet</p>
                <p className="mt-1 text-xs text-[#929990]">Add a session so participants can choose when to attend.</p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Bookings"
            subtitle={`${bookings.length} reservation${bookings.length === 1 ? '' : 's'} for this workshop`}
          >
            {bookings.length > 0 ? (
              <div className="divide-y divide-[#eef0ec]">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f4f0] text-xs font-bold text-[#557b60]">
                        {(booking.user?.name || 'N').trim().charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#303a32]">{booking.user?.name || 'N/A'}</p>
                        <p className="truncate text-xs text-[#929990]">{booking.user?.email || 'No email provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      {booking.timeSlot && (
                        <span className="text-xs text-[#7b837b]">
                          {booking.timeSlot.startTime} – {booking.timeSlot.endTime}
                        </span>
                      )}
                      <BookingStatusPill status={booking.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1f4f0] text-[#829082]">
                  <UsersIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-[#59645a]">No bookings yet</p>
                <p className="mt-1 text-xs text-[#929990]">Customer reservations will appear here.</p>
              </div>
            )}
          </SectionCard>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[#303a32]">Workshop details</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#899188]" />
                <div>
                  <p className="text-xs text-[#929990]">Workshop date</p>
                  <p className="mt-1 text-sm font-medium text-[#59645a]">{formatWorkshopDate(workshop.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserGroupIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#899188]" />
                <div>
                  <p className="text-xs text-[#929990]">Maximum capacity</p>
                  <p className="mt-1 text-sm font-medium text-[#59645a]">{workshop.maxCapacity} participants</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#899188]" />
                <div>
                  <p className="text-xs text-[#929990]">Scheduled time slots</p>
                  <p className="mt-1 text-sm font-medium text-[#59645a]">{timeSlots.length} session{timeSlots.length === 1 ? '' : 's'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[#303a32]">Workshop actions</h2>
            <p className="mt-1 text-xs leading-5 text-[#929990]">
              {isExpired
                ? 'This workshop has passed. Archive and restore actions are unavailable.'
                : isArchived
                  ? 'This workshop is archived and hidden from public view.'
                  : 'Archiving hides this workshop from public view without removing its history.'}
            </p>
            <div className="mt-4">
              {isArchived ? (
                <button
                  type="button"
                  disabled={isExpired}
                  onClick={handleRestore}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#426b55] px-4 text-xs font-semibold text-white transition hover:bg-[#345640] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowUturnUpIcon className="h-4 w-4" />
                  Restore workshop
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isExpired}
                  onClick={handleArchive}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#eadbd8] bg-white px-4 text-xs font-semibold text-[#a34d40] transition hover:bg-[#fbf2f0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArchiveBoxIcon className="h-4 w-4" />
                  Archive workshop
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>

      <TimeSlotFormModal
        isOpen={isTimeSlotModalOpen}
        onClose={handleTimeSlotModalClose}
        workshopId={workshop.id}
        editingSlot={editingSlot}
        onSave={handleTimeSlotSaved}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
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
