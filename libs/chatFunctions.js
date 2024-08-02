import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authentication, db } from "./config";
import {
	get,
	limitToLast,
	onValue,
	orderByChild,
	orderByKey,
	query,
	ref,
	runTransaction,
	set,
	startAfter,
	update,
	onChildAdded,
	onChildChanged,
	onChildRemoved,
	off,
} from "firebase/database";
import Toast from "react-native-root-toast";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";
import { useEffect } from "react";
// const token = await AsyncStorage.getAllKeys();
// console.log(token)
export const setRequests = async () => {
	try {
		const STORAGE_KEY = "sentRequests/" + authentication?.currentUser?.uid;
		const userRequest = ref(
			db,
			`chats/${authentication?.currentUser?.uid}/sentRequest`
		);
		const allRquests = await get(userRequest);
		console.log(allRquests);
		if (allRquests.exists()) {
			const jsonValue = JSON.stringify(allRquests.val());
			await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
		} else {
			await AsyncStorage.setItem(STORAGE_KEY, "[]");
		}
	} catch (error) {
		console.log(error);
		return;
	}
};
export const getAddedFriends = async () => {
	const STORAGE_KEY = "sentRequests/" + authentication?.currentUser?.uid;

	try {
		const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
		return jsonValue != null ? JSON.parse(jsonValue).reverse() : [];
	} catch (e) {
		console.error("Error reading value", e);
		return [];
	}
};

export const addNewFriendToCache = async (friendId) => {
	const STORAGE_KEY = "sentRequests/" + authentication?.currentUser?.uid;
	console.log(friendId);
	const prevList = await getAddedFriends();
	if (!prevList.includes(friendId)) {
		prevList.push(friendId);
	}
	try {
		const jsonValue = JSON.stringify(prevList);
		await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
	} catch (e) {
		console.error("Error saving value", e);
	}
	let toast = Toast.show("Friend's request sent", {
		duration: Toast.durations.LONG,
	});
	setTimeout(function hideToast() {
		Toast.hide(toast);
	}, 3000);
};

// AsyncStorage.removeItem("lastMessages").then(() => {
// 	console.log("remove");
// });
AsyncStorage.getAllKeys().then((res) => {
	console.log(res);
});
export async function addFriendRequest(friendID) {
	const userID = authentication.currentUser?.uid;
	const friendReqRef = ref(db, `chats/${userID}/sentRequest`);
	const receivedReqRef = ref(db, `chats/${userID}/receivedRequest`);

	try {
		// Get existing requests
		const allFriendsReq = await get(friendReqRef);
		const receivedReqSnapshot = await get(receivedReqRef);

		if (receivedReqSnapshot.exists()) {
			const existingReceivedRequests = receivedReqSnapshot.val() || [];
			if (
				Array.isArray(existingReceivedRequests) &&
				existingReceivedRequests.includes(friendID)
			) {
				return; // Exit the function as the request already exists
			}
		}

		if (!allFriendsReq.exists()) {
			// No existing request, so set initial data
			await set(friendReqRef, [friendID]);
		} else {
			// Update existing data
			const existingRequest = allFriendsReq.val() || [];
			if (!Array.isArray(existingRequest)) {
				throw new Error("Existing request data is not an array.");
			}
			const updatedRequest = [...existingRequest, friendID];
			// Use set to overwrite the existing data with the updated array
			await set(friendReqRef, updatedRequest);
		}
		// Uncomment and implement if you need to add a received request
		await addReceiveRequest(friendID);
	} catch (error) {
		console.error("Error adding Friend:", error);
	}
}
const addReceiveRequest = async (friendID) => {
	const userID = authentication.currentUser?.uid;
	const friendRecRef = ref(db, `chats/${friendID}/receivedRequest`);

	try {
		// Get existing requests
		const allReceivedReq = await get(friendRecRef);

		if (!allReceivedReq.exists()) {
			// No existing request, so set initial data
			await set(friendRecRef, [userID]);
		} else {
			// Update existing data
			const existingReceived = allReceivedReq.val() || [];
			if (!Array.isArray(existingReceived)) {
				throw new Error("Existing received request data is not an array.");
			}
			const updatedReceived = [...existingReceived, userID];
			// Use set to overwrite the existing data with the updated array
			await set(friendRecRef, updatedReceived);
		}
	} catch (error) {
		console.error("Error adding or setting received request:", error);
	}
	sendNotifications({ type: "friendRequest", id: userID }, friendID);
};

