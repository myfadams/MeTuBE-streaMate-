import { View, ActivityIndicator, StyleSheet } from "react-native";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor, loadingColor } from '../../constants/colors';
import { ResizeMode, Video } from 'expo-av';

const create = () => {
  return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<ActivityIndicator size="large" color="#fff" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});


export default create
