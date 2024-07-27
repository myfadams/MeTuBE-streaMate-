import React from "react";
import { Text, View, Linking } from "react-native";

// Utility function to detect and parse URLs and hashtags
const parseText = (text) => {
	// Regex patterns for URLs and hashtags
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const hashtagRegex = /(#\w+)/g;

	// Split the text into parts based on URLs and hashtags
	const parts = text.split(/(\s|[\b])(?=\b(?:https?:\/\/|#))/g);

	return parts.map((part, index) => {
		if (urlRegex.test(part)) {
			return (
				<Text
					key={index}
					style={{ color: "blue", textDecorationLine: "underline" }}
					onPress={() => Linking.openURL(part)}
				>
					{part}
				</Text>
			);
		}

		if (hashtagRegex.test(part)) {
			return (
				<Text
					key={index}
					style={{ color: "blue", textDecorationLine: "underline" }}
					onPress={() => console.log(`Hashtag pressed: ${part}`)} // Handle hashtag press
				>
					{part}
				</Text>
			);
		}

		return <Text key={index}>{part}</Text>;
	});
};

const LinkText = ({ text }) => {
	return <View>{parseText(text)}</View>;
};

// Usage
const App = () => {
	const sampleText =
		"Check out this link: https://www.example.com and this one: http://another-example.com. Also, check out #hashtag and #AnotherHashtag";

	return (
		<View style={{ padding: 20 }}>
			<LinkText text={sampleText} />
		</View>
	);
};

export default App;
