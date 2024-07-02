import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor } from '../../constants/colors';

const UploadView = () => {
    const videoUpload=useLocalSearchParams();
    console.log(videoUpload)
  return (
    <SafeAreaView style={{backgroundColor:bgColor, height:"100%"}}>
      <Text>UploadView</Text>
    </SafeAreaView>
  )
}

export default UploadView