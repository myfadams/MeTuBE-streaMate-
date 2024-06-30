import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { bgColor, borderPrimary, fieldColor } from "../constants/colors";
import { hide, search, show } from "../constants/icons";
import { router } from "expo-router";

const ChatInput = ({ text, placeholderText, handleChange, name }) => {
	const [isHidden, setIsHidden] = useState(true);
	const [SearchWord, setSearchWord] = useState("");
	const [searches, setSearches] = useState([]);
	const submit = () => {
		setSearches(searches.push(SearchWord));
		console.log(searches);
		router.replace("search/results");
	};
	return (
		<View>
			<View style={styles.fieldStyle}>
				<TextInput
					style={{
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: "19%",
						fontFamily: "Montserrat_500Medium",
						textAlign: "center",
						flex: 1,
					}}
					placeholder={placeholderText}
					placeholderTextColor={"gray"}
					returnKeyType="send"
					// onSubmitEditing={submit}
					onChangeText={(word) => {
						setSearchWord(word);
						handleChange;
					}}
					value={SearchWord}
				/>

				
			</View>
		</View>
	);
};

export default ChatInput;

const styles = StyleSheet.create({
	text: {
		color: "#fff",
		fontSize: "16%",
		marginBottom: 5,
		fontFamily: "Montserrat_500Medium",
	},

	fieldStyle: {
		borderStyle: "solid",
		borderColor: borderPrimary,
		flexDirection: "row",
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		width: "92%",
		margin: "0 10px",
		padding: 10,
		height: 42,
		backgroundColor: fieldColor,
	},
});
