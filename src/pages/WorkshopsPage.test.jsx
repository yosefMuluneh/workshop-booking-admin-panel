import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Ensure this path is correct
import WorkshopsPage from './WorkshopsPage';
import * as adminApi from '../api/adminApi';

// Mock the API
vi.mock('../api/adminApi');

// Mock the WorkshopForm component. We don't need to test its internals here.
vi.mock('../components/WorkshopForm', () => ({
    default: ({ onSubmit, onCancel }) => (
        <form data-testid="workshop-form" onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title: 'New Mocked Workshop', date: '2025-01-01' /* ...other data */ });
        }}>
            <button type="submit">Submit Mock Form</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    )
}));

const mockWorkshops = [
    { id: 'w1', title: 'Yoga for Life', date: '2025-10-10T00:00:00.000Z', deletedAt: null },
];

const renderWithProviders = (ui) => {
    const store = configureStore({ reducer: { auth: authReducer } });
    return render(<Provider store={store}><BrowserRouter>{ui}</BrowserRouter></Provider>);
};

describe('WorkshopsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(adminApi, 'getAdminWorkshops').mockResolvedValue(mockWorkshops);
    });

    it('should display the main page title and create button', async () => {
        renderWithProviders(<WorkshopsPage />);
        expect(await screen.findByRole('heading', { name: /workshops/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create workshop/i })).toBeInTheDocument();
    });

    it('should open the modal when create button is clicked', async () => {
        renderWithProviders(<WorkshopsPage />);
        await userEvent.click(screen.getByRole('button', { name: /create workshop/i }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('workshop-form')).toBeInTheDocument();
    });
    
    it('should call createWorkshop API when form is submitted from the modal', async () => {
        // Arrange
        const newWorkshop = { id: 'w2', title: 'New Mocked Workshop', date: '2025-01-01T00:00:00.000Z', deletedAt: null };
        const createWorkshopMock = vi.spyOn(adminApi, 'createWorkshop').mockResolvedValue(newWorkshop);
        renderWithProviders(<WorkshopsPage />);
        
        // Act
        // 1. Open the modal
        await userEvent.click(screen.getByRole('button', { name: /create workshop/i }));
        
        // 2. Find the modal and the submit button within it
        const modal = await screen.findByRole('dialog');
        const submitButton = within(modal).getByRole('button', { name: /submit mock form/i });
        await userEvent.click(submitButton);
        
        // Assert
        // Check API was called
        await waitFor(() => {
            expect(createWorkshopMock).toHaveBeenCalledTimes(1);
        });
        
        // Check for success message
        expect(await screen.findByText(/workshop created successfully!/i)).toBeInTheDocument();
    });
});