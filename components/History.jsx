import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { loadingColor } from '../constants/colors';
import { options } from '../constants/icons';
import { router } from 'expo-router';

const History = () => {
  return (
		<TouchableOpacity style={{ margin: 4 }} onPress={()=>{
            router.push("/video/history")
        }}>
			<ImageBackground
				source={{}}
				style={{
					backgroundColor: "#000",
					width: 130,
					height: 80,
					borderRadius: 8,
				}}
			/>
			<View style={{ marginTop: 8, position: "relative" }}>
				<Text
					numberOfLines={2}
					style={{
						color: "white",
						fontSize: 15,
						fontFamily: "Montserrat_500Medium",
						width: 125,
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					History Title of the video
				</Text>
				<Text
					style={{
						color: loadingColor,
						fontSize: 14,
						fontFamily: "Montserrat_500Medium",
						width: 120,
						flexWrap: "wrap",
						flexShrink: 1,
						flexDirection: "row",
					}}
				>
					channel name
				</Text>
				<TouchableOpacity
					style={{position: "absolute", right: 0 }}
				>
					<Image
						source={options}
						style={{ width: 15, height: 15, position: "absolute", right: 0 }}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

export default History