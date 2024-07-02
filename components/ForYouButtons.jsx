import { View, Text, Image ,TouchableOpacity} from "react-native";
import React from "react";

const ForYouButtons = ({sourceUrl,title}) => {
	return (
		<TouchableOpacity style={{ width: "100%", alignItems: "center" }}>
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
					resizeMode="contain"
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
