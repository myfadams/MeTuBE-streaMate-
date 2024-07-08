import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { loadingColor } from '../constants/colors';
import { options } from '../constants/icons';
import { router } from 'expo-router';

const History = ({data, type}) => {
	// console.log(data?.video)
	if(type!=="shorts")
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
	else{
		return (
			<TouchableOpacity
				style={{ margin: 4 }}
				onPress={() => {
					if (data) {
						const { trendingshort, ...passedData } = data;
						console.log(data.id);
						// console.log(passedData);
						router.push({
							pathname: "shorts/" + data?.id,
							params: { ...passedData, id: data.id },
						});
					}
				}}
			>
				<ImageBackground
					imageStyle={{ opacity: 0.4, borderRadius: 8 }}
					style={{
						height: 135,
						height: 80,

						overflow: "hidden",
					}}
					source={{
						uri: (data?.thumbnail).includes("shorts%2F")
							? data?.thumbnail
							: (data?.thumbnail).replace("shorts/", "shorts%2F"),
					}}
					resizeMode="cover"
				>
					<Image
						source={{
							uri: (data?.thumbnail).includes("shorts%2F")
								? data?.thumbnail
								: (data?.thumbnail).replace("shorts/", "shorts%2F"),
						}}
						style={{
							// backgroundColor: "#000",
							width: 135,
							height: 80,
							borderRadius: 8,
						}}
						resizeMode="contain"
					/>
				</ImageBackground>
				<View style={{ marginTop: 8, position: "relative" }}>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_500Medium",
							width: 120,
							flexWrap: "wrap",
							flexDirection: "row",
						}}
					>
						{data?.caption}
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
}

export default History