async function sendNotifications(request, friendID) {
	try {
		const notificationsRef = ref(db, `notifications/${friendID}`);
		const notificationsSnapshot = await get(notificationsRef);

		if (!notificationsSnapshot.exists()) {
			await set(notificationsRef, { noti: [request] });
		} else {
			const existingNotifications = notificationsSnapshot.val().noti || [];
			const updatedNotifications = [...existingNotifications, request];
			await set(notificationsRef, { noti: updatedNotifications });
		}
	} catch (error) {
		console.error("Error sending notifications:", error);
	}
}

async function removeRequestNotifications(friendID) {
	const userID = authentication.currentUser?.uid;
	if (!userID) {
		console.error("User not authenticated");
		return;
	}
	try {
		const notificationsRef = ref(db, `notifications/${userID}/noti`);
		const notificationsSnapshot = await get(notificationsRef);
		if (notificationsSnapshot.exists()) {
			const temp = notificationsSnapshot.val()?.filter((id) => {
				if (typeof id === "object") {
					return id.id != friendID;
				}
			});
			// console.log(temp);
			await set(notificationsRef, temp);
		}
	} catch (error) {
		console.log(error);
	}
}

export const removeFriendRequest = async (friendID) => {
	const userID = authentication.currentUser?.uid;
	const friendReqRef = ref(db, `chats/${userID}/receivedRequest`);
	const senderRef = ref(db, `chats/${friendID}/sentRequest`);

	try {
		// Get existing requests
		const allFriendsReq = await get(friendReqRef);
		const allSentReq = await get(senderRef);

		if (!allFriendsReq.exists()) {
			console.log("No friend requests to remove.");
			return;
		}

		// Filter out the request to be removed
		const existingRequest = allFriendsReq.val() || [];
		const existingSent = allSentReq.val() || [];
		if (!Array.isArray(existingRequest)) {
			throw new Error("Existing request data is not an array.");
		}

		const updatedRequest = existingRequest.filter((id) => id !== friendID);
		const updatedSender = existingSent.filter((id) => id !== userID);

		// Update the database with the modified list
		await set(friendReqRef, updatedRequest);
		await set(senderRef, updatedSender);

		console.log("Friend request removed successfully.");
	} catch (error) {
		console.error("Error removing Friend request:", error);
	}
	await removeRequestNotifications(friendID);
};

export const acceptRequest = async (friendID) => {
	console.log(friendID);
	const userID = authentication?.currentUser?.uid;
	const userContactRef = ref(db, `chats/${userID}/contacts`);
	const friendContactRef = ref(db, `chats/${friendID}/contacts`);
	try {
		// Get existing requests
		const userContacts = await get(userContactRef);
		const friendsContact = await get(friendContactRef);
		const chatRoomId = await createChatRoom([userID, friendID]);
		if (!userContacts.exists()) {
			// No existing request, so set initial data
			await set(userContactRef, [{ id: friendID, chatRoomId }]);
			await set(friendContactRef, [{ id: userID, chatRoomId }]);
		} else {
			// Update existing data
			const existingUserContacts = userContacts.val() || [];
			const existingFriendsContact = friendsContact.val() || [];
			if (!Array.isArray(existingUserContacts)) {
				throw new Error("Existing request data is not an array.");
			}
			const updatedUserContacts = [
				...existingUserContacts,
				{ id: friendID, chatRoomId },
			];
			const updatedFriendsContacts = [
				...existingFriendsContact,
				{ id: userID, chatRoomId },
			];
			// Use set to overwrite the existing data with the updated array
			await set(userContactRef, updatedUserContacts);
			await set(friendContactRef, updatedFriendsContacts);
		}
	} catch (error) {
		console.error("Error adding Friend:", error);
	}
};

const fetchUserById = async (userId, chatID) => {
	try {
		// Create a reference to the user in the database
		const userRef = ref(db, `usersref/${userId}`);

		// Fetch user data
		const snapshot = await get(userRef);

		if (snapshot.exists()) {
			// Return the user data
			// const lastMessage=getLastMessage(chatID)
			// console.log(lastMessage)
			return { id: userId, ...snapshot.val(), chatID };
		} else {
			// Handle case where user does not exist
			console.log(`No user found with ID: ${userId}`);
			return;
		}
	} catch (error) {
		console.error(`Error fetching user with ID ${userId}:`, error);
		return;
	}
};

