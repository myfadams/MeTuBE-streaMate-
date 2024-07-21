import {
	StyleSheet,
	Text,
	View,
	
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, borderPrimary, otherColor } from "../../constants/colors";
import { logo } from "../../constants/images";
import * as Animatable from "react-native-animatable";

import { getContext } from "../../context/GlobalContext";
import { Redirect, router } from "expo-router";
import { checkVerified, getCurrentUser } from "../../libs/firebase";
import { authentication } from "../../libs/config";
import { getAuth } from "firebase/auth";
import LottieView from "lottie-react-native";
const Verification = () => {
	const { user, name } = getContext();
	const currUser = JSON.stringify(user);
	// console.log("uers: " +currUser );

	const slideInDown = {
		from: {
			translateY: -15, // Starting position (50 units above the original position)
		},
		to: {
			translateY: 0, // Ending position (original position)
		},
	};

	const [isVerified, setIsVerified] = useState(false);

	useEffect(() => {
		const interval = setInterval(async () => {
			const verified = await checkVerified(user);
			//  console.log("hi :"+verified)
			if (verified) {
				setIsVerified(true);
				clearInterval(interval);
			}
		}, 3000); // Check every 3 seconds

		return () => clearInterval(interval); // Clear interval on component unmount
	}, [user]);
	if (isVerified) return <Redirect href="home" />;
	console.log(isVerified);
	 const animation = useRef()
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.vewStyle}>
				
				<View
					style={{
						justifyContent: "center",
						width: "100%",
						alignItems: "center",
					}}
				>
					<View
						style={{
							// justifyContent: "center",
							// // width: "100%",
							// alignItems: "center",
						}}
					>
						<LottieView
							autoPlay
							ref={animation}
							style={{
								width: 130,
								height: 130,
								overflow:"hidden"
							}}
							// Find more Lottie files at https://lottiefiles.com/featured
							source={require("../../assets/animations/loading.json")}
						/>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						<Image
							source={logo}
							style={{
								width: 250,
								height: 120,
							}}
							contentFit="contain"
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
							alignItems: "center",
							justifyContent: "center",
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
							Please verify your email...
						</Animatable.Text>
					</View>
				</View>
				
			</View>
		</SafeAreaView>
	);
};

export default Verification;

const styles = StyleSheet.create({
	lottie: {
		width: 130,
		height: 130,
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
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
