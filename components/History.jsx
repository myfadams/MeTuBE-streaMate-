import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { loadingColor } from '../constants/colors';
import { options } from '../constants/icons';
import { router } from 'expo-router';

const History = ({data}) => {
	// console.log(data?.video)
  return (
		<TouchableOpacity
			style={{ margin: 4 }}
			onPress={() => {
				if (data) {
					const { videoview, ...passedData } = data;
					// console.log(passedData)
					router.push({
						pathname: "video/" + data.videoview,
						params: { ...passedData},
					});
				}
			}}
		>
			<Image
				source={{ uri: data?.thumbnail.replace("videos/", "videos%2F") }}
				style={{
					backgroundColor: "#000",
					width: 130,
					height: 80,
					borderRadius: 8,
				}}
				resizeMode="cover"
			/>
			<View style={{ marginTop: 8, position: "relative" }}>
				<Text
					numberOfLines={2}
					style={{
						color: "white",
						fontSize: 15,
						fontFamily: "Montserrat_500Medium",
						width: 120,
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					{data?.title}
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
					{data?.name}
				</Text>
				<TouchableOpacity style={{ position: "absolute", right: 0 }}>
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