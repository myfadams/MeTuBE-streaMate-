import React, { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import { TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { authentication, db } from "../libs/config";
import { get, ref, set } from "firebase/database";
import { Image } from "expo-image";
import { google } from "../constants/icons";

WebBrowser.maybeCompleteAuthSession(); // Ensure WebBrowser completes the authentication
// console.log(makeRedirectUri("home"));
const GoogleLoginButton = () => {
	console.log(makeRedirectUri({ useProxy: true }));
	const googleAuthConfig = {
		iosClientId:
			"510172488097-0thasvpfp1lhhhkdpthvn80potkummhc.apps.googleusercontent.com",
		androidClientId:
			"510172488097-n3oir3kh9gf5g3eg62aq65jqjvin34dh.apps.googleusercontent.com",
		webClientId:
			"510172488097-6cr1hqknorh3bd0b7ovmk1n71cqmlnb8.apps.googleusercontent.com",
		redirectUri: makeRedirectUri(),
		scopes: ["openid", "profile", "email"],
	};

	const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
		googleAuthConfig,
		{ native: "com.fadl.streamate://" }
	);
	useEffect(() => {
		if (response?.type === "success") {
			const { id_token } = response.params;
			const credential = GoogleAuthProvider.credential(id_token);

			signInWithCredential(authentication, credential)
				.then(async (userCredential) => {
					// User signed in
					const user = userCredential.user;
					// console.log(user)
					const userRef = ref(db, "usersref/" + user.uid);
					const snapshot = await get(userRef);
					const usersRef = (userId) => {
						return ref(db, "usersref/" + userId);
					};
					if (!snapshot.exists()) {
						set(usersRef(user?.uid), {
							name: user?.displayName,
							email: user?.email,
							image: user?.photoURL,
						});
						// console.log(usersRef(user?.uid));
					}
					// Handle user information here
				})
				.catch((error) => {
					// Handle Errors here.
					console.error("Error signing in:", error);
				});
		}
	}, [response]);
	// console.log("res: " + response);
	return (
		<TouchableOpacity
			style={{ margin: 10, opacity: 1 }}
			activeOpacity={0.7}
			onPress={() => {
				promptAsync();
			}}
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
