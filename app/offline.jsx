import { View, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { TouchableOpacity } from "react-native-gesture-handler";

import { offineLogo } from "../constants/images";
import { getContext } from "../context/GlobalContext";
import { bgColor, buttonColor, loadingColor } from "../constants/colors";
import MoreButton from "../components/MoreButton";

const offline = ({ type }) => {
	const { setRefreshing, refereshing } = getContext();
	return (
		<SafeAreaView
			style={{ backgroundColor: bgColor, justifyContent: "center" }}
		>
			{/* {!type && <HeaderApp />} */}
			<View style={{ height: "100%" }}>
				<Image
					source={offineLogo}
					style={{ width: "100%", flex: 0.8 }}
					contentFit="contain"
				/>
				<View style={{ marginBottom: 20, alignItems: "center" }}>
					<Text
						style={{
							fontFamily: "Montserrat_700Bold",
							fontSize: 25,
							color: "white",
							textAlign: "center",
							fontWeight: "600",
						}}
					>
						You're offline. Explore downloads?
					</Text>
					<Text
						style={{
							fontFamily: "Montserrat_300Light,",
							fontSize: 16,
							color: loadingColor,
							width: "96%",
							marginTop: 12,
							textAlign: "center",
						}}
					>
						Pick videos that will autmatically download the next time you are
						online
					</Text>
				</View>
				<View style={{ alignItems: "center" }}>
					<View style={{ width: "50%" }}>
						<MoreButton
							title={"Go to downloads"}
							height={45}
							color={buttonColor}
							// handlePress={uploadStreaMateShorts}
						/>
					</View>
				</View>
				<TouchableOpacity
					activeOpacity={0.6}
					style={{ marginTop: 10 }}
					onPress={() => {
						setRefreshing(!refereshing);
					}}
				>
					<Text
						style={{
							fontFamily: "Montserrat_300Light,",
							fontSize: 16,
							color: buttonColor,

							textAlign: "center",
						}}
					>
						Tap to retry
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default offline;
