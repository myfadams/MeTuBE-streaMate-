import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Platform,
	TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { imagesent, message, search, streamate, videosent } from "../constants/icons";
import { logo } from "../constants/images";
import {
	bgColor,
	borderLight,
	borderPrimary,
	buttonColor,
	fieldColor,
} from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { getContext } from "../context/GlobalContext";
import { router, useFocusEffect } from "expo-router";
import { authentication, db } from "../libs/config";
import { get, onValue, ref, off } from "firebase/database";
import {
	addTocontactsCache,
	fetchLastMessage,
	fetchLastMessageCachced,
	fetchUsersByIds,
	formatMessageTime,
	getContactsFromCache,
	getMessagesCountsAfterLastMessages,
	sendPendingMessages,
	storeLastMessage,
} from "../libs/chatFunctions";
import NoContacts from "../components/AllExtraChatComponent";
import { sortBySearchResults } from "../libs/search";

const ChatHomeScreen = () => {
	const {
		setRefreshing,
		refereshing,
		user,
		setUser,
		isConnected,
		unreadMessages,
		setUnreadMessages,
	} = getContext();
	const [contacts, setContacts] = useState([]);
	const insets = useSafeAreaInsets();
	const [unsubscribe, setUnsubscribe] = useState(null);
	const [isLoading, setIsloadding] = useState(false);
	useEffect(() => {
		setIsloadding(true);
		setUser(authentication.currentUser);
		getContactsFromCache().then((res) => {
			setContacts(res);
		});
		async function fetchContacts() {
			const contactRef = ref(db, `chats/${user.uid}/contacts`);
			const contactsN = await get(contactRef);

			if (contactsN.exists()) {
				// console.log("here")
				fetchUsersByIds(contactsN.val()).then((res) => {
					setContacts(res);
					addTocontactsCache(res).then(() => {
						// console.log("updated");
					});
				});
			}
			getContactsFromCache().then((res) => {
				setContacts(res);
			});
		}

		if (isConnected) {
			fetchContacts();
			setIsloadding(false);
		} else {
			getContactsFromCache().then((res) => {
				setContacts(res);
			});
			setIsloadding(false);
		}
	}, [user, refereshing, isConnected]);
	// console.log("contacts",la)
	useEffect(() => {
		if (isConnected) {
			sendPendingMessages();
		} else {
			getContactsFromCache().then((res) => {
				setContacts(res);
			});
		}
	}, [isConnected]);

	return (
		<View style={{ ...styles.container, paddingTop: insets.top }}>
			<View style={styles.header}>
				<Image source={logo} style={styles.logo} contentFit="contain" />
				<View style={styles.headerIcons}>
					
					
					<TouchableOpacity
						onPress={() => {
							router.push({
								pathname: "userVideos/channelSettings",
								params: { type: "chat" },
							});
						}}
					>
						<Image
							source={{
								uri: user?.photoURL.replace("ChannelsInfo/", "ChannelsInfo%2F"),
							}}
							contentFit="cover"
							style={{
								width: 50,
								height: 50,
								backgroundColor: "#000",
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								borderColor: borderLight,
								borderWidth: 1,
							}}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<ChatList data={contacts} isLoading={isLoading} />
		</View>
	);
};

const ChatList = ({ data, isLoading }) => {
	// console.log("datate",data)
	const [searches, setSearches] = useState([]);
	function handleTextChange(text) {
		const normalizedText = text?.trim().toLowerCase() || "";
		const res = data?.filter((ch) => {
			// Normalize name and handle properties
			const name = ch.name?.toLowerCase() || "";
			const handle = ch.handle?.toLowerCase() || "";

			// Check if the normalized text is included in either name or handle
			return name.includes(normalizedText) || handle.includes(normalizedText);
		});

		// return res;
		// console.log(res)
		setSearches(sortBySearchResults(res, normalizedText, "name"));
	}
	const [isActive,setIsACtive]=useState(false);
	return (
		<FlatList
			data={isActive&&searches.length>0?searches:data}
			renderItem={({ item }) => <ChatItem item={item} />}
			keyExtractor={(item) => item.id}
			contentInset={{ bottom: useSafeAreaInsets().bottom }}
			ListEmptyComponent={!isLoading && <NoContacts />}
			ListHeaderComponent={
				data?.length > 0 && (
					<View style={{ paddingHorizontal: "3%", marginBottom: 10 }}>
						<Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_700Bold",
								fontSize: 35,
								// height: 35,
							}}
						>
							Chats
						</Text>
						<View
							style={{
								borderStyle: "solid",
								borderColor: borderPrimary,
								flexDirection: "row",
								borderWidth: 1,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 18,
								// width: "92%",
								flex: 1,
								marginVertical: 10,
								// padding: 10,
								paddingVertical: 12,
								paddingHorizontal: 19,
								height: 58,
								backgroundColor: fieldColor,
							}}
						>
							<Image
								source={search}
								contentFit="contain"
								style={{ width: 24, height: 24 }}
								// tintColor={"white"}
							/>
							<TextInput
								selectionColor={buttonColor}
								style={{
									width: "100%",
									height: "100%",
									color: "white",
									fontSize: Platform.OS === "ios" ? "16%" : 16,
									fontFamily: "Montserrat_500Medium",
									// textAlign: "center",
									marginHorizontal: 10,
									flex: 1,
								}}
								onFocus={()=>{
									setIsACtive(true)
								}}
								placeholder={"Search chats"}
								placeholderTextColor={"gray"}
								onChangeText={handleTextChange}
								// value={value}
							/>
						</View>
					</View>
				)
			}
		/>
	);
};

