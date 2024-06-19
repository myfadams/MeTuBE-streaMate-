import { StyleSheet, Text, View,Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import InputFields from '../../components/InputFields';
import { bgColor, borderPrimary, otherColor } from '../../constants/colors';
import { logo } from '../../constants/images';

import Button from '../../components/Button';
import { apple, google } from '../../constants/icons';
import { Link } from 'expo-router';
const SignIn = () => {
	const [form, setform] = useState({email:"",password:""})
  
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
					<Image source={logo} style={styles.image} resizeMode="contain" />
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
					value={form.password}
				/>
				<View style={{ marginTop: 20 }} />
				<InputFields
					text={"Password"}
					placeholderText="Enter your password"
					handleChange={(e) => {
						setform({ ...form, password: e });
					}}
					value={form.password}
				/>
				<View style={{ marginTop: 30 }} />
				<Button title="Sign In" />
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
							fontSize: "16%",
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
							fontSize: "16%",
							marginBottom: 5,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						{" "}
						Sign Up
					</Link>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default SignIn

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		// alignItems: "center",
		flex: 1,
    backgroundColor:bgColor
	},
  image:{
    width:90,
    height:66,
  },
  vewStyle:{
    justifyContent: "center",
		alignItems: "center",
		flex: 1, 
    height:"100vh"
  }
});