import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProgressScreen from '../app/ProgressTracker';

describe('ProgressScreen', () => {
  it('renders and shows progress and badges', async () => {
    const { getByText } = render(<ProgressScreen />);

    expect(getByText('Progress & Achievements')).toBeTruthy();
    expect(getByText('You’ve completed 12 workouts!')).toBeTruthy();
    expect(getByText('Starter')).toBeTruthy();
    expect(getByText('5 Club')).toBeTruthy();
    expect(getByText('Champion')).toBeTruthy();
    expect(getByText('Beast Mode')).toBeTruthy();
  });

  it('expands and collapses badges when clicked', async () => {
    const { getByText, queryByText } = render(<ProgressScreen />);
    
    fireEvent.press(getByText('Starter'));
    expect(
      getByText('Starting strong is the first step. Keep up the momentum!')
    ).toBeTruthy();

    fireEvent.press(getByText('Starter'));
    await waitFor(() => {
      expect(
        queryByText('Starting strong is the first step. Keep up the momentum!')
      ).toBeNull();
    });
  });

  it('toggles steps and heart points stats', async () => {
    const { getByText, queryByText } = render(<ProgressScreen />);

    // Stats should not be visible initially
    expect(queryByText("Today’s Steps: 7,245")).toBeNull();
    expect(queryByText("Heart Points: 42")).toBeNull();

    // Click button
    fireEvent.press(getByText("Steps & Heart Points"));

    // Stats should appear
    await waitFor(() => {
      expect(getByText("Today’s Steps: 7,245")).toBeTruthy();
      expect(getByText("Heart Points: 42")).toBeTruthy();
    });

    // Hide again
    fireEvent.press(getByText("Steps & Heart Points"));
    await waitFor(() => {
      expect(queryByText("Today’s Steps: 7,245")).toBeNull();
      expect(queryByText("Heart Points: 42")).toBeNull();
    });
  });
});