const ChatItem = ({ item }) => {
	const [lastMessage, setLastMessage] = useState(null);
	const { isConnected, unreadMessages, setUnreadMessages } = getContext();

	useEffect(() => {
		const getLastMessage = async () => {
			try {
				if (!isConnected) {
					const message = await fetchLastMessageCachced(item.chatID);
					setLastMessage({ ...message, chatRoomID: item.chatID });
				}
			} catch (error) {
				console.error("Error fetching last message:", error);
			}
		};

		getLastMessage();
	}, [isConnected]);
	// console.log("llde", lastMessage);
	useEffect(() => {
		// Reference to the messages in the specified chat room
		if (isConnected) {
			const messagesRef = ref(db, `chatrooms/${item.chatID}/messages`);

			// Set up a real-time listener on the messages reference
			const unsubscribe = onValue(messagesRef, (snapshot) => {
				const messages = snapshot.val();
				if (messages) {
					// Convert messages object to an array
					const messagesArray = Object.values(messages);

					// Get the last message based on timestamp or any other criteria
					const latestMessage = messagesArray.reduce((latest, message) => {
						return message.timestamp > (latest.timestamp || 0)
							? message
							: latest;
					}, {});

					setLastMessage({ ...latestMessage, chatRoomID: item.chatID });
				}
			});

			// Clean up the listener on component unmount
			return () => unsubscribe();
		} else {
			fetchLastMessageCachced(item.chatID).then((message) => {
				// console.log("message", message);
				setLastMessage({ ...message, chatRoomID: item.chatID });
			});
		}
	}, [item.chatID]);
	useEffect(() => {
		getMessagesCountsAfterLastMessages().then((unreadCounts) => {
			setUnreadMessages(unreadCounts);
		});
	}, [lastMessage]);
	const unreadM = unreadMessages?.find((m) => m?.chatRoomID === item.chatID);
	return (
		<TouchableOpacity
			style={styles.chatItem}
			onPress={() => {
				router.push({
					pathname: "chatScreen",
					params: { chatInfo: JSON.stringify(item) },
				});
			}}
		>
			<TouchableOpacity
				onPress={() => {
					router.push({
						pathname: "userVideos/aboutVids",
						params: {
							uid: item?.id,
							photoURL: item?.image,
							displayName: item?.name,
							from:"chat"
						},
					});
				}}
			>
				<Image
					source={{ uri: item?.image }}
					style={styles.profileImage}
					contentFit="cover"
				/>
			</TouchableOpacity>
			<View
				style={{
					flexDirection: "row",
					flex: 1,
					borderColor: borderPrimary,
					borderBottomWidth: 0.2,
					borderTopWidth: 0.2,
					paddingTop: 10,
					paddingBottom: 30,
					paddingRight: 12,
				}}
			>
				<View style={styles.chatContent}>
					<Text style={styles.name} numberOfLines={1}>
						{item?.name}
					</Text>
					<View
						style={{
							flexDirection: "row",
							flex: 1,
							gap: 5,
							alignItems: "center",
						}}
					>
						<Text style={styles.message} numberOfLines={1}>
							{lastMessage?.text ?? "No messages yet"}
						</Text>
						{lastMessage?.mediaType && (
							<Image
								source={
									lastMessage?.mediaType === "image" ? imagesent : videosent
								}
								style={{ width: 20, height: 20 }}
								tintColor={buttonColor}
							/>
						)}
					</View>
				</View>
				<View style={styles.chatMeta}>
					<Text style={styles.time}>
						{formatMessageTime(lastMessage?.timestamp) !== "NaN/NaN/aN" &&
							formatMessageTime(lastMessage?.timestamp)}
					</Text>
					{unreadM?.count > 0 && (
						<View style={styles.unreadBadge}>
							<Text style={styles.unreadCount}>{unreadM?.count}</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ChatHomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: bgColor,
		// height:"100%"
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 7,
		paddingVertical: 10,
		backgroundColor: bgColor,
	},
	logo: {
		width: 105,
		height: 60,
	},
	headerIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
	},
	profileIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
	},
	chatItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingVertical: 10,
		margin: 6,
		borderRadius: 12,
	},
	profileImage: {
		width: 60,
		height: 60,
		marginLeft: 12,
		borderWidth: 0.3,
		borderColor: borderLight,
		backgroundColor: fieldColor,
		borderRadius: Platform.OS === "ios" ? "50%" : 50,
	},
	chatContent: {
		flex: 1,
		gap: 3,
		marginHorizontal: 10,
	},
	name: {
		color: "#fff",
		fontFamily: "Montserrat_600SemiBold",
		fontSize: 18,
	},
	message: {
		color: "#aaa",
		fontFamily: "Montserrat_500Medium",
		fontSize: 14,
	},
	chatMeta: {
		alignItems: "flex-end",
	},
	time: {
		color: buttonColor,
		fontFamily: "Montserrat_500Medium",
		fontSize: 12,
	},
	unreadBadge: {
		backgroundColor: buttonColor,
		borderRadius: 50,
		paddingHorizontal: 6,
		paddingVertical: 2,
		marginTop: 5,
	},
	unreadCount: {
		color: "#fff",
		fontFamily: "Montserrat_500Medium",
		fontSize: 12,
	},
});
