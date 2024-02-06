import { Button } from '@react-native-material/core'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function HomeScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Sign In" style={styles.button} onPress={() => navigation.navigate('Sign In')} />
      <Button title="Sign Up" style={styles.button} onPress={() => navigation.navigate('Sign Up')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {}
})
