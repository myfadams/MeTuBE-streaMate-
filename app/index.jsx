import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, borderPrimary, otherColor } from "../constants/colors";
import { logo } from "../constants/images";
import * as Animatable from "react-native-animatable";
import AnimatedLoader from "react-native-animated-loader";

import { Redirect, SplashScreen, router } from "expo-router";
import { getContext } from "../context/GlobalContext";
import { get } from "firebase/database";

const Index = () => {
	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace("/home");
		}, 4000);
		console.log("pushed to home");
		return () => clearTimeout(timer);
	});

	const slideInDown = {
		from: {
			translateY: -20, // Starting position (50 units above the original position)
		},
		to: {
			translateY: 0, // Ending position (original position)
		},
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.vewStyle}>
				<View
					style={{
						flexDirection: "row",

						alignItems: "center",
						justifyContent: "center",
						marginBottom: 30,
					}}
				>
					<Image
						source={logo}
						style={{
							width: 250,
							height: 120,
						}}
						resizeMode="contain"
					/>
					{/* <Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_900Black",
								fontSize: 40,
							}}
						>
							StreaMate
						</Text> */}
				</View>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Animatable.Text
						animation={slideInDown}
						iterationCount="infinite"
						easing="ease-out"
						direction="alternate"
						style={{
							color: "#fff",
							fontFamily: "Montserrat_600SemiBold",
							fontSize: 18,
						}}
					>
						Loading..
					</Animatable.Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Index;

const styles = StyleSheet.create({
	
	container: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		width:"100%",
		height:"100%",
		backgroundColor: bgColor,
	},
	image: {
		width: 90,
		height: 66,
	},
	vewStyle: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		height: "100vh",
	},
});
