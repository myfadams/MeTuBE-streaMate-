import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Index = () => {
  return (
    <SafeAreaView>
        <View style={{justifyContent:'center', alignItems:'center'}}>

      <Text>Index</Text>
      <Link href="sign-in">Go to login</Link>
        </View>

    </SafeAreaView>
  )
}

export default Index