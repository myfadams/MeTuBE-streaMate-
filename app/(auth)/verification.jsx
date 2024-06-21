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
import { bgColor, borderPrimary, otherColor } from "../../constants/colors";
import { logo } from "../../constants/images";
import * as Animatable from "react-native-animatable";
import AnimatedLoader from "react-native-animated-loader";
import { getContext } from "../../context/GlobalContext";
import { Redirect, router } from "expo-router";
import { checkVerified, getCurrentUser } from "../../libs/firebase";
import { authentication } from "../../libs/config";
import { getAuth } from "firebase/auth";
const Verification = () => {
	
	const {user,name}= (getContext())
	const currUser=JSON.stringify(user)
	// console.log("uers: " +currUser );


	const slideInDown = {
		from: {
			translateY: -20, // Starting position (50 units above the original position)
		},
		to: {
			translateY: 0, // Ending position (original position)
		},
	};

	const [isVerified, setIsVerified] = useState(false)
	
	 useEffect(() => {
		 const interval = setInterval(async () => {
			 const verified = await checkVerified(user,name);
			 console.log("hi :"+verified)
				if (verified) {
					setIsVerified(true);
					clearInterval(interval);
				}
			}, 3000); // Check every 3 seconds

			return () => clearInterval(interval); // Clear interval on component unmount
		}, [user]);
	if (isVerified) return <Redirect href="home" />;
	console.log(isVerified)
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.vewStyle}
				automaticallyAdjustKeyboardInsets
			>
				<AnimatedLoader
					visible={true}
					overlayColor={bgColor}
					source={require("../../assets/animations/loading.json")}
					animationStyle={styles.lottie}
					speed={1}
				>
					<View
						style={{
							flexDirection: "row",
							width: "92%",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 30,
						}}
					>
						<Image
							source={logo}
							style={{
								width: 90,
								height: 66,
							}}
							resizeMode="contain"
						/>
						<Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_900Black",
								fontSize: 40,
							}}
						>
							MeTuBE
						</Text>
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
							Please verify your email...
						</Animatable.Text>
					</View>
				</AnimatedLoader>
			</ScrollView>
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
