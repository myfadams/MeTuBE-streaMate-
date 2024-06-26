import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor, loadingColor } from '../../constants/colors';
import { ResizeMode, Video } from 'expo-av';

const create = () => {
  return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<Video
				resizeMode={ResizeMode.CONTAIN}
				shouldPlay={true}
				useNativeControls={true}
				style={{ width: "100%", height: 200, backgroundColor: loadingColor }}
				source={{
					uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
				}}
			/>
		</SafeAreaView>
	);
}

export default create
