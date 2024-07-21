import { View, Text ,TouchableOpacity} from "react-native";
import { Image } from "expo-image";
import React from "react";

const ForYouButtons = ({sourceUrl,title, handlePress}) => {
	return (
		<TouchableOpacity style={{ width: "100%", alignItems: "center" }} onPress={handlePress}>
			<View
				style={{
					flexDirection: "row",
					width: "97%",
					gap: 10,
                    margin:"3%",
					alignItems: "center",
				}}
			>
				<Image
					source={sourceUrl}
					style={{ width: 27, height: 27 }}
					contentFit="contain"
					tintColor={"#fff"}
				/>
				<Text
					style={{
						color: "#fff",
						fontFamily: "Montserrat_500Medium",
						fontSize: 16,
					}}
				>
					{title}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default ForYouButtons;
