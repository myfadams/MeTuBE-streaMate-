
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React from "react";
import {
	back,
	chromecast,
	edit,
	options,
	search,
	watchtime,
} from "../../constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import { bgColor } from "../../constants/colors";

const OptionsHeader = ({userInfo}) => {
  return (
		<View style={{ alignItems: "center", width: "100%", backgroundColor:bgColor }}>
			<View
				style={{
					width: "97%",

					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						style={{ margin: 10 }}
						activeOpacity={0.7}
						onPress={() => {
							router.push("../");
						}}
					>
						<Image
							source={back}
							resizeMode="contain"
							style={{ width: 30, height: 30 }}
						/>
					</TouchableOpacity>

					<Text
						numberOfLines={1}
						style={{
							color: "#fff",
							flexShrink: 1,
							width: "50%",
							// flex:0.4,
							flexDirection: "row",
							fontFamily: "Montserrat_600SemiBold",
							fontSize: 16,
						}}
					>
						{userInfo?.displayName}
					</Text>
				</View>

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 30,
					}}
				>
					<TouchableOpacity>
						<Image
							source={chromecast}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {
							router.push("/search/SearchPage");
						}}
					>
						<Image
							source={search}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={options}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default OptionsHeader