import React, {
	useEffect,
	useRef,
	useState,
	useLayoutEffect,
	useCallback,
} from "react";
import * as ImagePicker from "expo-image-picker";
import {
	View,
	Text,
	FlatList,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
	bgColor,
	borderLight,
	buttonColor,
	fieldColor,
	loadingColor,
} from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { back, send } from "../constants/icons";
import { BlurView } from "expo-blur";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
	addMessageToChatRoom,
	AddToCacheArray,
	fetchItemCahced,
	fetchMessages,
	fetchObjectCachced,
	sendPendingMessages,
	storeLastMessage,
} from "../libs/chatFunctions";
import { authentication, db } from "../libs/config";
import { getContext } from "../context/GlobalContext";
import ChatViewComponent from "../components/ChatViewComponent";
import { get, onValue, ref } from "firebase/database";
import MediaSendingScreen from "../components/MediaSenderComponent";
import MediaViewModal from "../components/MediaViewModal";

const ChatScreen = () => {
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const [showSend, setShowSend] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const { chatInfo } = useLocalSearchParams();
	const curChatInfo = JSON.parse(chatInfo);
	const chatID = curChatInfo?.chatID;
	const user = authentication?.currentUser;
	const flatListRef = useRef(null);
	const insets = useSafeAreaInsets();
	const { isConnected, unreadMessages, setUnreadMessages } = getContext();
	const [sentOffline, setSentOffline] = useState(false);
	function removeObjectByChatRoomID(array, chatRoomID) {
		return array.filter((item) => item.chatRoomID !== chatRoomID);
	}
	useFocusEffect(
		useCallback(() => {
			setUnreadMessages(removeObjectByChatRoomID(unreadMessages, chatID));
		}, [])
	);

	useEffect(() => {
		if (!isConnected) {
			// const  =
			fetchObjectCachced("messages/" + chatID, chatID, "chatRoomID")
				.then((res) => {
					fetchItemCahced("pendingMessage/" + user?.uid).then(
						(pendingMessage) => {
							if (pendingMessage) {
								setMessages([...res?.messages, ...pendingMessage]);
								console.log(
									"hgejaa",
									pendingMessage[pendingMessage?.length - 1]
								);
								storeLastMessage({
									...pendingMessage[pendingMessage?.length - 1],
									chatRoomID: chatID,
								}).then(() => {
									console.log("Done");
								});
							} else {
								setMessages([...res?.messages]);
								storeLastMessage({
									...res?.messages[res?.messages?.length - 1],
									chatRoomID: chatID,
								}).then(() => {
									console.log("cachedM retessge", pendingMessage);
								});
							}
						}
					);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			const fetchMessages = async () => {
				try {
					// Reference to the messages in the specified chat room
					const messagesRef = ref(db, `chatrooms/${chatID}/messages`);
					// Fetch messages from Firebase
					const snapshot = await get(messagesRef);

					if (snapshot.exists()) {
						const messagesData = snapshot.val();
						// Convert messages object to an array
						const messagesArray = Object.values(messagesData);
						// Optionally, sort messages by timestamp
						// messagesArray.sort((a, b) => a.timestamp - b.timestamp);

						// Update state with the fetched messages
						AddToCacheArray(
							{ chatRoomID: chatID, messages: messagesArray },
							"messages/" + chatID
						);
						setMessages(messagesArray);
					} else {
						// Handle case where there are no messages
						setMessages([]);
					}
				} catch (err) {
					console.log("ereeeeoror", err);
				}
			};
			fetchMessages();
		}
	}, [sentOffline, isConnected]);
	// useEffect(() => {
	// 	if (isConnected) {
	// 		sendPendingMessages();
	// 	}
	// }, [isConnected]);
	useEffect(() => {
		const unsubscribe = fetchMessages(chatID, (updatedMessages) => {
			setMessages(updatedMessages);
			AddToCacheArray(
				{ chatRoomID: chatID, messages: updatedMessages },
				"messages/" + chatID
			);
			if (!updatedMessages || updatedMessages?.length <= 0) {
				fetchObjectCachced("messages/" + chatID, chatID, "chatRoomID").then(
					(res) => {
						setMessages(res?.messages);
					}
				);
			}
			storeLastMessage({
				...updatedMessages[updatedMessages?.length - 1],
				chatRoomID: chatID,
			});
		});

		return () => {
			unsubscribe();
		};
	}, [chatID, sentOffline]);
	// console.log(messages)
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			(e) => {
				setKeyboardHeight(e.endCoordinates.height);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardHeight(0);
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, [messages]);

	const handleSend = async () => {
		if (user) {
			setIsSending(true);
			try {
				const messageTobeSent = messageText.trim();
				setMessageText("");
				if (messageTobeSent !== "")
					await addMessageToChatRoom(
						chatID,
						user?.uid,
						messageTobeSent,
						isConnected
					);
				if (!isConnected) {
					setSentOffline(!sentOffline);
				}
			} catch (error) {
				console.error("Error sending message:", error);
			}
			setIsSending(false);
		}
	};

	const handleTextChange = (text) => {
		setMessageText(text);
		setShowSend(text.trim() !== "");
	};

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [textInput, setTextInput] = useState("");

	const pickMedia = async () => {
		let { assets: result } = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			// allowsEditing: true,
			quality: 1,
		});
		if (result && !result.canceled) {
			setSelectedMedia(result[0]);
			setModalVisible(true);
		}
	};
	const [enableMediaModal, setEnableMediaModal] = useState(false);
	const [media, setMedia] = useState();
	
	return (
		<View style={{ paddingBottom: insets.bottom, ...styles.container }}>
			<MediaSendingScreen
				modalVisible={modalVisible}
				selectedMedia={selectedMedia}
				setModalVisible={setModalVisible}
				setSelectedMedia={setSelectedMedia}
				chatRoomId={chatID}
				isConnected={isConnected}
			/>
			<MediaViewModal
				modalVisible={enableMediaModal}
				setModalVisible={setEnableMediaModal}
				selectedMedia={media}
			/>
			<View style={{ paddingTop: insets.top, ...styles.navBar }}>
				<BlurView
					intensity={20}
					style={{
						...StyleSheet.absoluteFillObject,
						justifyContent: "center",
						alignItems: "center",
					}}
				/>
				<TouchableOpacity
					style={styles.iconButton}
					onPress={() => router.back()}
				>
					<Image
						source={back}
						style={{ width: 25, height: 25 }}
						contentFit="contain"
					/>
				</TouchableOpacity>
				<View style={styles.profileContainer}>
					<Image
						source={{
							uri: curChatInfo?.image?.replace(
								"/ChannelsInfo/",
								"/ChannelsInfo%2F"
							),
						}}
						style={styles.profileImage}
						contentFit="cover"
					/>
					<View style={styles.profileInfo}>
						<Text style={styles.userName}>{curChatInfo?.name}</Text>
						<Text style={styles.lastSeen}>Last seen 5 minutes ago</Text>
					</View>
				</View>
				<View style={styles.callIcons}>
					<TouchableOpacity style={styles.iconButton}>
						<Icon name="call-outline" size={24} color="#fff" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton}>
						<Icon name="videocam-outline" size={24} color="#fff" />
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={messages}
				ref={flatListRef}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => {
					const isUser = item?.senderId === user.uid;
					if (index !== messages.length - 1) {
						return (
							<ChatViewComponent
								message={item}
								isUser={isUser}
								modalVisible={enableMediaModal}
								setModalVisible={setEnableMediaModal}
								setMedia={setMedia}
							/>
						);
					} else {
						return (
							<>
								<ChatViewComponent
									message={item}
									isUser={isUser}
									modalVisible={enableMediaModal}
									setModalVisible={setEnableMediaModal}
									setMedia={setMedia}
								/>
								<View style={{ height: 15 }}></View>
							</>
						);
					}
				}}
				contentContainerStyle={[
					styles.messagesContainer,
					{ paddingBottom: keyboardHeight * 0.05 },
				]}
				onContentSizeChange={() => {
					if (flatListRef.current) {
						flatListRef.current.scrollToEnd({ animated: true });
					}
				}}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				// { paddingBottom: keyboardHeight }
				style={[styles.inputContainer]}
			>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						marginVertical: 10,
						alignItems: "center",
						gap: 7,
					}}
				>
					<TouchableOpacity style={styles.icon} onPress={pickMedia}>
						<Icon name="add" size={24} color={buttonColor} />
					</TouchableOpacity>

					<TextInput
						style={styles.textInput}
						value={messageText}
						onChangeText={handleTextChange}
						placeholder="Type a message"
						placeholderTextColor={borderLight}
						multiline
						selectionColor={buttonColor}
					/>
					{!showSend ? (
						<>
							<TouchableOpacity style={styles.icon}>
								<Icon name="camera-outline" size={24} color={buttonColor} />
							</TouchableOpacity>
							<TouchableOpacity>
								<Icon name="mic-outline" size={24} color={buttonColor} />
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={handleSend}
							disabled={isSending}
							style={{
								width: 35,
								height: 35,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								justifyContent: "center",
								alignItems: "center",
								padding: 10,
								backgroundColor: buttonColor,
							}}
						>
							<Image source={send} style={{ width: 24, height: 24 }} />
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: bgColor,
		width: "100%",
		height: "100%",
	},
	navBar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		paddingVertical: 15,
	},
	profileContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		marginHorizontal: 10,
	},
	profileImage: {
		backgroundColor: fieldColor,
		borderWidth: 0.3,
		borderColor: borderLight,
		width: 50,
		height: 50,
		borderRadius: Platform.OS === "ios" ? "50%" : 50,
	},
	profileInfo: {
		marginLeft: 10,
	},
	userName: {
		fontFamily: "Montserrat_500Medium",
		fontSize: 16,
		color: "#fff",
	},
	lastSeen: {
		fontSize: 12,
		color: "#888",
		fontFamily: "Montserrat_400Regular",
	},
	callIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	messagesContainer: {
		padding: 10,
	},
	message: {
		padding: 10,
		borderRadius: 10,
		marginVertical: 5,
		maxWidth: "80%",
	},
	userMessage: {
		alignSelf: "flex-end",
		backgroundColor: buttonColor,
	},
	receiverMessage: {
		alignSelf: "flex-start",
		backgroundColor: "#FFF",
	},
	messageText: {
		fontSize: 15,
		fontFamily: "Montserrat_500Medium",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 8,
		color: "#fff",
		borderTopWidth: 0.3,
		borderColor: loadingColor,
	},
	textInput: {
		flex: 1,
		borderRadius: 20,
		backgroundColor: fieldColor,
		color: "#fff",
		fontSize: 15,
		fontFamily: "Montserrat_500Medium",
		paddingHorizontal: 14,
		paddingVertical: 10,
		maxHeight: 120,
	},
});

export default ChatScreen;
