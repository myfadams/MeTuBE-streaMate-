import { View, Text, StyleSheet, TouchableWithoutFeedback, Platform } from "react-native";
import React from "react";
import {
	borderLight,
	borderPrimary,
	buttonColor,
	loadingColor,
} from "../constants/colors";
import { ChatTextLinks } from "./ChatTextLinks";
import { Image } from "expo-image";
import { playIcon } from "../constants/icons";

const ChatViewComponent = ({
	message,
	isUser,
	modalVisible,
	setModalVisible,
	setMedia,
}) => {
	// Format the timestamp into a readable string
	const formatMessageTime = (timestamp) => {
		// Replace with your actual formatting logic
		const date = new Date(timestamp);
		return `${date.getHours() === 0 ? "00" : date.getHours()}:${
			date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
		}`;
	};

	return (
		<View
			style={[
				styles.message,
				isUser ? styles.userMessage : styles.receiverMessage,
			]}
		>
			{message?.mediaType && (
				<TouchableWithoutFeedback
					onPress={() => {
						setModalVisible(true);
						setMedia(message);
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Image
							source={{
								uri:
									message?.mediaType === "image"
										? message?.mediaUrl
										: message?.thumbnailUrl,
							}}
							style={{
								width: "100%",
								height: 200,
								backgroundColor: "#000",
								borderRadius: 10,
							}}
							contentFit="cover"
						/>
						{message?.mediaType === "video"&&<View
							style={{
								backgroundColor: "rgba(128, 128, 128, 0.5)",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								width: 47,
								height: 47,
								width: 60,
								height: 60,
								position: "absolute",
							}}
						>
							<Image
								source={playIcon}
								style={{ width: 25, height: 25 }}
								contentFit="contain"
							/>
						</View>}
					</View>
				</TouchableWithoutFeedback>
			)}
			<Text
				style={{
					...styles.messageText,
					marginTop: message?.mediaType ? 10 : 0,
				}}
			>
				<ChatTextLinks text={message?.text} isUser={isUser} />{" "}
			</Text>
			<View style={{ height: 5 }}></View>
			<Text
				style={{
					...styles.messageTime,
					alignSelf: isUser ? "flex-end" : "flex-start",
					left: !isUser ? 7 : null,
					right: isUser ? 7 : null,
					color: isUser ? "#DCDCDC" : loadingColor,
				}}
			>
				{formatMessageTime(message?.timestamp)}
			</Text>
		</View>
	);
};

export default ChatViewComponent;

const styles = StyleSheet.create({
	message: {
		padding: 10,
		borderRadius: 10,
		marginVertical: 5,
		maxWidth: "80%",
		position: "relative", // Positioning for the timestamp
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
		position: "relative",
	},
	messageTime: {
		fontSize: 10,

		// Light grey color for the timestamp
		position: "absolute",
		bottom: 3,
	},
});
