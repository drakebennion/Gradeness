import { Button, TextInput } from '@react-native-material/core';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
        error: 'Email and password are required'
      });
      return;
    }

    signInWithEmailAndPassword(auth, signIn.email, signIn.password)
      .then(() => navigation.navigate('Sign In'))
      .catch(error => setSignIn({ ...signIn, error: error.message }));
  }

  return (
    <View style={styles.container}>
      <Text>Sign In</Text>

      { !!signIn.error && <View><Text>{signIn.error}</Text></View> }

      <View>
        <TextInput 
          label='Email'
          value={signIn.email}
          onChangeText={(email) => setSignIn({ ...signIn, email })}
        />
        <TextInput 
          label='Password'
          value={signIn.password}
          onChangeText={(password) => setSignIn({ ...signIn, password })}
          secureTextEntry
        />

        <Button title="Sign in" onPress={onSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});