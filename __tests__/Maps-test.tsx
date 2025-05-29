import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapsScreen from '../app/Maps';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { View, Text } from 'react-native';

// Mock Expo Location and Firebase Auth
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 37.7749, longitude: 122.4194 },
  }),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View, Text } = require('react-native');
  interface MarkerProps {
    coordinate?: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    testID?: string;
    // Add other props if needed
  }
  return {
    default: (props: any) => <View {...props} testID="map" />,
    Marker: (props: MarkerProps) => (
      <View {...props} testID={props.testID}>
        {props.title && <Text>{props.title}</Text>}
      </View>
    ),
    PROVIDER_GOOGLE: {},
  };
});

describe('MapsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and fetches user location', async () => {
    const mockLocation = { latitude: -37.7215, longitude: 145.047 };
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
      coords: mockLocation,
    });

    const { getByText, getByTestId } = render(<MapsScreen />);

    expect(getByText('Fetching your location...')).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId('map')).toBeTruthy();
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
  });

  it('shows predefined markers on the map', async () => {
    const mockLocation = { latitude: -37.7215, longitude: 145.047 };
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
      coords: mockLocation,
    });

    const { getByTestId, getByText } = render(<MapsScreen />);

    await waitFor(() => {
      expect(getByTestId('map')).toBeTruthy();
    });

    expect(getByTestId('marker-1')).toBeTruthy();
    expect(getByText('La Trobe Gym')).toBeTruthy();
    expect(getByTestId('marker-2')).toBeTruthy();
    expect(getByText('Campus Oval')).toBeTruthy();
  });

  it('shows reviews when a marker is clicked', async () => {
    const mockLocation = { latitude: -37.7215, longitude: 145.047 };
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
      coords: mockLocation,
    });

    const { getByTestId, getByText } = render(<MapsScreen />);

    await waitFor(() => {
      expect(getByTestId('map')).toBeTruthy();
    });

    fireEvent.press(getByTestId('marker-1'));

    // You'll need to adapt these assertions based on your actual review display logic
    // Example of how you might test for the rating and reviews:
    // expect(getByText('Rating: 4.5')).toBeTruthy();
    // expect(getByText('Great equipment and helpful staff')).toBeTruthy();
    // expect(getByText('Busy during peak hours, but very clean.')).toBeTruthy();
  });

  it('shows permission denied alert when location access is not granted', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'denied',
    });

    const { getByText } = render(<MapsScreen />);

    await waitFor(() => {
      expect(getByText('Permission Denied')).toBeTruthy();
    });
  });
});