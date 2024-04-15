import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Colors, fontSizes } from '../Constants'

import { Button } from '../components/Button'

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} />
      </View>
      <View style={styles.buttons}>
        <Button type='primary' style={styles.button} onPress={() => navigation.navigate('Sign Up')}>
          Get started
        </Button>
        <Button type='secondary' style={styles.button} onPress={() => navigation.navigate('Sign In')}>
          Sign in
        </Button>
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

    image: {
      alignSelf: 'center',
    },

    text: {
      fontFamily: 'Roboto_400Regular',
      fontSize: fontSizes.xl,
    }
  },
  buttons: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
    marginHorizontal: 12,
  }
})
