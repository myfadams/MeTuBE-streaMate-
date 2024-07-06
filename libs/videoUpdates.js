// updateViews.js
import { get, ref, remove, runTransaction } from "firebase/database";
import { db } from "./config";
// import { database } from "./firebase";

export const incrementVideoViews = (videoId, loc) => {
	// console.log(videoId)
	const videoRef = ref(db, `${loc}/${videoId}/views`);
	runTransaction(videoRef, (currentViews) => {
		if (currentViews === null) {
			return 1; // If views doesn't exist, initialize it to 1
		}
		return currentViews + 1; // Otherwise, increment by 1
	})
		.then(() => {
			// console.log('Views incremented successfully');
		})
		.catch((error) => {
			console.error("Error incrementing views: ", error);
		});
};
export function formatViews(numViews) {
	let formattedViews;
	let submessage = "views";
	if (numViews >= 1e9) {
		formattedViews = (numViews / 1e9).toFixed(1) + "B";
	} else if (numViews >= 1e6) {
		formattedViews = (numViews / 1e6).toFixed(1) + "M";
	} else if (numViews >= 1e3) {
		formattedViews = (numViews / 1e3).toFixed(1) + "K";
	} else if (numViews === 0) {
		return "No views";
	} else if (numViews === 1) {
		formattedViews = 1;
		submessage = "view";
	} else {
		formattedViews = numViews.toString();
	}

	return `${formattedViews} ${submessage}`;
}
export const addToHistory = (type, video, videoId, userId) => {
	// Reference to the history path for the user and videoId
	const historyRef = ref(db, `history/${type}/${userId}`);

	// Run transaction to ensure latest addition appears first
	runTransaction(historyRef, (currentHistory) => {
		if (!currentHistory) {
			// If current history is null or does not exist, initialize with the new video data
			return [video];
		} else {
			if(type==="shorts"){
				// Check if videoId exists in current history
				const index = currentHistory.findIndex(
					(item) => item.id === video.id
				);
				if (index === -1) {
					// If videoId does not exist, prepend the new video data
					currentHistory.unshift(video);
				} else if (index > 0) {
					// If videoId exists but is not the first item, move it to the first position
					const videoToMove = currentHistory.splice(index, 1)[0];
					currentHistory.unshift(videoToMove);
				}
				return currentHistory;
			}else{
				// Check if videoId exists in current history
				const index = currentHistory.findIndex(
					(item) => item.videoview === video.videoview
				);
				if (index === -1) {
					// If videoId does not exist, prepend the new video data
					currentHistory.unshift(video);
				} else if (index > 0) {
					// If videoId exists but is not the first item, move it to the first position
					const videoToMove = currentHistory.splice(index, 1)[0];
					currentHistory.unshift(videoToMove);
				}
				return currentHistory;
			}
		}
	})
		.then(() => {
			console.log("Added to history successfully.");
		})
		.catch((error) => {
			console.error("Error adding to history: ", error);
		});
};


export const removeFromHistory = (type, video, videoId, userId) => {
	const historyRef = ref(db, `history/${type}/${userId}/${videoId}`);
	get(historyRef).then((snapshot) => {
		if (snapshot.exists()) {
			return remove(historyRef);
		} else {
			console.log("Reference does not exist.");
		}
	});
};