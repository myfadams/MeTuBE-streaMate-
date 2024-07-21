import {
	StyleSheet,
	Text,
	View,
	
	ScrollView,
	TouchableOpacity,
	Platform,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputFields from "../../components/InputFields";
import { Image } from "expo-image";
import { bgColor, borderPrimary, buttonColor, otherColor } from "../../constants/colors";
import { logo } from "../../constants/images";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/Button";
import { apple, email, google, key } from "../../constants/icons";
import { Link, Redirect, SplashScreen, router } from "expo-router";
import { getContext } from "../../context/GlobalContext";
import { emailVerification, loginUser } from "../../libs/firebase";
import { authentication } from "../../libs/config";
import { getAuth } from "firebase/auth";
import MoreButton from "../../components/MoreButton";
const SignIn = () => {
	const [form, setform] = useState({ email: "", password: "" });
	const [isLoading, setIsLoading] = useState(false);
	const { user,setUser } = getContext();
	SplashScreen.hideAsync()
	// if (authentication["currentUser"] && user.emailVerified) {
	// 	return <Redirect href="home" />;
	// }

	async function login() {
		setIsLoading(true);
		try {
			if (!form.email || !form.password) {
				Alert.alert("please fill the fields");
				return;
			}

			const user = await loginUser(form.email, form.password);
			setUser(user);
			if (!emailVerification(user)) {
				Alert.alert("Please verify, an email was sent to " + form.email, "", [
					{
						text: "continue",
						onPress: () => {
							router.replace("verification");
						},
					},
				]);
			}else{
				router.replace("home")
			}
		} catch (error) {
			console.log(error.code);

			let errorMessage = error.message.replace("Firebase", "StreaMate");
			if (error.code === "auth/invalid-email")
				errorMessage = errorMessage.replace(
					"(" + error.code + ")",
					"The Email Entered is Invalid"
				);
			else if (error.code === "auth/network-request-failed") {
				errorMessage = "Theres a problem with your network";
			} else if (error.code === "auth/user-not-found") {
				errorMessage = "No account with that email";
			} else if (error.code === "auth/wrong-password") {
				errorMessage = "Incorrect Password";
			} else {
				errorMessage = errorMessage.replace("(" + error.code + ")", "");
			}
			Alert.alert(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.vewStyle}
				automaticallyAdjustKeyboardInsets
			>
				<View
					style={{
						flexDirection: "row",
						width: "92%",
						alignItems: "center",
						marginBottom: 17,
					}}
				>
					<Image source={logo} style={styles.image} contentFit="contain" />
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
						width: "92%",
						alignItems: "center",
						marginBottom: 20,
						// marginLeft:56
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_700Bold",
							fontSize: 25,
							marginBottom: 30,
						}}
					>
						Log in to your account
					</Text>
				</View>

				<InputFields
					text={"Email"}
					placeholderText="Enter your email"
					handleChange={(e) => {
						setform({ ...form, email: e });
					}}
					value={form.name}
					icon={email}
				/>
				<View style={{ marginTop: 20 }} />
				<InputFields
					text={"Password"}
					placeholderText="Enter your password"
					handleChange={(e) => {
						setform({ ...form, password: e });
					}}
					value={form.password}
					icon={key}
				/>
				<View style={{ marginTop: 30, width: "100%" }} />
				{/* <Button title="Sign In" isLoading={isLoading} handlePress={login} /> */}
				<View style={{ width: "97%" }}>
					<MoreButton
						title={"Sign In"}
						height={69}
						color={buttonColor}
						handlePress={login}
						typeauth={"auth"}
						isLoading={isLoading}
						auth={"auth"}
					/>
				</View>
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginTop: 20,
					}}
				>
					<TouchableOpacity style={{ margin: 10 }} activeOpacity={0.7}>
						<Image
							source={google}
							contentFit="contain"
							style={{ width: 40, height: 40 }}
						/>
					</TouchableOpacity>
					{Platform.OS === "ios" && (
						<TouchableOpacity style={{ margin: 10 }} activeOpacity={0.7}>
							<Image
								source={apple}
								contentFit="contain"
								style={{ width: 40, height: 40 }}
							/>
						</TouchableOpacity>
					)}
				</View>
				<View
					style={{
						width: "92%",
						flexDirection: "row",
						justifyContent: "center",
						marginTop: 10,
						marginBottom: 25,
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontSize: Platform.OS === "ios" ? "16%" : 16,
							marginBottom: 5,
							fontFamily: "Montserrat_500Medium",
						}}
					>
						Dont Have An Account
					</Text>
					<Link
						href="sign-up"
						style={{
							color: otherColor,
							fontSize: Platform.OS === "ios" ? "16%" : 16,
							marginBottom: 5,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						{" "}
						Sign Up
					</Link>
				</View>
			</ScrollView>
			<StatusBar style="light" />
		</SafeAreaView>
	);
};

export default SignIn;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		// alignItems: "center",
		flex: 1,
		backgroundColor: bgColor,
	},
	image: {
		width: 250,
		height: 120
	},
	vewStyle: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		height: "100vh",
	},
});
