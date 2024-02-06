import { Button, Text } from '@react-native-material/core'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '../Constants'

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text color={Colors.text} style={styles.header}>Gradeness</Text>
      <View style={styles.buttons}>
        <Button title="Get started" color={Colors.highlight2} style={styles.button} onPress={() => navigation.navigate('Sign Up')} />
        <Button title="Sign In" color={Colors.text} style={styles.button} onPress={() => navigation.navigate('Sign In')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  header: {
    alignSelf: 'center',
    marginTop: '50%',
    fontSize: 46,
  },
  buttons: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
    marginHorizontal: 12,
  }
})
