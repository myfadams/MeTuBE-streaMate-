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
		<View style={{ marginHorizontal: 13 }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					marginBottom: 20,
					// marginHorizontal: 7,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						router.back();
					}}
				>
					<Image
						source={back}
						contentFit="contain"
						style={{ width: 25, height: 25 }}
					/>
				</TouchableOpacity>
				<View>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_700Bold",
							fontSize: 35,
							// height: 35,
						}}
					>
						Search
					</Text>
				</View>
			</View>
			<View style={{ flexDirection: "row", gap: 13,  }}>
				<View style={styles.fieldStyle}>
					<Image
						source={search}
						contentFit="contain"
						style={{ width: 24, height: 24 }}
						// tintColor={"white"}
					/>
					<TextInput
						selectionColor={"#fff"}
						// autoFocus={true}
						onFocus={() => {
							setActive(true);
						}}
						// onBlur={() => {
						// 	// setActive(false);
						// }}
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
						borderRadius: 18,
						height: 58,
						borderColor: borderPrimary,

						borderWidth: 1,
						width: 58,
						alignItems: "center",
						justifyContent: "center",
					}}
					activeOpacity={0.6}
				>
					<Image
						source={microphone}
						contentFit="contain"
						style={{ width: 21, height: 21 }}
						tintColor={"white"}
					/>
				</TouchableOpacity>
			</View>
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
		borderRadius: 18,
		// width: "92%",
		flex:1,
		margin: "0 10px",
		// padding: 10,
		paddingVertical:12,
		paddingHorizontal:19,
		height: 58,
		backgroundColor: fieldColor,
		
	},
});
