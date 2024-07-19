import { View, Text, ImageBackground, TouchableOpacity,Image, Dimensions } from 'react-native'
import React, { memo } from 'react'
import { options } from '../constants/icons';
import { router } from 'expo-router';

const width =Dimensions.get("window").width
const ShortComponent = ({title,short,marginVid,type}) => {
	// console.log(short)
  return (
		<TouchableOpacity
			style={{ width:!type? 0.48 * width:0.3*width, height:!type? 250:150, margin: marginVid }}
			activeOpacity={0.7}
			onPress={() => {
				router.push({ pathname: "shorts/" + short.id, params: short });
			}}
		>
			<View
				style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}
			>
				<ImageBackground
					source={{ uri: short?.thumbnail }}
					style={{
						width: "100%",
						height: "100%",
						borderRadius: 10,
						backgroundColor: "#1A1818",
					}}
					resizeMode="cover"
				/>
				<Text
					numberOfLines={2}
					style={{
						left: "7%",
						right: "7%",
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

export default ShortComponent;