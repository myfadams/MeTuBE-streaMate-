import {
	getAuth,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
	sendEmailVerification,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { app, db, ref, set, usersRef } from "./config";
import { avatars } from "./appwrite";
import { get, onValue } from "firebase/database";

const authentication = getAuth();
// let user;
async function createAccount(email, password) {
	try {
		const user = await createUserWithEmailAndPassword(authentication, email, password);
		await sendEmailVerification(user.user);
		return user.user;
	} catch (error) {
		// console.log(error.code)
		throw error
	}
}
export function emailVerification(user){
	return user.emailVerified
}
export async function loginUser(email,password){
	try {
		const user = await signInWithEmailAndPassword(authentication, email, password);
		return user.user
		
	} catch (error) {
		throw error;
	}
}
export async function checkVerified(user,name){
	onAuthStateChanged(authentication, (user)=>{
		console.log("verified: "+user.emailVerified)//
		console.log()
		if(!user.emailVerified){
			user.reload();
			
		}else{
			console.log(avatars.getInitials(name));
			const image = avatars.getInitials(name);
			set(usersRef(user.uid), {name:name,email:user.email,image:(""+image)})

		}
	});
	console.log("here nowe: "+user.emailVerified);
	return user.emailVerified
}

export async function getUSerProfile(userId){
	// console.log(userId)
	const userInfo =ref(db, "usersref/"+userId);
	const data = await get(userInfo)
	// console.log("data: "+JSON.stringify(data))
	const user = {
		name: data.val().name,
		email: data.val().email,
		image: data.val().image,
	};
	// console.log(user)
	return user
	// data
}

export { createAccount};
