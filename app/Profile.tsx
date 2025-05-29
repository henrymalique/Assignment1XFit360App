import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Platform
} from 'react-native';
import { auth, db, updateUserProfile } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<{
    email: string;
    name?: string;
    bio?: string;
    goals?: string;
    fitnessLevel?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [fitnessLevelInput, setFitnessLevelInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
            email: user.email ?? '',
            name: data.name ?? '',
            bio: data.bio ?? '',
            goals: data.goals ?? '',
            fitnessLevel: data.fitnessLevel ?? '',
          });

          setNameInput(data.name ?? '');
          setBioInput(data.bio ?? '');
          setGoalsInput(data.goals ?? '');
          setFitnessLevelInput(data.fitnessLevel ?? '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateUserProfile(user.uid, {
        name: nameInput,
        bio: bioInput,
        goals: goalsInput,
        fitnessLevel: fitnessLevelInput,
      });

      setProfile({
        email: user.email ?? '',
        name: nameInput,
        bio: bioInput,
        goals: goalsInput,
        fitnessLevel: fitnessLevelInput,
      });

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(err);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace('/login');
          } catch (err) {
            Alert.alert('Error', 'Sign out failed');
            console.error(err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=007BFF&color=fff` }}
          style={styles.avatar}
        />
        <Text style={styles.email}>{profile?.email}</Text>

        {isEditing ? (
          <>
            <TextInput style={styles.input} value={nameInput} placeholder="Name" onChangeText={setNameInput} />
            <TextInput style={styles.input} value={bioInput} placeholder="Bio" onChangeText={setBioInput} />
            <TextInput style={styles.input} value={goalsInput} placeholder="Goals" onChangeText={setGoalsInput} />
            <TextInput style={styles.input} value={fitnessLevelInput} placeholder="Fitness Level" onChangeText={setFitnessLevelInput} />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile?.name}</Text>
            <Text style={styles.text}>Bio: {profile?.bio || 'N/A'}</Text>
            <Text style={styles.text}>Goals: {profile?.goals || 'N/A'}</Text>
            <Text style={styles.text}>Fitness Level: {profile?.fitnessLevel || 'N/A'}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#EDF1F7',
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginVertical: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  editButton: {
    marginTop: 12,
  },
  editText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 24,
  },
  logoutText: {
    color: '#DC3545',
    fontWeight: '600',
  },
});
