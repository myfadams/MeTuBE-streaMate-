import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { back, playAdd } from "../constants/icons";

const UploadButtons = ({ sourceUrl, title, subtitle, type, handlePress,subValue }) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			style={{
				width: "100%",
				alignItems: "center",
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					margin: "3%",
					alignItems: "center",
				}}
			>
				<Image
					source={sourceUrl}
					style={{ width: 27, height: 27 }}
					resizeMode="contain"
					tintColor={"#fff"}
				/>
				<View>
					{subtitle && (
						<Text
							style={{
								color: "#C5C5C5",
								fontFamily: "Montserrat_500Medium",
								fontSize: 10,
							}}
						>
							{subtitle}
						</Text>
					)}
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_500Medium",
							fontSize: 16,
						}}
					>
						{title}
					</Text>
					{subValue && (
						<View
							style={{
								// flex: 0.5,
								justifyContent: "center",
								width:"80%"
							}}
						>
							<Text
								numberOfLines={1}
								style={{
									color: "#C5C5C5",
									fontFamily: "Montserrat_500Medium",
									fontSize: 10,
									
								}}
							>
								{subValue}
							</Text>
						</View>
					)}
				</View>
			</View>
			<Image
				source={type === "playlist" ? playAdd : back}
				style={{ width: 27, height: 27, transform: [{ rotate: "180deg" }] }}
				resizeMode="contain"
				tintColor={"#fff"}
			/>
		</TouchableOpacity>
	);
};

export default UploadButtons;
