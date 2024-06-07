import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes } from '../Constants';
import { TextInput } from '../components/TextInput';

import { AlertCard } from '../components/AlertCard';
import { Button } from '../components/Button';

export default function SignInScreen({ navigation }) {
  const auth = getAuth();

  const [signIn, setSignIn] = useState({
    email: '',
    password: '',
    error: '',
  });

  function onSignIn() {
    if (signIn.email === '' || signIn.password === '') {
      setSignIn({
        ...signIn,
        error: 'Email and password are required',
      });
      return;
    }

    signInWithEmailAndPassword(auth, signIn.email, signIn.password)
      .then(() => {
        if (!auth.currentUser?.emailVerified) {
          sendEmailVerification(auth.currentUser);
        }
      })
      .then(() => navigation.navigate('Sign In'))
      .catch(error => {
        setSignIn({ ...signIn, error: error.message });
      });
  }

  return (
    <View style={styles.container}>
      {!!signIn.error && (
        <AlertCard
          alertType="error"
          flavorText="SUS, looks like we hit a snag. Please try again, if the glitches
            continue please hit up our support team, and reference the error below. Thanks for your patience. "
          errorText={signIn.error}
        />
      )}
      <Text
        style={{
          fontFamily: 'Roboto_400Regular',
          fontSize: fontSizes.m,
          marginBottom: 16,
        }}>
        Sign In
      </Text>

      <View>
        <TextInput
          label="Email"
          value={signIn.email}
          onChangeText={email => {
            setSignIn({ ...signIn, email });
          }}
          style={{ marginBottom: 12 }}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={signIn.password}
          onChangeText={password => {
            setSignIn({ ...signIn, password });
          }}
          secureTextEntry
          style={{ marginBottom: 12 }}
          autoComplete="password"
        />

        <Button type="primary" onPress={onSignIn} style={{ marginTop: 8 }}>
          Sign in
        </Button>
        <Text style={{ marginTop: 24, alignSelf: 'center' }}>
          New here?
          <Text
            onPress={() => navigation.navigate('Sign Up')}
            style={{ textDecorationLine: 'underline' }}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 96,
    padding: 16,
  },
});
