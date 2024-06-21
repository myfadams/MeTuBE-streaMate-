import {
	getAuth,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
	sendEmailVerification,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { app, set, usersRef } from "./config";

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

		}
	});
	set(usersRef(user.uid), {name:name,email:user.email})
	console.log("here nowe: "+user.emailVerified);
	return user.emailVerified
}

export { createAccount};
