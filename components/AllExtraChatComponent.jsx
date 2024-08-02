import { View, Text, Platform } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { nofriends, offineLogo } from "../constants/images";
import { buttonColor, loadingColor } from "../constants/colors";
import MoreButton from "./MoreButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addFriend } from "../constants/icons";
import { router } from "expo-router";

const NoContacts = () => {
	return (
		// <View
		// 	style={{
		// 		height: "100%",
		// 		width: "100%",
		//         flex:1,
		// 		alignItems: "center",
		// 		justifyContent: "center",
		// 	}}
		// >
		// 	{/* <Image
		// 		style={{ height:270, width:"100%" }}
		// 		source={nofriends}
		// 		tintColor={buttonColor}
		// 		contentFit="contain"
		// 	/> */}
		// 	<Text
		// 		style={{
		// 			fontFamily: "Montserrat_700Bold",
		// 			fontSize: 25,
		// 			color: "white",
		// 			textAlign: "center",
		// 			fontWeight: "600",
		// 		}}
		// 	>
		// 		No Friends, add some
		// 	</Text>
		// </View>

		<View style={{ height: "100%", flex: 1 }}>
			<Image
				source={nofriends}
				style={{ width: "100%", height: 270, marginVertical: 30 }}
				contentFit="contain"
				tintColor={buttonColor}
			/>
			<View style={{ marginVertical: 30, alignItems: "center" }}>
				<Text
					style={{
						fontFamily: "Montserrat_700Bold",
						fontSize: 25,
						color: "white",
						textAlign: "center",
						fontWeight: "600",
					}}
				>
					You have no friends, Find some!
				</Text>
			</View>

			<View style={{ alignItems: "center" }}>
				<View style={{ width: "50%" }}>
					<MoreButton
                    imageUrl={addFriend}
						title={"Add a freind"}
						height={50}
						color={buttonColor}
						handlePress={() => {
							router.push("/search/SearchPage");
						}}
					/>
				</View>
			</View>
		</View>
	);
};

export default NoContacts;
