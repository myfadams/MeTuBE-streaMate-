import { View, Text } from "react-native";
import React from "react";
import { Image } from "react-native";
import { searchNotfound } from "../constants/images";
import { buttonColor } from "../constants/colors";
import MoreButton from "./MoreButton";
import { router } from "expo-router";

const NothingToseeHere = ({ image, buttonText, handleButton, text,type }) => {
	return (
		<View
			style={{
				paddingTop: 25,
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
			}}
		>
			<Image
				style={{ height: 300, width: "100%" }}
				source={image}
				tintColor={buttonColor}
				contentFit="contain"
			/>
			<Text
				style={{
					marginTop: 30,
					fontFamily: "Montserrat_700Bold",
					fontSize: 20,
					color: "white",
					textAlign: "center",
					fontWeight: "600",
				}}
			>
				{text}
			</Text>
			{type&&<View style={{ width: "100%", marginVertical: 15 }}>
				<MoreButton
					title={buttonText}
					height={50}
					color={buttonColor}
					handlePress={handleButton}
					typeauth={"auth"}
				/>
			</View>}
		</View>
	);
};

export default NothingToseeHere;
