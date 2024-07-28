import {
	View,
	Text,
	// SafeAreaView,
	FlatList,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
} from "react-native";
import { Image } from "expo-image";
import React, { memo, useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

import { bgColor, borderLight, borderPrimary, fieldColor } from "../constants/colors";
import ChannelComponent from "../components/channel/ChannelComponent";
import { back, search } from "../constants/icons";
import { getContext } from "../context/GlobalContext";
import { sortBySearchResults, sortBySearchTerm } from "../libs/search";

const allSubbedChannels = () => {
	const { channels } = useLocalSearchParams();
	const temp = JSON.parse(channels);
    const {user}=getContext()
	
	// function SearchInput({ placeholderText, handleSubmit, value,handleChange }) {
	// 	return (
			
	// 	);
	// }
	
	// console.log(searches)

	const [searchText, setSearchText] = useState();
	const [searchResults, setSearchResults] = useState([]);
	function handleTextChange(text) {
		console.log("text: "+text)
		const normalizedText = text?.trim().toLowerCase() || "";
		setSearchText(normalizedText);
		const res = temp?.filter((ch) => {
			// Normalize name and handle properties
			const name = ch.name?.toLowerCase() || "";
			const handle = ch.handle?.toLowerCase() || "";

			// Check if the normalized text is included in either name or handle
			return name.includes(normalizedText) || handle.includes(normalizedText);
		});

		// return res;
		// console.log(res)
		setSearchResults(
			sortBySearchResults(res,normalizedText,"name")
		)
	}
	// console.log(searchResults)
	return (
		<SafeAreaView
			style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
		>
			<View style={{ paddingHorizontal: "3%" }}>
				<View
					style={{
						flexDirection: "row",
						paddingBottom: 6,
						justifyContent: "space-between",
						alignItems: "center",

						width: "100%",
						// paddingVertical: 14,
						marginVertical: 20,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity
							style={{}}
							activeOpacity={0.7}
							onPress={() => {
								router.push("../");
							}}
						>
							<Image
								source={back}
								contentFit="contain"
								style={{ width: 30, height: 30 }}
							/>
						</TouchableOpacity>
					</View>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_600SemiBold",
							fontSize: 20,
						}}
					>
						Channels
					</Text>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 30,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								router.push({ pathname: "userVideos/aboutVids", params: user });
							}}
						>
							<Image
								source={{
									uri: user?.photoURL.replace(
										"ChannelsInfo/",
										"ChannelsInfo%2F"
									),
								}}
								contentFit="cover"
								style={{
									width: 70,
									height: 70,
									backgroundColor: "#000",
									borderRadius: Platform.OS === "ios" ? "50%" : 50,
									borderColor: borderLight,
									borderWidth: 1,
								}}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.fieldStyle}>
					<Image
						source={search}
						contentFit="contain"
						style={{ width: 24, height: 24 }}
						// tintColor={"white"}
					/>
					<TextInput
						selectionColor={"#fff"}
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
						placeholder={"Search channels"}
						placeholderTextColor={"gray"}
						returnKeyType="search"
						// onSubmitEditing={handleSubmit}
						onChangeText={handleTextChange}
						value={searchText}
					/>
				</View>
			</View>
			<KeyboardAwareFlatList
				style={{ marginTop: 20 }}
				contentContainerStyle={{ paddingHorizontal: "3%" }}
				data={searchResults?.length > 0 ? searchResults : temp}
				renderItem={({ item, index }) => {
					return <ChannelComponent channel={item} key={index} type={"sub"} />;
				}}
				keyExtractor={(item, index) => {
					return index.toString();
				}}
			/>
		</SafeAreaView>
	);
};

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
		borderRadius: 18,
		margin: "0 10px",
		// padding: 10,
		paddingVertical: 12,
		paddingHorizontal: 21,
		height:64,
		backgroundColor: fieldColor,
	},
});

export default allSubbedChannels;
