import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

// Mock the Firebase methods
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

describe('LoginScreen', () => {
  it('renders login screen UI correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('calls login function on "Login" button press', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    });
  });

  it('calls register function on "Register" button press', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email: 'new@example.com' },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'new@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'newpassword');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'new@example.com', 'newpassword');
    });
  });
});
