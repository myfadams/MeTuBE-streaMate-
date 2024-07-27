import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import React from "react";
import HeaderApp from "./HeaderApp";
import HomeHeader from "./HomeHeader";
import { bgColor, borderLight, buttonColor } from "../constants/colors";
import { router } from "expo-router";

const SubcriptionsHeader = ({ channel }) => {
	function SubView({ info }) {
		// console.log(info)
		return info?.map((channel, id) => {
			return (
				<TouchableOpacity
					onPress={() => {
						router.push({
							pathname: "userVideos/aboutVids",
							params: {
								uid: channel.id,
								photoURL: channel.image,
								displayName: channel.name,
								otherChannel: "OtherChannel",
							},
						});
					}}
					activeOpacity={0.6}
					style={{
						width: 100,
						height: 120,
						alignItems: "center",
						justifyContent: "center",
					}}
					key={id}
				>
					<Image
						source={{ uri: channel?.image }}
						style={{
							width: 60,
							height: 60,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							backgroundColor: "#000",
							borderColor: borderLight,
							borderWidth: 1,
						}}
					/>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 15.5,
							marginTop: 12,
							marginLeft: "3%",
							fontFamily: "Montserrat_500Medium",
							alignItems: "center",
							fontWeight: "500",
							justifyContent: "center",
							// flexDirection:"row"
						}}
					>
						{channel?.name}
					</Text>
				</TouchableOpacity>
			);
		});
	}

	return (
		<View>
			<HeaderApp />
			{channel?.length > 0 && (
				<>
					<View style={{ flexDirection: "row" }}>
						<ScrollView
							horizontal
							contentContainerStyle={{ gap: 5 }}
							showsHorizontalScrollIndicator={false}
						>
							<SubView info={channel} />
						</ScrollView>
						<TouchableOpacity
							activeOpacity={0.7}
							style={{
								// height: "100%",
								width: 50,
								backgroundColor: bgColor,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								numberOfLines={1}
								style={{
									color: buttonColor,
									fontSize: 15.5,
									marginTop: 12,
									marginLeft: "3%",
									fontFamily: "Montserrat_500Medium",
									alignItems: "center",
									fontWeight: "500",
									justifyContent: "center",
									// flexDirection:"row"
								}}
							>
								All
							</Text>
						</TouchableOpacity>
					</View>
					<HomeHeader
						text={[
							"Gaming",
							"Football",
							"Call of Duty: Mobile",
							"Music",
							"Combat sports",
						]}
					/>
				</>
			)}
		</View>
	);
};

export default SubcriptionsHeader;
