import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'

import { fieldColor } from '../constants/colors';

const MoreButton = ({ title, imageUrl, handlePress,height,color,isLoading,typeauth }) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isLoading}
			style={{
				height: height ? height : 35,
				gap: 3,
				borderRadius: Platform.OS === "ios" ? "50%" : 50,
				backgroundColor: color ? color : fieldColor,
				justifyContent: "center",
				alignItems: "center",
				minWidth: 80,
				margin: 8,
				flexDirection: "row",
				opacity: isLoading ? 0.7 : 1,
			}}
		>
			{imageUrl && (
				<Image
					source={imageUrl}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
					tintColor={"#fff"}
				/>
			)}
			<Text
				style={{
					color: "white",
					marginRight: imageUrl && 14,
					fontSize: typeauth ? 18 : 14,
					fontFamily: typeauth ? "Montserrat_500Medium" : "Montserrat_300Light",
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default MoreButton