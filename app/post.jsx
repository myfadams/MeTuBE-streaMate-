// App.js
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CustomVideoPlayer from "../components/VideoPlayer";


export default function App() {
	return (
		<SafeAreaView style={styles.container}>
			<CustomVideoPlayer
				source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
