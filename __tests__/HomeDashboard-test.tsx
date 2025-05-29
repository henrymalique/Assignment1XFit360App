import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeDashboardScreen from '../app/HomeDashboard';
import { useRouter } from 'expo-router';

// Mock the router to prevent navigation errors during test
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  }));

describe('HomeDashboardScreen', () => {
  it('renders greeting text', () => {
    const { getByText } = render(<HomeDashboardScreen />);
    expect(getByText('Welcome Back!')).toBeTruthy();
  });

  it('renders avatar placeholder', () => {
    const { getByTestId } = render(<HomeDashboardScreen />);
    const avatar = getByTestId('avatar-circle');
    expect(avatar).toBeTruthy();
  });

  it('renders workout summary card', () => {
    const { getByText } = render(<HomeDashboardScreen />);
    expect(getByText('Weekly Workout Summary')).toBeTruthy();
    expect(getByText('4 sessions • 2 hrs 15 mins')).toBeTruthy();
  });

  it('renders calorie card', () => {
    const { getByText } = render(<HomeDashboardScreen />);
    expect(getByText('Calories Burned')).toBeTruthy();
    expect(getByText('1,340 kcal')).toBeTruthy();
  });

  it('renders AI tip card', () => {
    const { getByText } = render(<HomeDashboardScreen />);
    expect(getByText('AI Tip of the Day')).toBeTruthy();
    expect(
      getByText('Try mobility work before your HIIT sessions!')
    ).toBeTruthy();
  });

  it('renders all quick access buttons', () => {
    const { getByText } = render(<HomeDashboardScreen />);
    expect(getByText('Go to Workout Library')).toBeTruthy();
    expect(getByText('View Progress')).toBeTruthy();
    expect(getByText('Open Map Tracker')).toBeTruthy();
    expect(getByText('My Profile')).toBeTruthy();
  });

  it('triggers navigation when Workout Library is pressed', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { getByText } = render(<HomeDashboardScreen />);
    fireEvent.press(getByText('Go to Workout Library'));
    expect(mockPush).toHaveBeenCalledWith('/WorkoutLibrary');
  });
});
