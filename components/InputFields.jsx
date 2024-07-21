import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { bgColor, borderPrimary, fieldColor, otherColor } from "../constants/colors";
import { hide, show } from "../constants/icons";

const InputFields = ({ text, placeholderText, handleChange,value,icon }) => {
	const [isHidden, setIsHidden] = useState(true);
	// console.log(text);

	return (
		<View>
			<Text style={styles.text}>{text}</Text>
			<View style={styles.fieldStyle}>
				
				<Image
					source={icon}
					contentFit="contain"
					style={{ width: 20, height: 20 }}
					tintColor={"#fff"}
				/>
				
				<TextInput
					selectionColor={"#fff"}
					style={{
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: Platform.OS === "ios" ? "17%" : 17,
						fontFamily: "Montserrat_500Medium",
						// textAlign: "center",
						justifyContent: "center",
						alignItems: "center",
						marginHorizontal: 10,
						flex: 1,
					}}
					placeholder={placeholderText}
					placeholderTextColor={"gray"}
					onChangeText={handleChange}
					secureTextEntry={text === "Password" && isHidden}
					value={value}
				/>
				{isHidden && text === "Password" && value !== "" && (
					<TouchableOpacity
						style={{ margin: 10 }}
						activeOpacity={0.7}
						onPress={() => {
							setIsHidden(false);
						}}
					>
						<Image
							source={show}
							contentFit="contain"
							style={{ width: 24, height: 24 }}
						/>
					</TouchableOpacity>
				)}
				{!isHidden && text === "Password" && value !== "" && (
					<TouchableOpacity
						style={{ margin: 10 }}
						activeOpacity={0.7}
						onPress={() => {
							setIsHidden(true);
						}}
					>
						<Image
							source={hide}
							contentFit="contain"
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
		borderRadius: 19,
		width: "92%",
		margin: "0 10px",
		paddingVertical:13,
		paddingHorizontal:20,
		height: 69,
		backgroundColor: fieldColor,
	},
});
