import React from "react";
import { Text, StyleSheet, Linking, View } from "react-native";
import { borderLight, buttonColor } from "../constants/colors";
import { fetchSharedShortById, fetchSharedVideoById } from "../libs/share";
import { router } from "expo-router";
import Toast from "react-native-root-toast";

// Utility function to detect and parse URLs and custom links
const parseText = (text,isuser) => {
	// Regex patterns for URLs and custom links
	const urlRegex = /(\bhttps?:\/\/[^\s]+|www\.[^\s]+)\b/gi;
	const streamateRegex = /(\bstreamate:\/\/[^\s]+)\b/gi;

	// Replace URLs and custom links with Text components
	const parsedText = text
		.split(/(\bhttps?:\/\/[^\s]+|www\.[^\s]+|streamate:\/\/[^\s]+)/gi)
		.map((part, index) => {
			if (urlRegex.test(part)) {
				return (
					<Text
						key={`url-${index}`}
						style={{...styles.link,color:!isuser?buttonColor:borderLight}}
						onPress={() =>
							Linking.openURL(
								part.startsWith("www.") ? `https://${part}` : part
							)
						}
					>
						{part}
					</Text>
				);
			} else if (streamateRegex.test(part)) {
				return (
					<Text
						key={`streamate-${index}`}
						style={{
							...styles.link,
							color: !isuser ? buttonColor : borderLight,
						}}
						onPress={async () => {
							// console.log(part);
							const partAfterShare = part.split("share")[1];

							// Remove any leading or trailing slashes or question marks
							const result = partAfterShare
								? partAfterShare.replace(/^\/+|\/+$/g, "")
								: "";
							const linkInfo = result.split("=")[0];
							const linkID = result.split("=")[1];
							if (linkInfo.toLowerCase().includes("videos")) {
								const videoInfo = await fetchSharedVideoById(linkID);
								if (videoInfo) {
									router.push({
										pathname: "video/" + linkID,
										params: {
											...videoInfo,
											videoDescription: videoInfo?.description,
										},
									});
								} else {
									let toast = Toast.show("Invalid Link", {
										duration: Toast.durations.LONG,
									});

									setTimeout(function hideToast() {
										Toast.hide(toast);
									}, 3000);
								}
							} else if (linkInfo.toLowerCase().includes("shorts")) {
								const shortInfo = await fetchSharedShortById(linkID);
								if (shortInfo) {
									router.push({
										pathname: "shorts/" + linkID,
										params: shortInfo,
									});
									console.log(shortInfo);
								} else {
									let toast = Toast.show("Invalid Link", {
										duration: Toast.durations.LONG,
									});

									setTimeout(function hideToast() {
										Toast.hide(toast);
									}, 3000);
								}
							}
							console.log(linkInfo);
						}}
					>
						{part}
					</Text>
				);
			}
			return <Text key={`text-${index}`}>{part}</Text>;
		});

	return parsedText;
};

export const ChatTextLinks = ({ text, isUser }) => {
	return <Text>{parseText(text,isUser)}</Text>;
};

const styles = StyleSheet.create({
	link: {
		color: borderLight,
		textDecorationLine: "underline",
	},
});
