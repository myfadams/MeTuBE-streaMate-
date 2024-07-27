import {
	Alert,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { bgColor, borderPrimary, fieldColor } from "../constants/colors";
import { hide, search, show } from "../constants/icons";
import { router } from "expo-router";
import { addComment } from "../libs/videoUpdates";
import { getContext } from "../context/GlobalContext";
import { authentication } from "../libs/config";

const ChatInput = ({
	text,
	placeholderText,
	handleChange,
	videoId,
	creatorID,
	type
}) => {
	const { user } = getContext();
	// console.log(name)
	const [isHidden, setIsHidden] = useState(true);

	return (
		<View>
			<View style={styles.fieldStyle}>
				<TextInput
					autoFocus={type?true:false}
					selectionColor={"#fff"}
					onSubmitEditing={() => {
						const currentUser = authentication.currentUser
						addComment(videoId, user.uid, text,currentUser).then(()=>{
							handleChange("");

						}).catch((error)=>{

							Alert.alert("An Error occured here: "+ error.message)
						})
					}}
					style={{
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: Platform.OS === "ios" ? "16%" : 16,
						fontFamily: "Montserrat_400Regular",
						// textAlign: "center",
						flex: 1,
					}}
					placeholder={placeholderText}
					placeholderTextColor={"gray"}
					returnKeyType="send"
					// onSubmitEditing={submit}
					onChangeText={handleChange}
					value={text}
				/>
			</View>
		</View>
	);
};

export default ChatInput;

const styles = StyleSheet.create({
	text: {
		color: "#fff",
		fontSize: Platform.OS==="ios"?"16%":16,
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
