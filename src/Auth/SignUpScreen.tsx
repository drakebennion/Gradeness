import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from 'firebase/auth';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { fontSizes } from '../Constants';

import { AlertCard } from '../components/AlertCard';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';

export default function SignUpScreen({ navigation }) {
  const auth = getAuth();

  const [signUp, setSignUp] = useState({
    email: '',
    password: '',
    error: '',
  });

  function onSignUp() {
    if (signUp.email === '' || signUp.password === '') {
      setSignUp({
        ...signUp,
        error: 'Email and password are required',
      });
      return;
    }

    createUserWithEmailAndPassword(auth, signUp.email, signUp.password)
      .then(() => sendEmailVerification(auth.currentUser))
      // should i even have this 'then'? this authenticates them and
      // sends them right to the Roadmap so idk
      .then(() => navigation.navigate('Sign In'))
      .catch(error => {
        setSignUp({ ...signUp, error: error.message });
      });
  }

  return (
    <View style={styles.container}>
      {!!signUp.error && (
        <View>
          <AlertCard
            alertType="error"
            flavorText="SUS, looks like we hit a snag. Please try again, if the glitches
            continue please hit up our support team, and reference the error below. Thanks for your patience."
            errorText={signUp.error}
          />
        </View>
      )}
      <Text
        style={{
          fontFamily: 'Roboto_400Regular',
          fontSize: fontSizes.m,
          marginBottom: 16,
        }}>
        Sign Up
      </Text>

      <View>
        <TextInput
          label="Email"
          value={signUp.email}
          onChangeText={email => {
            setSignUp({ ...signUp, email });
          }}
          style={{ marginBottom: 12 }}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={signUp.password}
          onChangeText={password => {
            setSignUp({ ...signUp, password });
          }}
          style={{ marginBottom: 16 }}
          secureTextEntry
          autoComplete="new-password"
        />

        <Text
          style={{
            fontFamily: 'Roboto_400Regular',
            fontSize: fontSizes.xxs,
            lineHeight: 20,
            letterSpacing: 0.25,
            marginBottom: 16,
          }}>
          By signing up you agree to the{' '}
          <Text
            onPress={() =>
              Linking.openURL('https://www.gradeness.app/privacy-policy')
            }
            style={{ textDecorationLine: 'underline' }}>
            privacy policy
          </Text>
        </Text>
        <Button type="primary" style={{ marginTop: 8 }} onPress={onSignUp}>
          Sign up
        </Button>
        <Text style={{ marginTop: 24, alignSelf: 'center' }}>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('Sign In')}
            style={{ textDecorationLine: 'underline' }}>
            Sign in
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
