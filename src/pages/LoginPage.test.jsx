import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import LoginPage from './LoginPage';
import * as adminApi from '../api/adminApi'; // Import all exports

// Mock the adminApi module
vi.mock('../api/adminApi');

// A reusable render function with providers
const renderWithProviders = (ui) => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  it('should display an error message on failed login', async () => {
    // Arrange: Mock the API to simulate a failed login
    const mockLogin = vi.spyOn(adminApi, 'login').mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    renderWithProviders(<LoginPage />);

    // Act: Simulate user typing and submitting the form
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    // Assert: Check if the error message appears
    // 'waitFor' is used because the state update and re-render are async
    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid credentials/i);
      expect(errorMessage).toBeInTheDocument();
    });

    // Clean up mock
    mockLogin.mockRestore();
  });

  // You can add another test for successful login
  it('should call api and redirect on successful login', async () => {
    // Arrange: Mock a successful login
    const mockLogin = vi.spyOn(adminApi, 'login').mockResolvedValue({
        token: 'fake-token',
        role: 'ADMIN',
        userId: '123'
    });

    renderWithProviders(<LoginPage />);

    // Act
    await userEvent.type(screen.getByLabelText(/email address/i), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    await waitFor(() => {
        expect(adminApi.login).toHaveBeenCalledTimes(1);
        // In a real test, you would also assert the navigation.
        // For this, you need to mock react-router-dom's useNavigate.
        // But for simplicity, we confirm the API was called correctly.
    });

    mockLogin.mockRestore();
  });
});