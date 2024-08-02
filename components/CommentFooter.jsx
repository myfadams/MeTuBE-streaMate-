import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { useKeyboard } from "@react-native-community/hooks";
import { bgColor } from "../constants/colors";
import { send } from "../constants/icons";
import { addComment } from "../libs/videoUpdates";
import { getContext } from "../context/GlobalContext";
import { Image } from "expo-image";
import { authentication } from "../libs/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const CommentFooter = ({ profile, videoID, creatorID }) => {
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardOpen, setKeyboardOpen] = useState(false);

	const keyboard = useKeyboard();
	// const keyboardHeight = keyboard.keyboardHeight;
	const { user } = getContext();
	const [commentText, setCommentText] = useState();
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
	const [c,setC]=useState()
	const [isSending,setIsSending]=useState(false);
	useEffect(()=>{
		setC(authentication.currentUser)
	},[user])
	const insets=useSafeAreaInsets();
	// console.log(keyboardHeight);
	return (
		// <></>
		<KeyboardAvoidingView
			keyboardVerticalOffset={keyboardHeight}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			enabled
		>
			<View
				style={{
					width: "100%",
					alignItems: "center",
					// marginBottom: Platform.OS === "ios" ?0 : 30,
				}}
			>
				<View
					style={{
						width: "94%",
						flexDirection: "row",
						marginBottom: 30,
						backgroundColor: bgColor,
						alignItems: "center",
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
						<ChatInput
							handleChange={(text) => {
								setCommentText(text);
							}}
							text={commentText}
							videoId={videoID}
							creatorID={creatorID}
						/>
					</View>
					<TouchableOpacity
						// activeOpacity={0.7}
						disabled={isSending}
						onPress={() => {
							setIsSending(true);
							const cUSer = authentication.currentUser;
							// Alert.alert(JSON.stringify(cUSer));
							addComment(videoID, user.uid, commentText, cUSer).then(() => {
								setCommentText("");
								Keyboard.dismiss();
								setIsSending(false);
							});
						}}
					>
						<Image
							source={send}
							contentFit="contain"
							style={{ width: 35, height: 35 }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default CommentFooter;
