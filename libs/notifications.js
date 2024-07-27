import { get, ref, set } from "firebase/database";
import { authentication, db } from "./config";

export async function sendNotifications(videoId) {
	const userID = authentication.currentUser?.uid;
	const subsRef = ref(db, `subs/channel/${userID}/subscribers`);

	try {
		const subsSnapshot = await get(subsRef);
		if (subsSnapshot.exists()) {
			const subscribers = subsSnapshot.val();

			// Ensure subscribers is an array
			if (Array.isArray(subscribers)) {
				for (const subID of subscribers) {
					const notificationsRef = ref(db, `notifications/${subID}`);
					const notificationsSnapshot = await get(notificationsRef);

					if (!notificationsSnapshot.exists()) {
						await set(notificationsRef, { noti: [videoId] });
					} else {
						const existingNotifications =
							notificationsSnapshot.val().noti || [];
						const updatedNotifications = [...existingNotifications, videoId];
						await set(notificationsRef, { noti: updatedNotifications });
					}
				}
			} else {
				console.error("Subscribers data is not an array");
			}
		} else {
			console.log("No subscribers found");
		}
	} catch (error) {
		console.error("Error sending notifications:", error);
	}
}
export async function removeNotifications(videoId) {
	const userID = authentication.currentUser?.uid;
	if (!userID) {
		console.error("User not authenticated");
		return;
	}
	try {
		const notificationsRef = ref(db, `notifications/${userID}/noti`);
		const notificationsSnapshot = await get(notificationsRef);
		if (notificationsSnapshot.exists()) {
			const temp = notificationsSnapshot.val()?.filter((watchedId) => {
				return watchedId != videoId;
			});
			// console.log(temp);
			 await set(notificationsRef, temp);
		}
	} catch (error) {
		console.log(error);
	}
}
// sendNotifications("2d4a01fa-a825-4c00-b600-c45c9b672822");
// removeNotifications("2d4a01fa-a825-4c00-b600-c45c9b672822");
