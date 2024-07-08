import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import HeaderApp from "./HeaderApp";
import HomeHeader from "./HomeHeader";
import { bgColor, borderLight, buttonColor } from "../constants/colors";

const SubcriptionsHeader = ({channel}) => {
    function SubView({ info }) {
            // console.log(info.name)
			return info?.map((channel, id) => {
				return (
					<View
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
								borderRadius: "50%",
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
					</View>
				);
			});
		}

	return (
		<View>
			<HeaderApp />
			<View style={{ flexDirection: "row" }}>
				<ScrollView
					horizontal
					contentContainerStyle={{ gap: 10 }}
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
		</View>
	);
};

export default SubcriptionsHeader;
