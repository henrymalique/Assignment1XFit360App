import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import WorkoutLibraryScreen from '../app/WorkoutLibrary';
import * as firestoreWorkouts from '../firestoreWorkouts';

// Mock sample data
const mockWorkouts = [
  {
    id: '1',
    title: 'Cardio Burn',
    category: 'Cardio',
    color: '#FAD0C4',
    duration: '30 mins',
    difficulty: 'Beginner',
    introduction: 'A quick fat-burning session.',
    instructions: ['Warm-up for 5 mins', 'Jog in place', 'Cool down'],
    steps: ['Jumping jacks', 'Mountain climbers'],
    likes: 2,
    feedback: ['Great routine!', 'Sweaty but worth it'],
  },
];

// Mock functions
jest.spyOn(firestoreWorkouts, 'fetchWorkouts').mockResolvedValue(mockWorkouts);
jest.spyOn(firestoreWorkouts, 'likeWorkout').mockResolvedValue(undefined);
jest.spyOn(firestoreWorkouts, 'submitFeedback').mockResolvedValue(undefined);

describe('WorkoutLibraryScreen', () => {
  it('renders workouts correctly after fetching', async () => {
    const { getByText, queryByText } = render(<WorkoutLibraryScreen />);

    // Wait for workouts to load
    await waitFor(() => {
      expect(getByText('Cardio Burn')).toBeTruthy();
      expect(getByText('Cardio • 30 mins • Beginner')).toBeTruthy();
    });

    // Expand the workout card
    const card = getByText('Cardio Burn');
    fireEvent.press(card);

    expect(getByText('A quick fat-burning session.')).toBeTruthy();
    expect(queryByText('Great routine!')).toBeTruthy();
  });

  it('likes a workout and updates count', async () => {
    const { getByText, getByRole } = render(<WorkoutLibraryScreen />);

    await waitFor(() => getByText('Cardio Burn'));

    fireEvent.press(getByText('Cardio Burn'));

    const likeIcon = getByRole('button'); // First touchable is the heart icon
    fireEvent.press(likeIcon);

    await waitFor(() => {
      expect(getByText('3 Likes')).toBeTruthy();
    });
  });

  it('submits feedback and shows it in the list', async () => {
    const { getByPlaceholderText, getByText } = render(<WorkoutLibraryScreen />);

    await waitFor(() => getByText('Cardio Burn'));
    fireEvent.press(getByText('Cardio Burn'));

    const input = getByPlaceholderText('Leave feedback...');
    fireEvent.changeText(input, 'Loved it!');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('- Loved it!')).toBeTruthy();
    });
  });
});
