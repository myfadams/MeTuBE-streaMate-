// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref,set} from "firebase/database"
import {getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAyIaVgZroxNOsCD9OobVPz9UmFLhYc0Hg",
	authDomain: "metube-d21b6.firebaseapp.com",
	projectId: "metube-d21b6",
	storageBucket: "metube-d21b6.appspot.com",
	messagingSenderId: "510172488097",
	appId: "1:510172488097:web:ee43624de57666363babe0",
	measurementId: "G-4SQ4ZPJ9P1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentication = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});
const storage=getStorage(app)
const db =getDatabase(app);
const usersRef  = (userId)=>{
	return ref(db, "usersref/"+userId);
}
// console.log(app)

export {app,authentication,storage,db,usersRef,set};