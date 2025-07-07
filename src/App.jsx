import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkshopsPage from './pages/WorkshopsPage';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import WorkshopDetailPage from './pages/WorkshopDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="workshops" element={<WorkshopsPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="workshops/:id" element={<WorkshopDetailPage />} />
                <Route path="/" element={<DashboardPage />} /> {/* Default to dashboard */}
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;