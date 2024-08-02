import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	Pressable,
	TextInput,
	Button,
	Platform,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Alert,
	TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
// 	bgColor,
// 	borderLight,
// 	buttonColor,
// 	fieldColor,
// 	loadingColor,
// } from "../constants/colors";
import { Image } from "expo-image";
// import { send } from "../constants/icons";
import {
	bgColor,
	borderLight,
	buttonColor,
	fieldColor,
} from "../constants/colors";
import { send } from "../constants/icons";
import Toast from "react-native-root-toast";
import { addMediaToChatRoom } from "../libs/sendingMedia";
import { authentication } from "../libs/config";

export default function MediaSendingScreen({
	modalVisible,
	setModalVisible,
	selectedMedia,
	chatRoomId,
	isConnected,
}) {
	// console.log(selectedMedia)
	const user = authentication?.currentUser;
	const [messageText, setMessageText] = useState("");
	const handleTextChange = (text) => {
		setMessageText(text);
	};
	return (
		// <View style={styles.container}>
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				setModalVisible(!modalVisible);
			}}
		>
			<View style={{ ...styles.centeredView }}>
				<View style={styles.modalOverlay}>
					<View style={{ ...styles.modalView }}>
						<View
							style={{
								paddingTop: useSafeAreaInsets().top,
								width: "100%",
								flexDirection: "row",
								justifyContent: "space-between",
								marginBottom: 20,
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								Send Media
							</Text>
							<TouchableOpacity
								style={{ marginBottom: 15 }}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.mediaContainer}>
							{selectedMedia && selectedMedia.type === "image" && (
								<Image
									source={{ uri: selectedMedia.uri }}
									style={styles.media}
									contentFit="contain"
								/>
							)}
							{selectedMedia && selectedMedia.type === "video" && (
								<Video
									source={{ uri: selectedMedia.uri }}
									style={styles.media}
									useNativeControls
								/>
							)}
						</View>
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
								<TextInput
									style={styles.textInput}
									value={messageText}
									onChangeText={handleTextChange}
									placeholder="Type a message"
									placeholderTextColor={borderLight}
									multiline
									selectionColor={buttonColor}
								/>

								<TouchableOpacity
									onPress={async () => {
										setModalVisible(false);
										await addMediaToChatRoom(
											chatRoomId,
											user?.uid,
											messageText,
											selectedMedia,
											isConnected
										);
                                        setMessageText("")
										let toast = Toast.show("Sent", {
											duration: Toast.durations.LONG,
										});
										setTimeout(function hideToast() {
											Toast.hide(toast);
										}, 2000);
									}}
									// disabled={isSending}
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
							</View>
						</KeyboardAvoidingView>
					</View>
				</View>
			</View>
		</Modal>
		// </View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		width: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	modalView: {
		width: "100%",
		flex: 1,
		backgroundColor: bgColor,
		borderRadius: 20,
		padding: 20,
	},
	cancelButtonText: {
		color: buttonColor,
		fontWeight: "bold",
	},
	mediaContainer: {
		width: "100%",
		alignItems: "center",
		marginBottom: 15,
		flex: 1,
	},
	media: {
		width: "100%",
		height: "100%",
	},
	inputContainer: {
		width: "100%",
	},
	textInput: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		width: "100%",
		marginBottom: 15,
		paddingHorizontal: 10,
	},
	button: {
		backgroundColor: "#2196F3",
		borderRadius: 5,
		padding: 10,
		width: "100%",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 8,
		color: "#fff",
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
