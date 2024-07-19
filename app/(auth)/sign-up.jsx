import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Platform,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputFields from "../../components/InputFields";
import { bgColor, borderPrimary, buttonColor, otherColor } from "../../constants/colors";
import { logo } from "../../constants/images";

import Button from "../../components/Button";
import { apple, email, google, key, username } from "../../constants/icons";
import { Link, router } from "expo-router";
import { createAccount, emailVerification } from "../../libs/firebase";
import { getContext } from "../../context/GlobalContext";
import MoreButton from "../../components/MoreButton";

const SignUp = () => {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const { setUser,setName } = getContext();
	const [isLoading, setIsLoading] = useState(false);

	async function signUp() {
		setIsLoading(true);
		try {
			if(!form.email || !form.name || !form.password){
				Alert.alert("please fill the fields")
				return;
			}

			const user = await createAccount(form.email, form.password,form.name);
			setUser(user);
			setName(form.name)

			Alert.alert("sent an email verifcation to "+form.email,"",[{
				text:"continue", onPress:()=>{
					router.dismissAll();
					router.replace("verification");
				}
			}])
		} catch (error) {
			console.log(error.code);
			if (error.code === "auth/email-already-in-use") {
				if(emailVerification(form.email)){
					Alert.alert("This email already has an account ", "", [
						{
							text: "Login",
							onPress: () => {
								router.push("sign-in");
							},
						},
					]);
				}else{
					Alert.alert("This email already exist please verify to continue", "", [
						{
							text: "continue",
							onPress: () => {
								router.dismissAll();
								router.replace("verification");
		
							},
						},
					]);
				}
			} else {
				let errorMessage = error.message.replace("Firebase","StreaMate")
				if(error.code==="auth/invalid-email")
					errorMessage=errorMessage.replace("("+error.code+")","The Email Entered is Invalid")
				else if(error.code==="auth/network-request-failed")
					errorMessage="Network Error please try Again"
				else{
					errorMessage = errorMessage.replace("(" + error.code + ")", "");
				}
				Alert.alert(errorMessage);
			}
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
						marginBottom: 14,
					}}
				>
					<Image source={logo} style={styles.image} resizeMode="contain" />
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
							marginBottom: 23,
						}}
					>
						Sign up for an Account
					</Text>
				</View>
				<InputFields
					text={"Name"}
					placeholderText="Enter your name"
					handleChange={(e) => {
						setForm({ ...form, name: e });
					}}
					value={form.name}
					icon={username}
				/>
				<View style={{ marginTop: 20 }} />

				<InputFields
					text={"Email"}
					placeholderText="Enter your email"
					handleChange={(e) => {
						setForm({ ...form, email: e });
					}}
					value={form.email}
					icon={email}
				/>
				<View style={{ marginTop: 20 }} />
				<InputFields
					text={"Password"}
					placeholderText="Enter your password"
					handleChange={(e) => {
						setForm({ ...form, password: e });
					}}
					value={form.password}
					icon={key}
				/>
				<View style={{ marginTop: 30 }} />
				{/* <Button title="Sign Up" handlePress={signUp} isLoading={isLoading} /> */}
				<View style={{ width: "97%" }}>
					<MoreButton
						title={"Sign Up"}
						height={60}
						color={buttonColor}
						handlePress={signUp}
						typeauth={"auth"}
						isLoading={isLoading}
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
							resizeMode="contain"
							style={{ width: 40, height: 40 }}
						/>
					</TouchableOpacity>
					{Platform.OS === "ios" && (
						<TouchableOpacity style={{ margin: 10 }} activeOpacity={0.7}>
							<Image
								source={apple}
								resizeMode="contain"
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
						Already Have An Account
					</Text>
					<Link
						href="sign-in"
						style={{
							color: otherColor,
							fontSize: Platform.OS === "ios" ? "16%" : 16,
							marginBottom: 5,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						{" "}
						Sign In
					</Link>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		// alignItems: "center",
		flex: 1,
		backgroundColor: bgColor,
	},
	image: {
		width: 250,
		height: 120,
	},
	vewStyle: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		height: "100vh",
	},
});
