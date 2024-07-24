import React from "react";
import { TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { authentication } from "../libs/config";
import { Image } from "expo-image";
import { google } from "../constants/icons";

WebBrowser.maybeCompleteAuthSession(); // Ensure WebBrowser completes the authentication session

const GoogleLoginButton = () => {
	// Your OAuth configuration
	const redirectUri = "https://metube-d21b6.web.app/__/auth/handler";

	// Authorization URL for Google
	const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=510172488097-6cr1hqknorh3bd0b7ovmk1n71cqmlnb8.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
		redirectUri
	)}&scope=openid%20profile%20email`;

	// Function to handle OAuth flow
	const handleLogin = async () => {
		try {
			// Open the authorization URL in the browser
			const result = await WebBrowser.openAuthSessionAsync(
				authorizationUrl,
				redirectUri
			);

			// Handle the result
			if (result.type === "success") {
				const { access_token } = result.params;
				const credential = GoogleAuthProvider.credential(access_token);

				signInWithCredential(authentication, credential)
					.then((userCredential) => {
						console.log("User signed in:", userCredential.user);
					})
					.catch((error) => {
						console.error("Error signing in:", error);
					});
			}
		} catch (error) {
			console.error("Error opening auth session:", error);
		}
	};

	return (
		<TouchableOpacity
			style={{ margin: 10, opacity: 1 }}
			activeOpacity={0.7}
			onPress={handleLogin}
		>
			<Image
				source={google}
				contentFit="contain"
				style={{ width: 40, height: 40 }}
			/>
		</TouchableOpacity>
	);
};

export default GoogleLoginButton;
