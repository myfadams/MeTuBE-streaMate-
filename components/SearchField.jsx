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
import { back, hide, microphone, search, show } from "../constants/icons";
import { router, useLocalSearchParams } from "expo-router";

const SearchFields = ({
	text,
	placeholderText,
	handleChange,
	name,
	value,
	handleSubmit,
	setActive,
}) => {
	// const [SearchWord, setSearchWord] = useState("");

	// const submit = () => {

	// };
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 10,
				marginHorizontal: 7,
			}}
		>
			<TouchableOpacity onPress={()=>{
				router.back()
			}}>
				<Image
					source={back}
					resizeMode="contain"
					style={{ width: 30, height: 30 }}
				/>
			</TouchableOpacity>
			<View style={styles.fieldStyle}>
				<TextInput
					selectionColor={"#fff"}
					// autoFocus={true}
					onFocus={() => {
						setActive(true);
					}}
					onBlur={() => {
						setActive(false);
					}}
					style={{
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: Platform.OS === "ios" ? "16%" : 16,
						fontFamily: "Montserrat_500Medium",
						// textAlign: "center",
						marginHorizontal: 10,
						flex: 1,
					}}
					placeholder={placeholderText}
					placeholderTextColor={"gray"}
					returnKeyType="search"
					onSubmitEditing={handleSubmit}
					onChangeText={(word) => {
						handleChange(word);
					}}
					value={value}
				/>
			</View>
			<TouchableOpacity
				style={{
					backgroundColor: fieldColor,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					height: 34,
					width: 35,
					alignItems: "center",
					justifyContent: "center",
				}}
				activeOpacity={0.6}
			>
				<Image
					source={microphone}
					resizeMode="contain"
					style={{ width: 21, height: 21 }}
					tintColor={"white"}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default SearchFields;

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
		borderRadius: 20,
		// width: "92%",
		flex:1,
		margin: "0 10px",
		padding: 10,
		height: 35,
		backgroundColor: fieldColor,
		
	},
});
