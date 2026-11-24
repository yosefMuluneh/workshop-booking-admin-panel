import React, { useState, useEffect, useCallback } from 'react';
import { getAllBookings, updateBookingStatus } from '../api/adminApi';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  EllipsisVerticalIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const theme = createTheme({
  typography: { fontFamily: "'DM Sans', sans-serif" },
  palette: { primary: { main: '#426b55' } },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          color: '#303a32',
          fontSize: '13px',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9f7',
            borderBottom: '1px solid #e8ebe6',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#707a70',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-cell': {
            borderColor: '#eef0ec',
            paddingLeft: '18px',
            paddingRight: '18px',
          },
          '& .MuiDataGrid-row:hover': { backgroundColor: '#f8faf7' },
          '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e8ebe6' },
          '& .MuiTablePagination-root': { color: '#707a70', fontSize: '12px' },
        },
      },
    },
  },
});

const statusConfig = {
  PENDING: { label: 'Pending', icon: ClockIcon, style: 'bg-[#fbf4e8] text-[#98713a]' },
  CONFIRMED: { label: 'Confirmed', icon: CheckIcon, style: 'bg-[#edf4ee] text-[#426b55]' },
  CANCELED: { label: 'Canceled', icon: XMarkIcon, style: 'bg-[#fbefed] text-[#a34d40]' },
};

const BookingStatus = ({ status }) => {
  const config = statusConfig[status] || { label: 'Unknown', icon: ClockIcon, style: 'bg-[#f0f2ef] text-[#727b72]' };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.style}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

const BookingsPage = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [bookingsData, setBookingsData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllBookings({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      setBookingsData({ data: response.data, total: response.pagination.total });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('We couldn’t load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedBookingId(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedBookingId || updating) return;
    setUpdating(true);
    setError('');
    try {
      await updateBookingStatus(selectedBookingId, newStatus);
      setBookingsData((previous) => ({
        ...previous,
        data: previous.data.map((booking) =>
          booking.id === selectedBookingId ? { ...booking, status: newStatus } : booking
        ),
      }));
      setNotice('Booking status updated.');
      window.setTimeout(() => setNotice(''), 3000);
      closeMenu();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError(err.response?.data?.message || 'Could not update the booking status.');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.1,
      minWidth: 180,
      sortable: false,
      valueGetter: (value, row) => row.user?.name || 'N/A',
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#303a32]">{params.row.user?.name || 'N/A'}</p>
          <p className="truncate text-[11px] text-[#929990]">{params.row.user?.email || 'No email'}</p>
        </div>
      ),
    },
    {
      field: 'workshop',
      headerName: 'Workshop',
      flex: 1.2,
      minWidth: 190,
      sortable: false,
      valueGetter: (value, row) => row.workshop?.title || 'N/A',
      renderCell: (params) => (
        <span className="truncate font-medium text-[#59645a]">{params.row.workshop?.title || 'N/A'}</span>
      ),
    },
    {
      field: 'timeSlot',
      headerName: 'Time slot',
      flex: 0.9,
      minWidth: 150,
      sortable: false,
      valueGetter: (value, row) => row.timeSlot
        ? `${row.timeSlot.startTime} - ${row.timeSlot.endTime}`
        : 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      sortable: false,
      renderCell: (params) => <BookingStatus status={params.row.status} />,
    },
    {
      field: 'actions',
      headerName: '',
      width: 72,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
        <button
          type="button"
          aria-label={`Change status for booking ${params.row.id}`}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setSelectedBookingId(params.row.id);
          }}
          className="rounded-lg p-2 text-[#899188] transition hover:bg-[#f1f4f0] hover:text-[#426b55]"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      ),
    },
  ];

  const counts = bookingsData.data.reduce((result, booking) => {
    result[booking.status] = (result[booking.status] || 0) + 1;
    return result;
  }, {});

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="muted-label">Reservations overview</p>
          <h2 className="page-heading mt-2 text-[30px] font-bold leading-tight text-[#20251f] sm:text-[34px]">
            Bookings
          </h2>
          <p className="mt-2 text-sm text-[#7b837b]">Review customer reservations and manage their booking status.</p>
        </div>
        <button
          type="button"
          onClick={fetchBookings}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#e2e7e0] bg-white px-3.5 text-xs font-semibold text-[#5d685e] transition hover:border-[#cbd8cc] hover:bg-[#fafbf9] disabled:opacity-50 sm:self-auto"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="surface p-4">
          <p className="text-xs font-medium text-[#7b837b]">Total bookings</p>
          <p className="page-heading mt-2 text-2xl font-bold text-[#20251f]">{bookingsData.total}</p>
        </div>
        <div className="surface p-4">
          <p className="text-xs font-medium text-[#7b837b]">Pending on page</p>
          <p className="page-heading mt-2 text-2xl font-bold text-[#98713a]">{counts.PENDING || 0}</p>
        </div>
        <div className="surface p-4">
          <p className="text-xs font-medium text-[#7b837b]">Confirmed on page</p>
          <p className="page-heading mt-2 text-2xl font-bold text-[#426b55]">{counts.CONFIRMED || 0}</p>
        </div>
        <div className="surface p-4">
          <p className="text-xs font-medium text-[#7b837b]">Canceled on page</p>
          <p className="page-heading mt-2 text-2xl font-bold text-[#a34d40]">{counts.CANCELED || 0}</p>
        </div>
      </section>

      {notice && <div role="status" className="rounded-xl border border-[#dce9dd] bg-[#f1f7f1] px-4 py-3 text-sm font-medium text-[#426b55]">{notice}</div>}
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-[#f0d9d5] bg-[#fbf2f0] px-4 py-3 text-sm text-[#a34d40]">
          <span>{error}</span>
          <button type="button" onClick={fetchBookings} className="shrink-0 font-semibold hover:underline">Retry</button>
        </div>
      )}

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#eef0ec] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-[#303a32]">All bookings</h3>
            <p className="mt-1 text-xs text-[#929990]">Customer and reservation details</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ee] text-[#557b60]">
            <ClipboardDocumentListIcon className="h-[18px] w-[18px]" />
          </span>
        </div>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={bookingsData.data}
            columns={columns}
            loading={loading}
            rowCount={bookingsData.total}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              minHeight: 420,
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            }}
            slots={{
              noRowsOverlay: () => (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f4f0] text-[#829082]">
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#59645a]">No bookings found</p>
                  <p className="mt-1 text-xs text-[#929990]">New reservations will appear here.</p>
                </div>
              ),
            }}
          />
        </ThemeProvider>
      </section>

      {anchorEl && (
        <>
          <button type="button" aria-label="Close booking actions" className="fixed inset-0 z-40 cursor-default" onClick={closeMenu} />
          <div
            className="fixed z-50 w-48 rounded-xl border border-[#e8ebe6] bg-white p-1.5 shadow-xl"
            style={{
              top: anchorEl.getBoundingClientRect().bottom + 6,
              left: Math.max(12, anchorEl.getBoundingClientRect().right - 192),
            }}
          >
            {[
              { value: 'CONFIRMED', label: 'Mark confirmed', icon: CheckIcon },
              { value: 'PENDING', label: 'Mark pending', icon: ClockIcon },
              { value: 'CANCELED', label: 'Cancel booking', icon: XMarkIcon },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate(value)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#59645a] transition hover:bg-[#f5f7f4] disabled:opacity-50"
              >
                <Icon className="h-4 w-4 text-[#899188]" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsPage;
