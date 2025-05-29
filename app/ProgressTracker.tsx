import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, LayoutAnimation, UIManager, Platform,
} from 'react-native';

// Enable animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Badge = {
  name: string;
  description: string;
  details: string;
  unlocked: boolean;
  progress: number;
  iconUrl: string;
};

const ProgressScreen = () => {
  const [workoutCount] = useState(12); // Simulated value
  const [badges, setBadges] = useState<Badge[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false); // For Steps + Heart Points

  useEffect(() => {
    const badgeData: Badge[] = [
      {
        name: 'Starter',
        description: 'Completed your first workout — the journey begins!',
        details: 'Starting strong is the first step. Keep up the momentum!',
        unlocked: workoutCount >= 1,
        progress: Math.min(workoutCount / 1, 1),
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
      },
      {
        name: '5 Club',
        description: 'Solid start! Hit 5 workouts.',
        details: 'Consistency builds discipline. You’re finding your rhythm.',
        unlocked: workoutCount >= 5,
        progress: Math.min(workoutCount / 5, 1),
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      },
      {
        name: 'Champion',
        description: 'You’ve done 10 workouts! True consistency.',
        details: 'Now you’re a role model in the making. Keep going!',
        unlocked: workoutCount >= 10,
        progress: Math.min(workoutCount / 10, 1),
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3468/3468379.png',
      },
      {
        name: 'Beast Mode',
        description: '20 workouts! That’s legendary hustle.',
        details: 'You’re on a whole new level. Nothing can stop you now!',
        unlocked: workoutCount >= 20,
        progress: Math.min(workoutCount / 20, 1),
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
      },
    ];
    setBadges(badgeData);
  }, [workoutCount]);

  const toggleBadge = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const toggleStats = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowStats(!showStats);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress & Achievements</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workouts</Text>
        <Text style={styles.sectionText}>You’ve completed {workoutCount} workouts!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        {badges.map((badge, index) => (
          <TouchableOpacity key={index} onPress={() => toggleBadge(index)}>
            <View style={[styles.badge, { opacity: badge.unlocked ? 1 : 0.3 }]}>
              <Image source={{ uri: badge.iconUrl }} style={styles.badgeIcon} />
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDesc}>{badge.description}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${badge.progress * 100}%` }]} />
                </View>
                <Text style={styles.badgeStatus}>
                  {badge.unlocked ? 'Unlocked' : `${Math.round(badge.progress * 100)}%`}
                </Text>
                {expandedIndex === index && (
                  <Text style={styles.detailsText}>{badge.details}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Heart Points & Steps Button */}
      <TouchableOpacity style={styles.roundButton} onPress={toggleStats}>
        <Text style={styles.roundButtonText}>Steps & Heart Points</Text>
      </TouchableOpacity>

      {showStats && (
        <View style={styles.statsBox}>
          <Text style={styles.statLine}>Today’s Steps: 7,245</Text>
          <Text style={styles.statLine}>Heart Points: 42</Text>
          <Text style={styles.statLine}>Distance Walked: 5.3 km</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    marginTop: 5,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  badgeDesc: {
    fontSize: 14,
    color: '#666',
  },
  badgeStatus: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#007BFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#007BFF',
  },
  detailsText: {
    marginTop: 8,
    fontSize: 13,
    color: '#444',
  },
  roundButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
  },
  roundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  statLine: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
});
