import {
	uploadBytes,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import { ShortsRef, VideosRef, authentication, db, set, storage } from "./config";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { description } from "../constants/icons";
import { sendNotifications } from "./notifications";

export async function uploadFiles(type, fileUri,title) {
	const response = await fetch(fileUri);
	const blob = await response.blob();
	const filename =title.substring(0,6)+ fileUri.substring(fileUri.lastIndexOf("/") + 1);
	const fileRef = ref(storage, `${type}/${filename}`);

	await uploadBytesResumable(fileRef, blob);
	const downloadURL = await getDownloadURL(fileRef);
	console.log(`File available at: ${downloadURL}`);
	return downloadURL;
}
export const addShortToDB = async (file, thumnailUrl, videoUrl, userId,duration) => {
	const d =  new Date().toISOString();

	await set(ShortsRef(uuidv4()), {
		caption: file.title,
		thumbnail: thumnailUrl,
		video: "" + videoUrl,
		creator: userId,
		duration: duration,
		date:d,
		views: 0,
		likes: 0,
	});
	await sendNotifications(id);
};

export const addVideoToDB = async (file, thumnailUrl, videoUrl, userId,duration) => {
	const d = new Date().toISOString();
	// console.log(d)
	const id = uuidv4();
	await set(VideosRef(id), {
		title: file.title,
		thumbnail: thumnailUrl,
		video: "" + videoUrl,
		creator: userId,
		description: file.description,
		date: d,
		duration: duration,
		views: 0,
		likes: 0,
	});
	await sendNotifications(id)
};


export async function uploadProfileAndCover(fileUri,userID,type) {
	const response = await fetch(fileUri);
	const blob = await response.blob();
	// .replace(/^.*?\./,   "cover.")
	const filename = fileUri.replace(/^.*?\./, userID+type+".");
	const fileRef = ref(storage, `ChannelsInfo/${filename}`);

	await uploadBytesResumable(fileRef, blob);
	const downloadURL = await getDownloadURL(fileRef);
	console.log(`File available at: ${downloadURL}`);
	
	return downloadURL;
}

