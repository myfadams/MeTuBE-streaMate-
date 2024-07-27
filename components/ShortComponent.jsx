import { View, Text,  TouchableOpacity, Dimensions } from 'react-native'
import { Image, ImageBackground } from "expo-image";
import React, { memo, useState } from 'react'
import { options } from '../constants/icons';
import { router } from 'expo-router';
import { getUploadTimestamp } from '../libs/videoUpdates';
import { ref, update } from 'firebase/database';
import { db } from '../libs/config';

const width =Dimensions.get("window").width
const ShortComponent = ({title,short,marginVid,type}) => {
	// console.log(short)
	const [isClicked, setIsClicked] = useState(false);
  return (
		<TouchableOpacity
		disabled={isClicked}
			style={{ width:!type? 0.44 * width:0.3*width, height:!type? 250:150, margin: marginVid }}
			activeOpacity={0.7}
			onPress={() => {
				setIsClicked(true)
				router.push({ pathname: "shorts/" + short.id, params: short });
				setIsClicked(false);
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
					contentFit="cover"
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
						contentFit="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

export default ShortComponent;