
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
import { getStorage } from "firebase/storage";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optionalc
const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_APP_ID,
	measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
	databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const authentication = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);
const db = getDatabase(app);
const usersRef = (userId) => {
	return ref(db, "usersref/" + userId);
};

const VideosRef = (videoID) => {
	return ref(db, "videosRef/" + videoID);
};
const ShortsRef = (shortId) => {
	return ref(db, "shortsRef/" + shortId);
};
// console.log(app)

export {
	app,
	authentication,
	storage,
	db,
	usersRef,
	set,
	ref,
	VideosRef,

	ShortsRef,
};
