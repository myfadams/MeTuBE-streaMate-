import { get, onValue, ref } from "firebase/database";
import { db } from "./config";
import { getEncodedFirebaseUrl } from "./firebase";

export function generateLinkVideos(videoID,title){
    const linkHeader="streamate://share/videos?id=";
    const linkEnd=videoID;
    return `Checkout this video \n\nTitle: ${title}\n\n\n${
			linkHeader + linkEnd
		}`;
}

export function generateLinkShort(shortID, title) {
	const linkHeader = "streamate://share/shorts?id=";
	const linkEnd = shortID;
	return `Checkout this short \n\nCaption: ${title}\n\n\n${linkHeader + linkEnd}`;
}


export const fetchSharedVideoById = async (videoId) => {
	try {
		// Create a reference to the specific video
		const videoRef = ref(db, `videosRef/${videoId}`);

		// Fetch the data from the database
		const snapshot = await get(videoRef);

		// Check if the snapshot exists
		if (snapshot.exists()) {
			return snapshot.val(); // Return the video data
		} else {
			console.log("No video found with the given ID.");
			return null; // No video found
		}
	} catch (error) {
		console.error("Error fetching video:", error);
		return null; // Return null in case of an error
	}
};

export function fetchSharedShortById(shortId) {
	return new Promise((resolve, reject) => {
		// Create a reference to the specific short video
		const shortRef = ref(db, `shortsRef/${shortId}`);

		// Fetch the data from the database
		get(shortRef)
			.then((snapshot) => {
				if (snapshot.exists()) {
					const shortData = snapshot.val();
					resolve({
						id: shortId,
						...shortData,
						video: getEncodedFirebaseUrl(shortData.video),
					});
				} else {
					console.log("No short video found with the given ID.");
					resolve(null); // No short video found
				}
			})
			.catch((error) => {
				console.error("Error fetching short video:", error);
				reject(error); // Handle potential errors
			});
	});
}