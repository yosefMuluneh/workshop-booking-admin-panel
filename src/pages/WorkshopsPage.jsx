import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminWorkshops, createWorkshop } from '../api/adminApi';
import WorkshopForm from '../components/WorkshopForm';
import { PlusIcon } from '@heroicons/react/24/solid';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Chip } from '@mui/material';

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
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.875rem',
          padding: '4px 12px',
          borderRadius: '9999px',
        },
        colorSuccess: {
          backgroundColor: '#dcfce7',
          color: '#15803d',
        },
        colorDefault: {
          backgroundColor: '#e5e7eb',
          color: '#4b5563',
        },
      },
    },
  },
});

const getBusinessDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Addis_Ababa',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

// Workshop dates are stored as date-only values normalized to midnight UTC.
const isPastWorkshopDate = (date) =>
  new Date(date).toISOString().slice(0, 10) < getBusinessDateKey();

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const fetchWorkshops = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminWorkshops();
      setWorkshops(data);
    } catch (err) {
      console.error('Error fetching workshops:', err);
      setError('Failed to fetch workshops.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormSuccess('');
    setFormError('');
    setFormSubmitting(false);
  };

  const handleCreateWorkshop = async (data) => {
    setFormSubmitting(true);
    setFormSuccess('');
    setFormError('');
    try {
      const payload = { ...data, date: new Date(data.date).toISOString() };
      const newWorkshop = await createWorkshop(payload);
      setWorkshops((prevWorkshops) => [newWorkshop, ...prevWorkshops]);
      setFormSuccess('Workshop created successfully!');
      setTimeout(handleCloseModal, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create workshop.');
      setFormSubmitting(false);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200, filterable: true, sortable: true },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      filterable: true,
      sortable: true,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      field: 'maxCapacity',
      headerName: 'Capacity',
      type: 'number',
      width: 120,
      filterable: true,
      sortable: true,
    },
    {
      field: '_count',
      headerName: 'Bookings',
      type: 'number',
      width: 120,
      filterable: true,
      sortable: true,
      valueGetter: (value) => ( value ? value?.bookings : 0)
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        params.row.deletedAt ? (
          <Chip label="Archived" color="default" size="small" />
        ) : isPastWorkshopDate(params.row.date) ? (
          <Chip label="Out Dated" color="default" size="small" />
        ) : (
          <Chip label="Active" color="success" size="small" />
        )
      ),
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <img
                  src="/images/cover.jpg"
                  alt="Workshops"
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={() => console.error('Header image failed to load: /images/cover.jpg')}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">
                  Workshop Management
                </h1>
                <p className="text-slate-600 text-sm">
                  Create, manage, and track your workshops
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Create Workshop</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.267 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Modern Data Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ThemeProvider theme={theme}>
            <DataGrid
              id="workshops-grid"
              rows={workshops}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              onRowClick={(params) => navigate(`/workshops/${params.id}`)}
              className="h-[650px] w-full"
              autoHeight={false}
              slots={{
                noRowsOverlay: () => (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <PlusIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No workshops found</p>
                    <p className="text-sm text-slate-500 mb-4">Get started by creating your first workshop</p>
                    <button
                      onClick={handleOpenModal}
                      className="bg-indigo-600 text-white px-4 py-2 mb-12 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Create Workshop
                    </button>
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

        {/* Modal */}
        {isModalOpen && (
          <div 
           role="dialog" 
           aria-modal="true"
           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all duration-300">
            <div className="bg-white w-full max-w-xl mx-4 p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              {formSubmitting && !formSuccess && !formError && (
                <div className="flex justify-center my-4">
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
              )}
              {formSuccess && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 font-poppins text-sm">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 font-poppins text-sm">
                  {formError}
                </div>
              )}
              <WorkshopForm 
                isOpen={false}
                onSubmit={handleCreateWorkshop} 
                onCancel={handleCloseModal} 
              />
            </div>
          </div>
        )}
        
        {/* New Enhanced Modal */}
        <WorkshopForm 
          isOpen={isModalOpen}
          onSubmit={handleCreateWorkshop} 
          onCancel={handleCloseModal} 
        />
      </div>
    </div>
  );
};

export default WorkshopsPage;