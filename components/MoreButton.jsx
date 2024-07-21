import { View, Text,  TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import { Image } from "expo-image";
import { fieldColor } from '../constants/colors';

const MoreButton = ({ title, imageUrl, handlePress,height,color,isLoading,typeauth, auth }) => {
	if(!auth)
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
					contentFit="contain"
					tintColor={"#fff"}
				/>
			)}
			{isLoading&&<ActivityIndicator color={"#fff"} />}
			{!isLoading&&<Text
				style={{
					color: "white",
					marginRight: imageUrl && 14,
					fontSize: typeauth ? 18 : 14,
					fontFamily: typeauth ? "Montserrat_500Medium" : "Montserrat_300Light",
				}}
			>
				{title}
			</Text>}
		</TouchableOpacity>
	);
	else{
		return(
			<TouchableOpacity
			onPress={handlePress}
			disabled={isLoading}
			style={{
				height: height ? height : 35,
				gap: 3,
				borderRadius: 19,
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
					contentFit="contain"
					tintColor={"#fff"}
				/>
			)}
			{isLoading && <ActivityIndicator color={"#fff"} />}
			{!isLoading && (
				<Text
					style={{
						color: "white",
						marginRight: imageUrl && 14,
						fontSize: typeauth ? 18 : 14,
						fontFamily: typeauth
							? "Montserrat_500Medium"
							: "Montserrat_300Light",
					}}
				>
					{title}
				</Text>
			)}
		</TouchableOpacity>
		)
	}
};

export default MoreButton