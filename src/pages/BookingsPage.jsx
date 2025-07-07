import React, { useState, useEffect, useCallback } from 'react';
import { getAllBookings, updateBookingStatus } from '../api/adminApi';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

// Custom MUI theme with Tailwind-like styling
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: 'none',
          '& .MuiDataGrid-cell': {
            padding: '16px',
            color: '#374151',
            fontFamily: 'Poppins, sans-serif',
            transition: 'background-color 0.2s ease',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f9fafb',
            color: '#374151',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
            padding: '16px',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f3f4f6',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            fontFamily: 'Poppins, sans-serif',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '16px',
            backgroundColor: '#f9fafb',
          },
          '& .MuiDataGrid-menuIcon': {
            color: '#374151',
          },
          '& .MuiDataGrid-sortIcon': {
            color: '#374151',
          },
          '& .MuiDataGrid-filterIcon': {
            color: '#374151',
          },
        },
      },
    },
  },
});

const BookingStatusChip = ({ status }) => {
  const statusMap = {
    PENDING: { label: 'Pending', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    CONFIRMED: { label: 'Confirmed', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    CANCELED: { label: 'Canceled', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  };
  const { label, bgColor, textColor } = statusMap[status] || {
    label: 'Unknown',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-700',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-poppins ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
};

const BookingsPage = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [bookingsData, setBookingsData] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rowCountState, setRowCountState] = useState(bookingsData.total || 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = {
        page: paginationModel.page + 1, // API is 1-based, DataGrid is 0-based
        limit: paginationModel.pageSize,
      };
      const response = await getAllBookings(apiParams);
      setBookingsData({ data: response.data, total: response.pagination.total });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setRowCountState((prev) => (bookingsData.total !== undefined ? bookingsData.total : prev));
  }, [bookingsData.total]);

  const handleMenuClick = (event, bookingId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookingId(bookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookingId(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedBookingId) return;
    try {
      await updateBookingStatus(selectedBookingId, newStatus);
      setBookingsData((prev) => ({
        ...prev,
        data: prev.data.map((booking) =>
          booking.id === selectedBookingId ? { ...booking, status: newStatus } : booking
        ),
      }));
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      handleMenuClose();
    }
  };

  const columns = [
    {
      field: 'user.name',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 150,
      filterable: true,
      sortable: true,
      valueGetter: (value, row) => row.user?.name || 'N/A',
    },
    {
      field: 'user.email',
      headerName: 'Customer Email',
      flex: 1.5,
      minWidth: 200,
      filterable: true,
      sortable: true,
      valueGetter: (value, row) => row.user?.email || 'N/A',
    },
    {
      field: 'workshop.title',
      headerName: 'Workshop',
      flex: 1.5,
      minWidth: 200,
      filterable: true,
      sortable: true,
      valueGetter: (value, row) => row.workshop?.title || 'N/A',
    },
    {
      field: 'timeSlot',
      headerName: 'Time Slot',
      flex: 1,
      minWidth: 150,
      sortable: false,
      valueGetter: (value, row) => `${row.timeSlot?.startTime} - ${row.timeSlot?.endTime}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      filterable: true,
      sortable: true,
      renderCell: (params) => <BookingStatusChip status={params.row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
         <button
      // THIS IS THE CRITICAL LINE. ENSURE IT EXISTS AND IS SAVED.
      aria-label={`Actions for booking ${params.row.id}`} 
      onClick={(e) => handleMenuClick(e, params.row.id)}
      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-all duration-300"
    >
      <EllipsisVerticalIcon className="w-5 h-5" />
    </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img
              src="/images/cover.jpg"
              alt="Bookings"
              className="h-10 w-10 rounded-full object-cover mr-3"
              onError={() => console.error('Header image failed to load: /images/workshop.jpg')}
            />
            <h1 className="text-3xl font-bold text-gray-800 font-poppins sm:text-2xl">
              Bookings Management
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-poppins text-sm">
            {error}
          </div>
        )}

        {/* Data Grid */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={bookingsData.data}
              columns={columns}
              loading={loading}
              rowCount={rowCountState}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              className="h-[650px] w-full"
              slots={{
                noRowsOverlay: () => (
                  <div className="flex items-center justify-center h-full text-gray-600 font-poppins">
                    No bookings available.
                  </div>
                ),
                loadingOverlay: () => (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="animate-spin h-8 w-8 text-teal-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ),
              }}
            />
          </ThemeProvider>
        </div>

        {/* Status Update Menu */}
        {anchorEl && (
          <div
            className="fixed z-50 bg-white shadow-lg rounded-lg w-48 sm:w-40 font-poppins border border-gray-200"
            style={{
              top: anchorEl.getBoundingClientRect().bottom + window.scrollY,
              left: anchorEl.getBoundingClientRect().left + window.scrollX,
            }}
          >
            <button
              onClick={() => handleStatusUpdate('CONFIRMED')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
            >
              Set to Confirmed
            </button>
            <button
              onClick={() => handleStatusUpdate('CANCELED')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
            >
              Set to Canceled
            </button>
            <button
              onClick={() => handleStatusUpdate('PENDING')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200"
            >
              Set to Pending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;