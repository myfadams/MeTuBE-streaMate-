import {
	getAuth,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
	sendEmailVerification,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { app, db, ref, set, usersRef } from "./config";
import { avatars } from "./appwrite";
import { get, onValue } from "firebase/database";
import { collection } from "firebase/firestore";

const authentication = getAuth();
// let user;
async function createAccount(email, password, name) {
	try {
		const user = await createUserWithEmailAndPassword(
			authentication,
			email,
			password
		);
		await sendEmailVerification(user.user);
		try {
			await updateProfile(user.user, { displayName: name });
		} catch (error) {
			console.log(error);
		}

		return user.user;
	} catch (error) {
		// console.log(error.code)
		throw error;
	}
}
export function emailVerification(user) {
	return user.emailVerified;
}
export async function loginUser(email, password) {
	try {
		const user = await signInWithEmailAndPassword(
			authentication,
			email,
			password
		);
		return user.user;
	} catch (error) {
		throw error;
	}
}
export async function checkVerified(user) {
	onAuthStateChanged(authentication, (user) => {
		console.log("verified: " + user.emailVerified); //
		console.log();
		if (!user.emailVerified) {
			user.reload();
		} else {
			console.log(user.displayName);
			const image = avatars.getInitials(user.displayName);
			updateProfile(user, { photoURL: "" + image });
			set(usersRef(user.uid), {
				name: user.displayName,
				email: user.email,
				image: "" + image,
			});
		}
	});
	console.log("here nowe: " + user.emailVerified);
	return user.emailVerified;
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

// export async function fetchVideos() {
// 	// console.log(userId)
// 	const videosRef = ref(db, "Videos");
// 	const data = await get(videosRef);
// 	const arrayVideos=[]
// 	let temp ={...data.toJSON()}
// 	console.log(temp)
// 	return temp
// }

export function fetchVideos() {
	const videosRef = ref(db, "Videos");
	let vids =[]
	onValue(videosRef,(snapshot)=>{
		// console.log(snapshot)
		const videos = [];
		snapshot.forEach((childSnapshot) => {
			videos.push({
				id: childSnapshot.key,
				...childSnapshot.val(),
			});
		});
		vids=videos
		console.log(vids)
		
	});
	// console.log(vids);
	return vids
}

export { createAccount };
