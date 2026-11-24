import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { label: 'Overview', path: '/dashboard', icon: Squares2X2Icon },
  { label: 'Workshops', path: '/workshops', icon: CalendarDaysIcon },
  { label: 'Bookings', path: '/bookings', icon: ClipboardDocumentListIcon },
];

const pageNames = {
  '/dashboard': 'Overview',
  '/workshops': 'Workshops',
  '/bookings': 'Bookings',
};

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = location.pathname.startsWith('/workshops/')
    ? 'Workshop details'
    : pageNames[location.pathname] || 'Overview';

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f6f7f5] text-[#20251f]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-[#172019]/35 backdrop-blur-[2px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[256px] flex-col border-r border-[#e8ebe6] bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-[#eef0ec] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#426b55] text-white">
            <CalendarDaysIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold tracking-[-0.03em] text-[#20251f]">Workshop</p>
            <p className="text-[11px] font-medium tracking-[0.12em] text-[#899188]">ADMIN CONSOLE</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeSidebar}
            className="ml-auto rounded-lg p-2 text-[#778078] hover:bg-[#f3f5f1] lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa198]">Workspace</p>
          <nav className="space-y-1" aria-label="Main navigation">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-colors ${isActive ? 'bg-[#edf3ee] text-[#365d45]' : 'text-[#687168] hover:bg-[#f5f6f3] hover:text-[#28332b]'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-[19px] w-[19px] ${isActive ? 'text-[#426b55]' : 'text-[#899188] group-hover:text-[#59665b]'}`} />
                    <span>{label}</span>
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#426b55]" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#eef0ec] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f7f8f6] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe9e0] text-xs font-bold text-[#426b55]">A</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#303a32]">Administrator</p>
              <p className="text-[11px] text-[#899188]">Workspace access</p>
            </div>
            <ChevronRightIcon className="ml-auto h-4 w-4 text-[#a0a79f]" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#7a8279] transition-colors hover:bg-[#fbefed] hover:text-[#a34d40]"
          >
            <ArrowLeftOnRectangleIcon className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[256px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e8ebe6] bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#657066] hover:bg-[#f3f5f1] lg:hidden"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#9aa198]">
                <span>Workspace</span>
                <ChevronRightIcon className="h-3 w-3" />
                <span className="text-[#647064]">{pageTitle}</span>
              </div>
              <h1 className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-[#29332b]">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e8ebe6] bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5d9b6b]" />
            <span className="text-[11px] font-semibold text-[#687168]">System online</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
