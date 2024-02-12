import { Button, TextInput } from '@react-native-material/core'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default function SignUpScreen({ navigation }) {
  const auth = getAuth()

  const [signUp, setSignUp] = useState({
    email: '',
    password: '',
    error: ''
  })

  function onSignUp() {
    if (signUp.email === '' || signUp.password === '') {
      setSignUp({
        ...signUp,
        error: 'Email and password are required'
      })
      return
    }

    createUserWithEmailAndPassword(auth, signUp.email, signUp.password)
      // should i even have this 'then'? this authenticates them and
      // sends them right to the Roadmap so idk
      .then(() => navigation.navigate('Sign In'))
      .catch(error => { setSignUp({ ...signUp, error: error.message }) })
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Roboto_400Regular' }}>Sign Up</Text>

      {!!signUp.error && <View><Text style={{ fontFamily: 'Roboto_400Regular' }}>{signUp.error}</Text></View>}

      <View>
        <TextInput
          label='Email'
          value={signUp.email}
          onChangeText={(email) => { setSignUp({ ...signUp, email }) }}
        />
        <TextInput
          label='Password'
          value={signUp.password}
          onChangeText={(password) => { setSignUp({ ...signUp, password }) }}
          secureTextEntry
        />

        <Button title="Sign up" onPress={onSignUp} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff'
    // alignItems: 'center',
    // justifyContent: 'center',
  }
})
