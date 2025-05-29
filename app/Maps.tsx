import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

type MarkerItem = {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviews: string[];
};

const MapsScreen: React.FC = () => {
  // State to hold user's current location
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  // State to handle loading indicator
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MarkerItem | null>(null);

  // Predefined markers (fitness places)
  const markers: MarkerItem[] = [
    {
      id: '1',
      title: 'La Trobe Gym',
      description: 'Main campus gym with weights & cardio machines',
      coordinate: { latitude: -37.7215, longitude: 145.047 },
      rating: 4.5,
      reviews: [
        'Great equipment and helpful staff.',
        'Busy during peak hours, but very clean.',
      ],
    },
    {
      id: '2',
      title: 'Campus Oval',
      description: 'Perfect for running laps and HIIT',
      coordinate: { latitude: -37.7209, longitude: 145.0485 },
      rating: 4.8,
      reviews: [
        'Peaceful and spacious.',
        'Excellent for morning runs!',
      ],
    },
  ];

  // UseEffect hook to request location permissions and get current location
  useEffect(() => {
    (async () => {
      // Request permission to access user's location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to view the map');
        setLoading(false); // Stop loading state if permission is denied
        return;
      }

      // Get the current position (latitude and longitude)
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords); // Set location to the user's coordinates
      setLoading(false); // Stop the loading indicator after getting location
    })();
  }, []); // Empty dependency array ensures this runs once on component mount

  // If loading or no location available, show loading indicator
  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" /> {/* Spinner while loading */}
        <Text style={{ marginTop: 10 }}>Fetching your location...</Text>
      </View>
    );
  }

  // Set initial region based on the user's current location
  const initialRegion: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01, // Zoom level
    longitudeDelta: 0.01, // Zoom level
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={initialRegion}
      showsUserLocation
      showsMyLocationButton
      testID="map" // Added testID for the MapView
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          testID={`marker-${marker.id}`} // Added dynamic testID for the Marker
        />
      ))}
    </MapView>
  );
};

export default MapsScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1, // Makes the map take full available space
  },
  loader: {
    flex: 1, // Full screen loader
    justifyContent: 'center', // Centers the loader
    alignItems: 'center', // Centers the loader
    backgroundColor: '#F4F6F8', // Light background color
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 4,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  reviewDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: '#FFB800',
    marginBottom: 8,
  },
  reviewHeader: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
});