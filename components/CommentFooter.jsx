import { View, Text, TouchableOpacity, Image,KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { useKeyboard } from "@react-native-community/hooks";
import { bgColor } from "../constants/colors";
import { send } from "../constants/icons";

const CommentFooter = ({profile}) => {
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	const keyboard = useKeyboard();
	// const keyboardHeight = keyboard.keyboardHeight;
	
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
			(event) => {
				setKeyboardOpen(true);
				setKeyboardHeight(event.endCoordinates.height);
			}
		);

		const keyboardDidHideListener = Keyboard.addListener(
			Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
			() => {
				setKeyboardOpen(false);
				setKeyboardHeight(0);
			}
		);

		// Clean up listeners
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return (
		// <></>
		<KeyboardAvoidingView
			keyboardVerticalOffset={keyboardHeight}
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
					}}
				>
					<Image
						source={{ uri: profile }}
						style={{
							width: 40,
							height: 40,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
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
