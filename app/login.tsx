import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseConfig } from '../firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const debug = (tag: string, msg: string, error?: any) => {
    console.log(`${tag}: ${msg}`);
    if (error) console.error(error);
  };

  const loginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setStatus(`Welcome back, ${userCredential.user.email}`);
      router.replace('/HomeDashboard');
    } catch (error: any) {
      setStatus('Login failed');
      debug('Login', error.message, error);
    }
  };

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setStatus(`Welcome, ${userCredential.user.email}`);
      router.replace('/HomeDashboard');
    } catch (error: any) {
      setStatus('Registration failed');
      debug('Register', error.message, error);
    }
  };

  return (
    <SafeAreaProvider>
        <View style={styles.overlay}>
          <Image
            source={require('../assets/xfit360_logo.png')} // Logo file placed in assets folder
            style={styles.logo}
          />
          <Text style={styles.title}>XFit360</Text>
          <Text style={styles.subtitle}>Fitness Starts Here</Text>

          <Text style={styles.status}>{status}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={loginUser}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOutline} onPress={registerUser}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  status: {
    color: '#f88',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#222',
    color: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00c851',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 6,
    width: '90%',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#00c851',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 12,
    width: '90%',
  },
  buttonOutlineText: {
    textAlign: 'center',
    color: '#00c851',
    fontWeight: '600',
    fontSize: 16,
  },
});
