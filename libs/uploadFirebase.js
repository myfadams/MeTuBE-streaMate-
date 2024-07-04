import {
	uploadBytes,
	ref,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import { ShortsRef, VideosRef, firestore, set, storage } from "./config";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { description } from "../constants/icons";

export async function uploadFiles(type, fileUri,title) {
	const response = await fetch(fileUri);
	const blob = await response.blob();
	const filename =title.substring(0,6)+ fileUri.substring(fileUri.lastIndexOf("/") + 1);
	const fileRef = ref(storage, `${type}/${filename}`);

	await uploadBytesResumable(fileRef, blob);
	const downloadURL = await getDownloadURL(fileRef);
	console.log(`File available at: ${downloadURL}`);
	if (type === "shorts") {
		const docRef = doc(firestore, "shortsUploads", `/${filename}`); // Adjust the path as needed
		await setDoc(docRef, {
			uploadedAt: serverTimestamp(),
		});
	}else{
        const docRef = doc(firestore, "videoUploads", `/${filename}`); // Adjust the path as needed
		await setDoc(docRef, {
			uploadedAt: serverTimestamp(),
		});
    }
	return downloadURL;
}
export const addShortToDB = async (file, thumnailUrl, videoUrl, userId) => {
	const d = new Date();

	await set(ShortsRef(uuidv4()), {
		caption: file.title,
		thumbnail: thumnailUrl,
		video: (""+videoUrl),
		creator: userId,
		views: 0,
		likes: 0,
	});
};

export const addVideoToDB = async (file, thumnailUrl, videoUrl, userId) => {
	// const d = new Date();

	await set(VideosRef(uuidv4()), {
		title: file.title,
		thumbnail: thumnailUrl,
		video:(""+ videoUrl),
		creator: userId,
		description: file.description,
		views: 0,
		likes: 0,
	});
};