export const fetchUsersByIds = async (userIds) => {
	try {
		// Create an array of promises for fetching each user
		const userPromises = userIds.map((user) =>
			fetchUserById(user?.id, user?.chatRoomId)
		);

		// Wait for all promises to resolve
		const users = await Promise.all(userPromises);
		if (users?.length > 0) {
			addTocontactsCache(users);
		}
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		return [];
	}
};

export const addTocontactsCache = async (contacts) => {
	// console.log(contacts)
	const STORAGE_KEY = "contacts/" + authentication?.currentUser?.uid;
	try {
		const jsonValue = JSON.stringify(contacts);
		await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
	} catch (e) {
		console.error("Error saving value", e);
	}
};

export const createChatRoom = async (participants) => {
	// Generate a unique ID for the chat room
	const chatRoomId = uuidv4();

	// Reference to the chatrooms node in Firebase
	const chatRoomRef = ref(db, `chatrooms/${chatRoomId}`);

	// Chat room data
	const chatRoomData = {
		participants, // Array of user IDs participating in the chat room
		createdAt: new Date().toISOString(), // Timestamp of chat room creation
		// Additional fields can be added here if needed
	};

	try {
		// Set the chat room data in the database
		await set(chatRoomRef, chatRoomData);
		console.log("Chat room created successfully:", chatRoomId);
		return chatRoomId; // Return the generated chat room ID
	} catch (error) {
		console.error("Error creating chat room:", error);
		throw error; // Rethrow the error to handle it outside of the function if needed
	}
};

export const addMessageToChatRoom = async (
	chatRoomId,
	senderId,
	text,
	isConnected
) => {
	console.log("connection", isConnected);
	const messagesRef = ref(db, `chatrooms/${chatRoomId}/messages`);
	console.log("connection", isConnected);
	// Create a new message object with a unique ID
	const newMessageId = uuidv4(); // Generate a unique ID for the message
	const newMessage = {
		id: newMessageId,
		senderId,
		text,
		timestamp: Date.now(), // Use the current timestamp
	};
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

			// console.log("Message added successfully:", newMessage);
			return newMessage;
		} catch (error) {
			console.error("Error adding message nw:", error);
		}
	} else {
		addItemToNamedCache(
			"pendingMessage/" + senderId,
			{ chatRoomId, ...newMessage },
			"id"
		).then(() => {
			console.log("pending");
		});
	}
};

export const fetchMessages = (chatRoomId, callback) => {
	try {
		const messagesRef = ref(db, `chatrooms/${chatRoomId}/messages`);

		// Set up the real-time listener
		const unsubscribe = onValue(
			messagesRef,
			(snapshot) => {
				const messages = snapshot.val();
				if (messages) {
					callback(messages); // Call the callback with the updated messages
				} else {
					callback({}); // If no messages, call the callback with an empty object
					console.log("netwokr")
				}
			},
			(error) => {
				console.error("Error fetching messages here:", error);
			}
		);

		// Return the unsubscribe function to stop listening when needed
		return unsubscribe;
	} catch (error) {
		console.log("eroorjnfd jaf ", error);
	}
};

export const getContactsFromCache = async () => {
	const STORAGE_KEY = "contacts/" + authentication?.currentUser?.uid;
	try {
		const contacts = await AsyncStorage.getItem(STORAGE_KEY);
		return contacts ? JSON.parse(contacts) : [];
	} catch (error) {
		console.error("Error fetching contacts from cache:", error);
		return [];
	}
};

export function checkIfUserIsFriend(channelD, callback) {
	getContactsFromCache()
		.then((contacts) => {
			// Look for the contact with the matching id
			const contact = contacts.find((contact) => contact?.id === channelD);
			// Call the callback with the contact if found, otherwise null
			callback(contact || null);
		})
		.catch((error) => {
			console.error("Error fetching contacts:", error);
			callback(null); // Pass null if there's an error
		});
}

