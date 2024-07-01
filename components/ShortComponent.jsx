import { View, Text, ImageBackground, TouchableOpacity,Image, Dimensions } from 'react-native'
import React from 'react'
import { options } from '../constants/icons';
import { router } from 'expo-router';

const width =Dimensions.get("window").width
const ShortComponent = ({title,marginVid}) => {
  return (
		<TouchableOpacity
			style={{ width: 0.48 * width, height: 250, margin: marginVid }}
			activeOpacity={0.7}
			onPress={() => {
				router.push("shorts/"+title);
			}}
		>
			<View style={{ position: "relative" }}>
				<ImageBackground
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#000",
						borderRadius: 10,
					}}
					resizeMode="cover"
				/>
				<Text
					numberOfLines={2}
					style={{
						left: "5%",
						right: "5%",
						bottom: "15%",
						color: "white",
						fontSize: 14,
						flexWrap: "wrap",
						flexDirection: "row",
						fontFamily: "Montserrat_600SemiBold",
						position: "absolute",
					}}
				>
					{title}
				</Text>
				<TouchableOpacity
					style={{ position: "absolute", right: "5%", top: "5%" }}
				>
					<Image
						source={options}
						style={{ width: 20, height: 20 }}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

export default ShortComponent