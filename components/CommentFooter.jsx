import { View, Text, TouchableOpacity, Image,KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import ChatInput from "./ChatInput";
import { useKeyboard } from "@react-native-community/hooks";
import { bgColor } from "../constants/colors";
import { send } from "../constants/icons";

const CommentFooter = ({profile}) => {
	const keyboard = useKeyboard();

	// console.log("keyboard isKeyboardShow: ", keyboard.keyboardShown);
	// console.log("keyboard keyboardHeight: ", keyboard.keyboardHeight);
	return (
		// <></>
		<KeyboardAvoidingView
			keyboardVerticalOffset={keyboard.keyboardHeight}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			enabled
		>
			<View style={{ width: "100%", alignItems: "center" }}>
				<View
					style={{
						width: "94%",
						flexDirection: "row",
						marginBottom: 16,
						backgroundColor: bgColor,
						// position: keyboard.keyboardShown && "absolute",
						// bottom: keyboard.keyboardShown && keyboard.keyboardHeight - 80,
					}}
				>
					<Image
					source={{uri:profile}}
						style={{
							width: 40,
							height: 40,
							borderRadius: "50%",
							backgroundColor: "white",
							// opacity: 0.6,
						}}
					/>
					<View style={{ width: "80%", alignItems: "center" }}>
						<ChatInput />
					</View>
					<TouchableOpacity
					// activeOpacity={0.7}
					>
						<Image
							source={send}
							resizeMode="contain"
							style={{ width: 40, height: 40 }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default CommentFooter;