export async function fetchLastMessage(chatRoomId) {
	const chatRoomRef = ref(db, `chatrooms/${chatRoomId}/messages`);

	// Query the messages ordered by timestamp and limit to the last message
	const lastMessageQuery = query(
		chatRoomRef,
		orderByChild("timestamp"),
		limitToLast(1)
	);

	try {
		// Fetch the data from Firebase
		const snapshot = await get(lastMessageQuery);

		if (snapshot.exists()) {
			const messagesArray = Object.values(snapshot.val()); // Convert object to array
			// Extract the last message (since it's the only one due to limitToLast(1))
			const lastMessage = messagesArray[messagesArray.length - 1];
			return lastMessage;
		} else {
			console.log("No messages found in this chat room.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching last message:", error);
		throw error;
	}
}

export function formatMessageTime(timestamp) {
	// Convert timestamp to Date object
	const messageDate = new Date(timestamp);
	const now = new Date();

	// Helper function to format date as MM/DD/YY
	const formatDate = (date) => {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = String(date.getFullYear()).slice(-2);
		return `${month}/${day}/${year}`;
	};

	// Helper function to get the day of the week
	const getDayName = (date) => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return days[date.getDay()];
	};

	// Check if the message was sent today
	if (messageDate.toDateString() === now.toDateString()) {
		return messageDate.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	// Check if the message was sent within the current week
	const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
	if (messageDate >= startOfWeek) {
		return getDayName(messageDate);
	}

	// Otherwise, format as MM/DD/YY
	return formatDate(messageDate);
}

export const storeLastMessage = async (newMessage) => {
	// console.log(newMessage)
	try {
		// Fetch existing messages from cache
		const storedMessagesJson = await AsyncStorage.getItem(
			"lastMessages/" + authentication?.currentUser?.uid
		);
		const storedMessages = storedMessagesJson
			? JSON.parse(storedMessagesJson)
			: [];

		// Check if there's already a message with the same chatRoomID
		const existingIndex = storedMessages.findIndex(
			(message) => message.chatRoomID === newMessage.chatRoomID
		);

		if (existingIndex !== -1) {
			// Replace the existing message
			storedMessages[existingIndex] = newMessage;
		} else {
			// Add the new message to the array
			storedMessages.push(newMessage);
		}

		// Store the updated messages array in cache
		await AsyncStorage.setItem(
			"lastMessages/" + authentication?.currentUser?.uid,
			JSON.stringify(storedMessages)
		);
	} catch (error) {
		console.error("Error storing last message:", error);
	}
};

export const fetchLastMessageCachced = async (chatRoomID) => {
	try {
		// Fetch existing messages from cache
		const storedMessagesJson = await AsyncStorage.getItem(
			"lastMessages/" + authentication?.currentUser?.uid
		);
		const storedMessages = storedMessagesJson
			? JSON.parse(storedMessagesJson)
			: [];

		// Find the message with the given chatRoomID
		const message = storedMessages.find((msg) => msg.chatRoomID === chatRoomID);

		return message || null; // Return the message or null if not found
	} catch (error) {
		console.error("Error fetching last message:", error);
		return null;
	}
};

export const AddToCacheArray = async (item, cachename) => {
	try {
		// Fetch existing messages from cache
		const storedMessagesJson = await AsyncStorage.getItem(cachename);
		const storedMessages = storedMessagesJson
			? JSON.parse(storedMessagesJson)
			: [];

		// Check if there's already a message with the same chatRoomID
		const existingIndex = storedMessages.findIndex(
			(message) => message.chatRoomID === item.chatRoomID
		);

		if (existingIndex !== -1) {
			// Replace the existing message
			storedMessages[existingIndex] = item;
		} else {
			// Add the new message to the array
			storedMessages.push(item);
		}

		// Store the updated messages array in cache
		await AsyncStorage.setItem(cachename, JSON.stringify(storedMessages));
	} catch (error) {
		console.error("Error storing last message:", error);
	}
};

export const fetchObjectCachced = async (location, termFind, keyComp) => {
	try {
		// Fetch existing messages from cache
		const storedMessagesJson = await AsyncStorage.getItem(location);
		// console.log(storedMessagesJson);
		const storedMessages = storedMessagesJson
			? JSON.parse(storedMessagesJson)
			: [];

		// Find the message with the given chatRoomID
		const message = storedMessages.find((msg) => {
			console.log(msg[keyComp]);
			return msg[keyComp] === termFind;
		});

		return message || null; // Return the message or null if not found
	} catch (error) {
		console.error("Error fetching last message:", error);
		return null;
	}
};

export const fetchItemCahced = async (cacheName) => {
	try {
		// Fetch existing messages from cache
		const storedJson = await AsyncStorage.getItem(cacheName);
		// console.log(storedMessagesJson);
		const storedArray = storedJson ? JSON.parse(storedJson) : [];

		// Find the message with the given chatRoomID

		return storedArray || null; // Return the message or null if not found
	} catch (error) {
		console.error("Error fetching last message:", error);
		return null;
	}
};

export const sendPendingMessages = async () => {
	const senderId = authentication?.currentUser?.uid;
	const pendingMessge = await fetchItemCahced("pendingMessage/" + senderId);
	console.log("Pending",pendingMessge)
	try {
		// Use runTransaction to safely add the message to the array
		if (pendingMessge) {
			console.log(pendingMessge);
			pendingMessge.forEach(async (pendingMessage) => {
				const messagesRef = ref(
					db,
					`chatrooms/${pendingMessage.chatRoomId}/messages`
				);

				await runTransaction(messagesRef, (messages) => {
					if (messages === null || !Array.isArray(messages)) {
						return [pendingMessage];
					} else {
						return [...messages, pendingMessage];
					}
				});
			});
			await AsyncStorage.removeItem("pendingMessage/" + senderId);
			console.log("Sent all pending messages");
		} else {
			console.log("no pending messages");
		}
		// return newMessage;
	} catch (error) {
		console.error("Error adding message:", error);
	}
};

export async function addItemToNamedCache(cachename, item, keyToreplace) {
	try {
		// Fetch existing messages from cache
		const storedMessagesJson = await AsyncStorage.getItem(cachename);
		const storedMessages = storedMessagesJson
			? JSON.parse(storedMessagesJson)
			: [];

		// Check if there's already a message with the same chatRoomID
		const existingIndex = storedMessages.findIndex(
			(message) => message[keyToreplace] === item[keyToreplace]
		);

		if (existingIndex !== -1) {
			// Replace the existing message
			storedMessages[existingIndex] = item;
		} else {
			// Add the new message to the array
			storedMessages.push(item);
		}

		// Store the updated messages array in cache
		await AsyncStorage.setItem(cachename, JSON.stringify(storedMessages));
	} catch (error) {
		console.error("Error storing last message:", error);
	}
}

export async function alreadyRecieved(friendID) {
	const userID = authentication.currentUser?.uid;
	const receivedReqRef = ref(db, `chats/${userID}/receivedRequest`);

	const receivedReqSnapshot = await get(receivedReqRef);

	if (receivedReqSnapshot.exists()) {
		const existingReceivedRequests = receivedReqSnapshot.val() || [];
		if (
			Array.isArray(existingReceivedRequests) &&
			existingReceivedRequests.includes(friendID)
		) {
			return true; // Exit the function as the request already exists
		} else {
			return false;
		}
	}
	return false;
}

// export async function getMessagesCountsAfterLastMessages() {
// 	const results = [];
// 	const user = authentication?.currentUser?.uid;
// 	const chatRooms = await fetchArrayFromCache("lastMessages/" + user);

// 	for (const chatRoom of chatRooms) {
// 		const { chatRoomID, id: lastMessageId } = chatRoom;

// 		if (lastMessageId) {
// 			try {
// 				const roomRef = ref(db, `chatrooms/${chatRoomID}/messages`);

// 				// Fetch all messages
// 				const roomSnapshot = await get(roomRef);
// 				if (!roomSnapshot.exists()) {
// 					console.log(`Chat room ${chatRoomID} does not exist`);
// 					results.push({ chatRoomID, count: 0 });
// 					continue;
// 				}

// 				const messages = roomSnapshot.val();
// 				if (!messages) {
// 					results.push({ chatRoomID, count: 0 });
// 					continue;
// 				}

// 				// Find the index of the last message
// 				const messageKeys = Object.keys(messages);
// 				const lastMessageIndex = messageKeys.findIndex(
// 					(key) => messages[key].id === lastMessageId
// 				);

// 				// Count messages after the last message
// 				const numberOfMessagesAfter =
// 					lastMessageIndex >= 0 ? messageKeys.length - lastMessageIndex - 1 : 0;

// 				results.push({ chatRoomID, count: numberOfMessagesAfter });
// 			} catch (error) {
// 				console.error(
// 					`Error fetching messages for chat room ${chatRoomID}:`,
// 					error
// 				);
// 				results.push({ chatRoomID, count: 0 });
// 			}
// 		}
// 	}

// 	// console.log("Unread messages count:", results);
// 	return results;
// }

AsyncStorage.getItem("lastMessages/JVzOWZRRH3dqylwXNX1yw3qlgk32").then(
	(res) => {
		console.log("lastMe", res);
	}
);

async function fetchArrayFromCache(key) {
	try {
		// Retrieve the cached data
		const cachedData = await AsyncStorage.getItem(key);

		// Check if data exists
		if (cachedData === null) {
			console.log("No data found for the given key");
			return [];
		}

		// Parse the data into an array
		const parsedData = JSON.parse(cachedData);

		// Check if the parsed data is an array
		if (!Array.isArray(parsedData)) {
			console.log("Data is not an array");
			return [];
		}

		return parsedData;
	} catch (error) {
		console.error("Error fetching data from cache:", error);
		return [];
	}
}


export async function getMessagesCountsAfterLastMessages() {
	const results = [];
	const user = authentication?.currentUser?.uid;
	const chatRooms = await fetchArrayFromCache(`lastMessages/${user}`);

	for (const chatRoom of chatRooms) {
		const { chatRoomID, id: lastMessageId } = chatRoom;

		if (lastMessageId) {
			try {
				const roomRef = ref(db, `chatrooms/${chatRoomID}/messages`);

				// Fetch all messages
				const roomSnapshot = await get(roomRef);
				if (!roomSnapshot.exists()) {
					console.log(`Chat room ${chatRoomID} does not exist`);
					// results.push({ chatRoomID, count: 0 });
					continue;
				}

				const messages = roomSnapshot.val();
				if (!messages) {
					// results.push({ chatRoomID, count: 0 });
					continue;
				}

				// Convert messages object to array for easier processing
				const messageArray = Object.values(messages);

				// Find the index of the last message
				const lastMessageIndex = messageArray.findIndex(
					(message) => message.id === lastMessageId
				);

				// Filter messages to include only those not sent by the current user
				const messagesAfterLastMessage = messageArray
					.slice(lastMessageIndex + 1)
					.filter((message) => message.senderId !== user);

				// Count the number of messages after the last message
				const numberOfMessagesAfter = messagesAfterLastMessage.length;

				if (numberOfMessagesAfter > 0) {
					results.push({ chatRoomID, count: numberOfMessagesAfter });
				}
			} catch (error) {
				console.error(
					`Error fetching messages for chat room ${chatRoomID}:`,
					error
				);
				results.push({ chatRoomID, count: 0 });
			}
		}
	}

	return results;
}

export const useLastMessage = (chatID, isConnected, setLastMessage) => {
	const user = authentication?.currentUser;
	
		useEffect(() => {
			const messagesRef = ref(db, `chatrooms/${chatID}/messages`);

			// Function to handle the data snapshot
			const handleData = (snapshot) => {
				const messages = snapshot.val();
				if (messages) {
					// Get the last message from the messages object
					const messageArray = Object.values(messages);
					const lastMessage = messageArray[messageArray.length - 1];
					setLastMessage({ ...lastMessage, chatRoomID: chatID });
				} else {
					setLastMessage(null); // No messages found
				}
			};

			// Function to fetch last message from cache
			const fetchLastMessageCached = async () => {
				try {
					const cachedMessage = await fetchLastMessageCachced(item.chatID);
					if (cachedMessage) {
						setLastMessage({ ...cachedMessage, chatRoomID: chatID });
					}
				} catch (error) {
					console.error("Error fetching cached last message:", error);
				}
			};

			// Decide whether to use real-time updates or cached data
				console.log("stupidity ")
			if (isConnected ) {
				// Listen for real-time updates

				if (user) {
					const onValueChange = onValue(messagesRef, handleData, (error) => {
						console.error("Error fetching last message weif:", error);
					});
					return () => {
						off(messagesRef, "value", onValueChange);
					};
				}

				// Cleanup listener on unmount
				
			} else {
				// Fetch last message from cache
				fetchLastMessageCached();
			}
		}, [chatID, isConnected, setLastMessage]);
		
	
};
