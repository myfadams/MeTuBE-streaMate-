import "react-native-get-random-values";
import { ref, runTransaction, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { uploadFiles } from "./uploadFirebase";
import * as VideoThumbnails from "expo-video-thumbnails";
import { db } from "./config";
import { addItemToNamedCache } from "./chatFunctions";
const generateThumbnail = async (url) => {
	try {
		const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
			time: 1000,
		});

		return uri;
	} catch (e) {
		console.warn(e);
	}
};
export const addMediaToChatRoom = async (
	chatRoomId,
	senderId,
	text,
	mediaFile, // This is the new parameter for media files
	isConnected
) => {
	console.log("connection", isConnected);
	const messagesRef = ref(db, `chatrooms/${chatRoomId}/messages`);

	// Create a new message object with a unique ID
	const newMessageId = uuidv4(); // Generate a unique ID for the message
	const timestamp = Date.now(); // Use the current timestamp

	let newMessage = {
		id: newMessageId,
		senderId,
		text,
		timestamp,
	};

	if (mediaFile) {
		try {
			// Upload media file and get the URL
			const mediaUrl = await uploadFiles(
				"chatMedia",
				mediaFile.uri,
				mediaFile.assetId.replaceAll("/", "")
			);
			if (mediaFile.type === "video") {
				try {
					const thumbnailUri = await generateThumbnail(mediaFile.uri);
					const thumbnailUrl = await uploadFiles(
						"chatMedia",
						thumbnailUri,
						`thumbnail_${mediaFile.assetId.replaceAll("/", "")}`
					);
					newMessage = {
						...newMessage,
						mediaUrl,
						mediaType: mediaFile.type,
						thumbnailUrl,
					};
				} catch (error) {
					console.error("Error generating or uploading thumbnail:", error);
					return;
				}
			} else {
				newMessage = { ...newMessage, mediaUrl, mediaType: mediaFile.type };
			}

		} catch (error) {
			console.error("Error uploading media:", error);
			return;
		}
	}

	if (isConnected) {
		try {
			// Use runTransaction to safely add the message to the array
			await runTransaction(messagesRef, (messages) => {
				if (messages === null || !Array.isArray(messages)) {
					return [newMessage];
				} else {
					return [...messages, newMessage];
				}
			});

			console.log("Message added successfully:", newMessage);
			return newMessage;
		} catch (error) {
			console.error("Error adding message:", error);
		}
	} else {
		addItemToNamedCache(
			"pendingMessage/" + senderId,
			{ chatRoomId, ...newMessage },
			"id"
		)
			.then(() => {
				console.log("Pending message added to cache");
			})
			.catch((error) => {
				console.error("Error adding pending message to cache:", error);
			});
	}
};
