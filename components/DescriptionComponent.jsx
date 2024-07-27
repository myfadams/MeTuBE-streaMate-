import React from "react";
import { Text, Linking, StyleSheet } from "react-native";
import { borderLight, buttonColor } from "../constants/colors";

// Utility function to detect and parse URLs and hashtags
const parseText = (text) => {
	// Regex patterns for URLs and hashtags
	const urlRegex = /(\bhttps?:\/\/[^\s]+|www\.[^\s]+)\b/gi;
	const hashtagRegex = /(#\w+)/g;

	// Replace URLs and hashtags with Text components
	const parsedText = text.split(urlRegex).flatMap((part, index) => {
		if (urlRegex.test(part)) {
			return [
				<Text
					key={`url-${index}`}
					style={styles.link}
					onPress={() =>
						Linking.openURL(part.startsWith("www.") ? `https://${part}` : part)
					}
				>
					{part}
				</Text>,
			];
		}
		// Split further for hashtags
		return part.split(hashtagRegex).flatMap((subPart, subIndex) => {
			if (hashtagRegex.test(subPart)) {
				return [
					<Text
						key={`hashtag-${index}-${subIndex}`}
						style={styles.hashtag}
						onPress={() => console.log(`Hashtag pressed: ${subPart}`)}
					>
						{subPart}
					</Text>,
				];
			}
			return subPart;
		});
	});

	return parsedText;
};

export const LinkText = ({ text }) => {
	return <Text style={styles.text}>{parseText(text)}</Text>;
};

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontSize: 15,
		fontFamily: "Montserrat_400Regular",
		flexWrap: "wrap",
		flexDirection: "row",
		paddingLeft: 4,
		paddingRight: 4,
	},
	link: {
		color: buttonColor,
		textDecorationLine: "underline",
	},
	hashtag: {
		color: buttonColor,
	},
});
