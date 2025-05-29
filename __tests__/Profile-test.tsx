import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ProfileScreen from '../app/Profile';
import { Alert } from 'react-native';
import { TextMatch, TextMatchOptions } from '@testing-library/react-native/build/matches';
import { GetByQuery } from '@testing-library/react-native/build/queries/make-queries';
import { CommonQueryOptions } from '@testing-library/react-native/build/queries/options';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { uid: '123', email: 'test@example.com' },
  }),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({
        name: 'Henry',
        bio: 'Aspiring software engineer and fitness enthusiast',
        goals: 'Build strength and endurance',
        fitnessLevel: 'Intermediate',
      }),
    })
  ),
}));

jest.mock('../firebase', () => ({
  auth: {
    currentUser: { uid: '123', email: 'test@example.com' },
  },
  db: {},
  updateUserProfile: jest.fn(() => Promise.resolve()),
}));

describe('ProfileScreen', () => {
  it('shows loading indicator initially', async () => {
    let getByText: GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;

    await act(async () => {
      const rendered = render(<ProfileScreen />);
      getByText = rendered.getByText;
      expect(getByText('Loading profile...')).toBeTruthy(); // Assert loading state immediately after render
      // Add a small delay to allow the component to potentially start data fetching
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // You might not even need this waitFor if the loading state is very brief due to the mock resolving quickly
    // await waitFor(() => {
    //   expect(getByText('Loading profile...')).toBeTruthy();
    // });
  });

  it('displays profile data after loading', async () => {
    const { getByText, queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(queryByText('Henry')).toBeTruthy();
      expect(getByText('Bio: Aspiring software engineer and fitness enthusiast')).toBeTruthy();
      expect(getByText('Goals: Build strength and endurance')).toBeTruthy();
      expect(getByText('Fitness Level: Intermediate')).toBeTruthy();
    });
  });

  it('shows sign out confirmation', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      const signOutButton = getByText('Sign Out');
      expect(signOutButton).toBeTruthy();
      fireEvent.press(signOutButton);
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Sign Out',
      'Are you sure you want to log out?',
      expect.any(Array),
      { cancelable: true }
    );
  });
});