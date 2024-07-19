import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { loadingColor } from "../constants/colors";

const TruncatedText = ({ children, numberOfLines, moreText = "Read more" }) => {
	const [isTruncated, setIsTruncated] = useState(true);
	const [displayText, setDisplayText] = useState("");
	const [showMore, setShowMore] = useState(false);

	const handlePress = () => {
		setIsTruncated(!isTruncated);
	};

	useEffect(() => {
		const truncateText = () => {
			if (!isTruncated) {
				setDisplayText(children);
				return;
			}

			const { width } = Dimensions.get("window");
			const textLength = children.length;
			const avgCharWidth = 7; // average character width in pixels, this might need to be adjusted based on your font
			const maxCharsPerLine = Math.floor(width / avgCharWidth);
			const maxChars =
				maxCharsPerLine * (numberOfLines - 1) + Math.floor(maxCharsPerLine / 2);

			if (textLength > maxChars) {
				setDisplayText(`${children.slice(0, maxChars)}... `);
				setShowMore(true);
			} else {
				setDisplayText(children);
				setShowMore(false);
			}
		};

		truncateText();
	}, [children, isTruncated, numberOfLines]);

	return (
		<View>
			<Text style={styles.text}>
				{displayText}
				{showMore && isTruncated && (
					<Text style={styles.moreText} onPress={handlePress}>
						{moreText}
					</Text>
				)}
			</Text>
			{!isTruncated && (
				<TouchableOpacity onPress={handlePress}>
					<Text style={styles.moreText}>Show less</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	text: {
		color: "#fff",
		fontFamily: "Montserrat_500Medium",
	},
	moreText: {
		color: loadingColor,
		fontWeight: "bold",
		fontFamily: "Montserrat_400Regular",
	},
});

export default TruncatedText;
