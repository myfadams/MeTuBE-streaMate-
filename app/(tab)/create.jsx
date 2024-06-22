import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor } from '../../constants/colors';

const create = () => {
  return  (
    <SafeAreaView style={{backgroundColor:bgColor, height:"100%"}}>
      <Text>create</Text>
    </SafeAreaView>
  )
}

export default create