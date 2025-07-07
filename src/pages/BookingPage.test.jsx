import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Ensure this path is correct
import BookingsPage from './BookingsPage';
import * as adminApi from '../api/adminApi';

// Mocks
vi.mock('../api/adminApi');

// Test Data
const mockBookingsResponse = {
  data: [
    { 
      id: 'booking-1', 
      status: 'PENDING', 
      user: { name: 'John Doe', email: 'john@example.com' }, 
      workshop: { title: 'Yoga Basics' }, 
      timeSlot: { startTime: '9 AM', endTime: '10 AM' } 
    }
  ],
  pagination: { total: 1 }
};

const renderWithProviders = (ui) => {
    const store = configureStore({ reducer: { auth: authReducer } });
    return render(<Provider store={store}><BrowserRouter>{ui}</BrowserRouter></Provider>);
};

describe('BookingsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(adminApi, 'getAllBookings').mockResolvedValue(mockBookingsResponse);
    });

    it('should display bookings data after fetching', async () => {
        renderWithProviders(<BookingsPage />);
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Yoga Basics')).toBeInTheDocument();
    });

    it('should open actions menu and allow status update', async () => {
        // Arrange
        const updateMock = vi.spyOn(adminApi, 'updateBookingStatus').mockResolvedValue({ success: true });
        renderWithProviders(<BookingsPage />);

        // Act
        // 1. Find the specific row we want to interact with.
        // We find it by looking for the cell that contains "John Doe".
        const row = await screen.findByRole('row', { name: /john doe/i });

        // If the above still fails, uncomment this line to see the HTML output in your console
        // screen.debug(row);

        // 2. Now, find the actions button *within* that specific row.
        const actionButton = within(row).getByRole('button', { name: /actions for booking/i });
        await userEvent.click(actionButton);

        // 3. Find the menu item and click it. The menu appears at the document root, not inside the row.
        const confirmMenuItem = await screen.findByText(/set to confirmed/i);
        await userEvent.click(confirmMenuItem);

        // Assert
        await waitFor(() => {
            expect(updateMock).toHaveBeenCalledWith('booking-1', 'CONFIRMED');
        });

        // The UI should update. The chip text will change.
        const updatedRow = await screen.findByRole('row', { name: /john doe/i });
        expect(within(updatedRow).getByText('Confirmed')).toBeInTheDocument();
        expect(within(updatedRow).queryByText('Pending')).not.toBeInTheDocument();
    });
});