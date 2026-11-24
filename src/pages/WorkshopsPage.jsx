import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminWorkshops, createWorkshop } from '../api/adminApi';
import WorkshopForm from '../components/WorkshopForm';
import { PlusIcon, CalendarDaysIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Chip } from '@mui/material';

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
          '& .MuiDataGrid-row:hover': { backgroundColor: '#f8faf7', cursor: 'pointer' },
          '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e8ebe6' },
          '& .MuiTablePagination-root': { color: '#707a70', fontSize: '12px' },
          '& .MuiDataGrid-columnSeparator': { color: '#e8ebe6' },
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

// Workshop dates are date-only values normalized to midnight UTC.
const isPastWorkshopDate = (date) =>
  new Date(date).toISOString().slice(0, 10) < getBusinessDateKey();

const StatusChip = ({ label, tone = 'neutral' }) => {
  const tones = {
    success: 'bg-[#edf4ee] text-[#426b55]',
    neutral: 'bg-[#f0f2ef] text-[#727b72]',
  };
  return (
    <span className={`inline-flex h-7 min-h-7 max-h-7 shrink-0 self-center items-center rounded-full px-3 text-[11px] leading-none font-semibold ${tones[tone]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${tone === 'success' ? 'bg-[#5b9068]' : 'bg-[#9aa198]'}`} />
      {label}
    </span>
  );
};

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchWorkshops = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminWorkshops();
      setWorkshops(data);
    } catch (err) {
      console.error('Error fetching workshops:', err);
      setError('We couldn’t load workshops. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleCloseModal = () => {
    if (formSubmitting) return;
    setIsModalOpen(false);
  };

  const handleCreateWorkshop = async (data) => {
    setFormSubmitting(true);
    setError('');
    try {
      const payload = { ...data, date: new Date(data.date).toISOString() };
      const newWorkshop = await createWorkshop(payload);
      setWorkshops((previous) => [newWorkshop, ...previous]);
      setIsModalOpen(false);
      setNotice('Workshop created successfully.');
      window.setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workshop.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Workshop',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3ee] text-[#557b60]">
            <CalendarDaysIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="truncate font-semibold text-[#303a32]">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 150,
      flex: 0.8,
      valueGetter: (value) => value
        ? new Date(value).toLocaleDateString('en-US', { timeZone: 'Africa/Addis_Ababa', month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A',
    },
    { field: 'maxCapacity', headerName: 'Capacity', type: 'number', width: 120 },
    {
      field: '_count',
      headerName: 'Bookings',
      type: 'number',
      width: 120,
      valueGetter: (value) => value?.bookings ?? 0,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      sortable: false,
      renderCell: (params) => params.row.deletedAt
        ? <StatusChip label="Archived" />
        : isPastWorkshopDate(params.row.date)
          ? <StatusChip label="Past" />
          : <StatusChip label="Active" tone="success" />,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="muted-label">Manage your schedule</p>
          <h2 className="page-heading mt-2 text-[30px] font-bold leading-tight text-[#20251f] sm:text-[34px]">
            Workshops
          </h2>
          <p className="mt-2 text-sm text-[#7b837b]">
            Create workshops, manage availability, and keep track of bookings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#426b55] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#345640] sm:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          Create workshop
        </button>
      </section>

      {notice && (
        <div role="status" className="rounded-xl border border-[#dce9dd] bg-[#f1f7f1] px-4 py-3 text-sm font-medium text-[#426b55]">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-[#f0d9d5] bg-[#fbf2f0] px-4 py-3 text-sm text-[#a34d40]">
          <span>{error}</span>
          <button type="button" onClick={fetchWorkshops} className="inline-flex shrink-0 items-center gap-1.5 font-semibold hover:underline">
            <ArrowPathIcon className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      <section className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#eef0ec] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-[#303a32]">All workshops</h3>
            <p className="mt-1 text-xs text-[#929990]">{workshops.length} workshop{workshops.length === 1 ? '' : 's'} in your workspace</p>
          </div>
          <button
            type="button"
            onClick={fetchWorkshops}
            disabled={loading}
            aria-label="Refresh workshops"
            className="rounded-lg border border-[#e8ebe6] p-2 text-[#778078] transition hover:bg-[#f6f8f5] disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <ThemeProvider theme={theme}>
          <DataGrid
            id="workshops-grid"
            rows={workshops}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/workshops/${params.id}`)}
            sx={{
              border: 0,
              minHeight: 420,
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            }}
            slots={{
              noRowsOverlay: () => (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f4f0] text-[#829082]">
                    <CalendarDaysIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#59645a]">No workshops yet</p>
                  <p className="mt-1 text-xs text-[#929990]">Create your first workshop to get started.</p>
                </div>
              ),
            }}
          />
        </ThemeProvider>
      </section>

      {isModalOpen && (
        <WorkshopForm
          isOpen
          onSubmit={handleCreateWorkshop}
          onCancel={handleCloseModal}
          isSubmitting={formSubmitting}
        />
      )}
    </div>
  );
};

export default WorkshopsPage;
