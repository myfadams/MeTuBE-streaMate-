import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getContext } from '../../context/GlobalContext';
import { Redirect } from 'expo-router';

const home = () => {
	const {user}= getContext();
  return (
		<SafeAreaView>
			<Text>home</Text>
		</SafeAreaView>
	);
}

export default home