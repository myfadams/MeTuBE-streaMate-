import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor } from '../../constants/colors';

const shorts = () => {
  return (
    <SafeAreaView style={{backgroundColor:bgColor, height:"100%"}}>
      <Text>shorts</Text>
    </SafeAreaView>
  )
}

export default shorts