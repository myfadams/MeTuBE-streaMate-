import { Platform, TouchableOpacity } from "react-native";
import { buttonColor, fieldColor } from "../constants/colors";
import { Image } from "expo-image";

export function AboutBtn({ icon, handlepress,bColor,btnWidth,btnHeight,imgWidth,imgHeight,disabled }) {
	return (
		<TouchableOpacity
            disabled={disabled}
			onPress={handlepress}
			style={{
				backgroundColor: bColor,
				width: btnWidth,
				height: btnHeight,
				borderRadius: Platform.OS === "ios" ? "50%" : 50,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Image
				source={icon}
				contentFit="contain"
				style={{ width: imgWidth, height: imgHeight }}
				tintColor={"#fff"}
			/>
		</TouchableOpacity>
	);
}