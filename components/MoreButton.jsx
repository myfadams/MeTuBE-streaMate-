import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import { fieldColor } from '../constants/colors';

const MoreButton = ({ title, imageUrl, handlePress,height,color }) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			style={{
				height: height?height:35,
				gap: 3,
				borderRadius: "50%",
				backgroundColor: color?color:fieldColor,
				justifyContent: "center",
				alignItems: "center",
				minWidth: 80,
				margin: 8,
				flexDirection: "row",
				
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
					fontSize: 14,
					fontFamily: "Montserrat_300Light",
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default MoreButton