import {
	getAuth,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
	sendEmailVerification,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithCredential,
	signInWithRedirect,
} from "firebase/auth";
import { app, authentication, db, ref, set, usersRef } from "./config";
import { avatars } from "./appwrite";
import { get, onValue, update } from "firebase/database";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";
import { useEffect } from "react";
// const authentication = getAuth();
// let user;
async function createAccount(email, password, name) {
	try {
		const user = await createUserWithEmailAndPassword(
			authentication,
			email,
			password
		);
		await sendEmailVerification(user?.user);
		try {
			await updateProfile(user?.user, { displayName: name });
		} catch (error) {
			console.log(error);
		}

		return user?.user;
	} catch (error) {
		// console.log(error.code)
		throw error;
	}
}
export function emailVerification(user) {
	return user?.emailVerified;
}
export async function loginUser(email, password) {
	try {
		const user = await signInWithEmailAndPassword(
			authentication,
			email,
			password
		);
		return user?.user;
	} catch (error) {
		throw error;
	}
}
// export async function logOut(){
// 	const s = await authentication.signOut()
// }
export async function checkVerified(user) {
	// console.log(user);
	onAuthStateChanged(authentication, (user) => {
		console.log("verified yh: " + user?.emailVerified); //

		if (!user?.emailVerified) {
			user?.reload();
		} else {
			console.log(user?.displayName);
			const image = avatars.getInitials(user?.displayName);
			updateProfile(user, { photoURL: "" + image });
			set(usersRef(user?.uid), {
				name: user?.displayName,
				email: user?.email,
				image: "" + image,
			});
		}
	});
	console.log("here nowe: " + user?.emailVerified);
	return user?.emailVerified;
}

export async function getUSerProfile(userId) {
	// console.log(userId)
	const userInfo = ref(db, "usersref/" + userId);
	const data = await get(userInfo);
	// console.log("data: "+JSON.stringify(data))
	const user = {
		name: data.val().name,
		email: data.val().email,
		image: data.val().image,
	};
	// console.log(user)
	return user;
	// data
}

export function fetchVideos() {
	const videosRef = ref(db, "videosRef");

	return new Promise((resolve, reject) => {
		onValue(
			videosRef,
			(snapshot) => {
				const videos = [];
				snapshot.forEach((childSnapshot) => {
					const childData = childSnapshot.val();
					if (childData) {
						videos.push({
							id: childSnapshot.key,
							...childData,
							video: encodeURIComponent(childData.video),
						});
					}
				});
				resolve(videos);
			},
			(error) => {
				reject(error); // Handle potential errors
			}
		);
	});
}
export function fetchShorts() {
	const videosRef = ref(db, "shortsRef");

	return new Promise((resolve, reject) => {
		onValue(
			videosRef,
			(snapshot) => {
				const shorts = [];
				snapshot.forEach((childSnapshot) => {
					const childData = childSnapshot.val();
					if (childData) {
						shorts.push({
							id: childSnapshot.key,
							...childData,
							video: getEncodedFirebaseUrl(childData.video),
						});
					}
				});
				resolve(shorts);
			},
			(error) => {
				reject(error); // Handle potential errors
			}
		);
	});
}
export const getCreatorInfo = (creatorID) => {
	const videosRef = ref(db, "usersref");

	return new Promise((resolve, reject) => {
		onValue(
			videosRef,
			(snapshot) => {
				const users = [];
				snapshot.forEach((childSnapshot) => {
					// console.log(creatorID)
					if (creatorID === childSnapshot.key) {
						const childData = childSnapshot.val();
						if (childData) {
							users.push({
								id: childSnapshot.key,
								...childData,
							});
						}
					}
				});
				resolve(users);
			},
			(error) => {
				reject(error); // Handle potential errors
			}
		);
	});
};
export function getEncodedFirebaseUrl(originalUrl) {
	try {
		// Parse the URL
		const url = new URL(originalUrl);

		// Extract the base URL and path
		const baseUrl = `${url.origin}/v0/b/metube-d21b6.appspot.com/o/`;
		let path = url.pathname.split("/o/")[1];
		const params = url.search;

		// Decode the path first to avoid double encoding issues
		path = decodeURIComponent(path);

		// Encode only the path part
		const encodedPath = encodeURIComponent(path);

		// Combine them back
		const finalUrl = `${baseUrl}${encodedPath}${params}`;

		return finalUrl;
	} catch (error) {
		console.error("Invalid URL", error);
		return null;
	}
}

export function fetchData(path) {
	const locRef = ref(db, path);
	// console.log(path)
	return new Promise((resolve, reject) => {
		onValue(
			locRef,
			(snapshot) => {
				const data = [];
				// console.log(Array.isArray(snapshot.val()));
				if (!Array.isArray(snapshot.val())) {
					snapshot.forEach((childSnapshot) => {
						// console.log(childSnapshot.val())
						const childData = childSnapshot.val();
						if (childData) {
							data.push({
								id: childSnapshot.key,
								...childData,
							});
						}
					});
				} else {
					snapshot.val().forEach((snap) => {
						data.push(snap);
					});
				}
				resolve(data);
			},
			(error) => {
				reject(error); // Handle potential errors
			}
		);
	});
}

export async function getAuthToken() {
	try {
		const token = await AsyncStorage.getItem(
			"firebase:authUser:AIzaSyAyIaVgZroxNOsCD9OobVPz9UmFLhYc0Hg:[DEFAULT]"
		);
		// console.log(token);
		return token;
	} catch (error) {
		console.log(error);
	}
}
getAuthToken();

export async function changeUserDetails(type, value) {
	const cUser = authentication.currentUser;
	const userRef = ref(db, "usersref/" + cUser?.uid);
	if (type === "displayName") {
		await updateProfile(cUser, { displayName: value });
		console.log(cUser?.displayName);
		await update(userRef, { name: cUser?.displayName });
	}
	if (type === "photoURL") {
		await updateProfile(cUser, { photoURL: value });
		await update(userRef, { image: cUser?.photoURL });
	}
	if (type === "desc") {
		update(userRef, { description: value });
	}
	if (type === "cover") {
		await update(userRef, { coverPhoto: value });
	}
	if (type === "handle") {
		update(userRef, { handle: value });
	}
	// console.log(cUser)
}
// console.log(authentication.currentUser);
const provider = new GoogleAuthProvider();
export const handleSignIn = async () => {
	try {
		await signInWithRedirect(authentication, provider);
	} catch (error) {
		console.error("Error during sign-in:", error);
	}
};

export { createAccount };
