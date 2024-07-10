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
	console.log(user);
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
				if (!Array.isArray(snapshot.val()))
				{
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
				}else{
					snapshot.val().forEach((snap)=>{
						data.push(snap)
					})
				}
				resolve(data);
			},
			(error) => {
				reject(error); // Handle potential errors
			}
		);
	});
}

export { createAccount };
