import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const HomeDashboardScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Avatar */}
      <View style={styles.avatarRow}>
        <View testID="avatar-circle" style={styles.avatar} />
        <Text style={styles.welcome}>Welcome Back!</Text>
      </View>

      {/* Workout Summary Widgets */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Weekly Workout Summary</Text>
        <Text style={styles.widgetValue}>4 sessions • 2 hrs 15 mins</Text>
      </View>

      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Calories Burned</Text>
        <Text style={styles.widgetValue}>1,340 kcal</Text>
      </View>

      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>AI Tip of the Day</Text>
        <Text style={styles.widgetValue}>Try mobility work before your HIIT sessions!</Text>
      </View>

      {/* Quick Access Section */}
      <Text style={styles.section}>Quick Access</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/WorkoutLibrary')}
      >
        <Text style={styles.buttonText}>Go to Workout Library</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/ProgressTracker')}
      >
        <Text style={styles.buttonText}>View Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Maps')}
      >
        <Text style={styles.buttonText}>Open Map Tracker</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Profile')}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeDashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F1F5F9',
    flexGrow: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007BFF',
    marginRight: 12,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  widget: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  widgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#111',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
    color: '#444',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
