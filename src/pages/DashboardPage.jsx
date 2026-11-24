import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ label, value, helper, icon: Icon, accent, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="surface group min-w-0 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d5dfd6] hover:shadow-md sm:p-6"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#7b837b]">{label}</p>
        <p className="mt-3 page-heading text-[32px] font-bold leading-none text-[#20251f]">{value ?? '—'}</p>
        <p className="mt-3 text-xs text-[#929990]">{helper}</p>
      </div>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#55745e]">
      <span>View details</span>
      <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </div>
  </button>
);

const chartTooltipStyle = {
  border: '1px solid #e8ebe6',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgb(25 35 25 / 8%)',
  fontSize: '12px',
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('area');
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('We couldn’t load the dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
    else navigate('/login');
  }, [token, navigate]);

  const renderChart = () => {
    const commonProps = {
      data: stats?.popularWorkshops || [],
      margin: { top: 12, right: 12, left: -18, bottom: 8 },
    };
    const axisProps = {
      tickLine: false,
      axisLine: false,
      tick: { fill: '#929990', fontSize: 11 },
    };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid vertical={false} stroke="#edf0eb" strokeDasharray="3 3" />
          <XAxis dataKey="title" {...axisProps} tickMargin={12} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f5f7f3' }} />
          <Bar dataKey="bookings" fill="#557b60" radius={[5, 5, 0, 0]} maxBarSize={44} name="Bookings" />
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid vertical={false} stroke="#edf0eb" strokeDasharray="3 3" />
          <XAxis dataKey="title" {...axisProps} tickMargin={12} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line type="monotone" dataKey="bookings" stroke="#557b60" strokeWidth={2.5} dot={{ r: 3, fill: '#557b60', strokeWidth: 0 }} activeDot={{ r: 5 }} name="Bookings" />
        </LineChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#557b60" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#557b60" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#edf0eb" strokeDasharray="3 3" />
        <XAxis dataKey="title" {...axisProps} tickMargin={12} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip contentStyle={chartTooltipStyle} />
        <Area type="monotone" dataKey="bookings" stroke="#557b60" strokeWidth={2.5} fill="url(#bookingFill)" name="Bookings" />
      </AreaChart>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#dce5dc] border-t-[#557b60]" />
        <p className="text-sm text-[#7b837b]">Loading your workspace…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbefed] text-[#a34d40]">
          <ArrowPathIcon className="h-5 w-5" />
        </div>
        <h2 className="font-semibold text-[#303a32]">Dashboard unavailable</h2>
        <p className="mt-2 text-sm text-[#7b837b]">{error}</p>
        <button onClick={fetchStats} className="mt-5 rounded-lg bg-[#426b55] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#345640]">
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const hasChartData = Array.isArray(stats.popularWorkshops) && stats.popularWorkshops.length > 0;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="muted-label">Your workspace at a glance</p>
          <h2 className="page-heading mt-2 text-[30px] font-bold leading-tight text-[#20251f] sm:text-[34px]">Good to see you.</h2>
          <p className="mt-2 text-sm text-[#7b837b]">Here’s what’s happening across your workshops.</p>
        </div>
        <button
          type="button"
          onClick={fetchStats}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#e2e7e0] bg-white px-3.5 text-xs font-semibold text-[#5d685e] transition hover:border-[#cbd8cc] hover:bg-[#fafbf9] sm:self-auto"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh data
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total bookings"
          value={stats.totalBookings}
          helper="All bookings recorded"
          icon={ClipboardDocumentListIcon}
          accent="bg-[#edf3ee] text-[#426b55]"
          onClick={() => navigate('/bookings')}
        />
        <StatCard
          label="Workshops"
          value={stats.totalWorkshops}
          helper="Workshops in your system"
          icon={CalendarDaysIcon}
          accent="bg-[#f1f0e9] text-[#8a7747]"
          onClick={() => navigate('/workshops')}
        />
        <div className="surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium text-[#7b837b]">Capacity filled</p>
              <p className="mt-3 page-heading text-[32px] font-bold leading-none text-[#20251f]">{stats.slotsFilledPercentage ?? 0}%</p>
              <p className="mt-3 text-xs text-[#929990]">{stats.slotsFilled ?? 0} places booked</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4eee9] text-[#9a6846]">
              <ChartBarIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]">
            <div className="h-full rounded-full bg-[#9a8052] transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, Number(stats.slotsFilledPercentage) || 0))}%` }} />
          </div>
        </div>
      </section>

      <section className="surface overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eef0ec] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-[#303a32]">Popular workshops</h3>
            <p className="mt-1 text-xs text-[#929990]">Bookings by workshop</p>
          </div>
          <div className="inline-flex self-start rounded-lg bg-[#f4f6f2] p-1 sm:self-auto">
            {['area', 'bar', 'line'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold capitalize transition ${chartType === type ? 'bg-white text-[#365d45] shadow-sm' : 'text-[#858d84] hover:text-[#4c594e]'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[320px] px-3 py-5 sm:px-6">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f5f1] text-[#879187]">
                <ChartBarIcon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#59645a]">No workshop activity yet</p>
              <p className="mt-1 text-xs text-[#929990]">Booking activity will appear here once available.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
