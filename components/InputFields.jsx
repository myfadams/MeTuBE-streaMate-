import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { bgColor, borderPrimary, fieldColor } from "../constants/colors";
import { hide, show } from "../constants/icons";

const InputFields = ({ text, placeholderText, handleChange }) => {
	const [isHidden, setIsHidden] = useState(true);
	return (
		<View>
			<Text style={styles.text}>{text}</Text>
			<View style={styles.fieldStyle}>
				<TextInput
					style={{
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: Platform.OS === "ios" ? "19%" : 19,
						fontFamily: "Montserrat_500Medium",
						textAlign: "center",
						flex: 1,
					}}
					placeholder={placeholderText}
					placeholderTextColor={"gray"}
					onChangeText={handleChange}
					secureTextEntry={text === "Password" && isHidden}
				/>
				{isHidden && text === "Password" && (
					<TouchableOpacity
						style={{ margin: 10 }}
						activeOpacity={0.7}
						onPress={() => {
							setIsHidden(false);
						}}
					>
						<Image
							source={show}
							resizeMode="contain"
							style={{ width: 24, height: 24 }}
						/>
					</TouchableOpacity>
				)}
				{!isHidden && text === "Password" && (
					<TouchableOpacity
						style={{ margin: 10 }}
						activeOpacity={0.7}
						onPress={() => {
							setIsHidden(true);
						}}
					>
						<Image
							source={hide}
							resizeMode="contain"
							style={{ width: 24, height: 24 }}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default InputFields;

const styles = StyleSheet.create({
	text: {
		color: "#fff",
		fontSize: Platform.OS === "ios" ? "16%" : 16,
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
		height: 68,
		backgroundColor: fieldColor,
	},
});
