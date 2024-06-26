import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor } from '../../constants/colors';
import HeaderApp from '../../components/HeaderApp';

const subcription = () => {
  return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<FlatList ListHeaderComponent={<HeaderApp />} />
		</SafeAreaView>
	);
}

export default subcription