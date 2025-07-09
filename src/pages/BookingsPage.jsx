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
      field: 'status',
      headerName: 'Status',
      width: 150,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        params.row.deletedAt ? (
          <Chip label="Archived" color="default" size="small" />
        ) : (
          <Chip label="Active" color="success" size="small" />
        )
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
              alt="Workshops"
              className="h-10 w-10 rounded-full object-cover mr-3"
              onError={() => console.error('Header image failed to load: /images/workshop.jpg')}
            />
            <h1 className="text-3xl font-bold text-gray-800 font-poppins sm:text-2xl">
              Workshops
            </h1>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg font-poppins flex items-center space-x-2 hover:bg-teal-600 transition-all duration-300 sm:px-3"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Workshop</span>
          </button>
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
              className="h-[650px] w-full my-2"
              autoHeight={false}
              slots={{
                noRowsOverlay: () => (
                  <div className="flex items-center justify-center h-full text-gray-600 font-poppins">
                    No workshops available.
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
              <WorkshopForm onSubmit={handleCreateWorkshop} onCancel={handleCloseModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopsPage;