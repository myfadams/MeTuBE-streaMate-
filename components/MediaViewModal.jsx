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

export default function MediaViewModal({ modalVisible, setModalVisible, selectedMedia }) {
    // console.log(selectedMedia.mediaUrl);
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
								{selectedMedia?.mediaType}
							</Text>
							<TouchableOpacity
								style={{ marginBottom: 15 }}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>Close</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.mediaContainer}>
							{selectedMedia && selectedMedia?.mediaType === "image" && (
								<Image
									source={{ uri: selectedMedia?.mediaUrl }}
									style={styles.media}
									contentFit="contain"
								/>
							)}
							{selectedMedia && selectedMedia?.mediaType === "video" && (
								<Video
									source={{ uri: selectedMedia?.mediaUrl }}
									style={styles.media}
									useNativeControls
									shouldPlay={modalVisible}
								/>
							)}
						</View>
						<View style={{ width: "100%", paddingHorizontal: "8%", position:"absolute", bottom:60, alignItems:"center"  }}>
							<Text
								style={{
									fontFamily: "Montserrat_500Medium",
									fontSize: 17,
									color: "#fff",
								}}
							>
								{selectedMedia?.text}
							</Text>
						</View>
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
        backgroundColor:fieldColor,
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
