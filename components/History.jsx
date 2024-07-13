import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { loadingColor } from '../constants/colors';
import { options } from '../constants/icons';
import { router } from 'expo-router';
import { get, ref } from 'firebase/database';
import { db } from '../libs/config';

const History = ({data, type}) => {
	// console.log(data)
	const [his,setHis]=useState();
	useEffect(()=>{
		async function getHis(){
			let temp;
			if(type!=="shorts"){
				const vidRef = ref(db, `videosRef/${data.videoview}`);
				temp = await get(vidRef);
			}else{
				const vidRef = ref(db, `shortsRef/${data.videoview}`);
				temp = await get(vidRef);
			}
			
			const crRef = ref(db, `usersref/${temp.val().creator}`);
			let creator = await get(crRef);
			setHis({...temp.val(),...creator.val(),uid:temp.val().creator})
			// console.log(creator)
		}
		getHis()
	},[])
	// console.log(his);
	if(type!=="shorts")
  return (
		<TouchableOpacity
			style={{ margin: 4 }}
			onPress={() => {
				if (data) {
					// const { videoview, ...passedData } = data;
					// console.log(passedData)
					router.push({
						pathname: "video/" + data.videoview,
						params:his
						//  { ...passedData},
					});
				}
			}}
		>
			<Image
				source={{ uri: his?.thumbnail.replace("videos/", "videos%2F") }}
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
						height:30,
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					{his?.title}
				</Text>
				<Text
					numberOfLines={1}
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
					{his?.name}
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
						// const { trendingshort, ...passedData } = data;
						// console.log(data.id);
						// console.log(passedData);
						router.push({
							pathname: "shorts/" + data?.id,
							params: { ...his, id: data.id },
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
						uri: (his?.thumbnail)?.includes("shorts%2F")
							? his?.thumbnail
							: (his?.thumbnail)?.replace("shorts/", "shorts%2F"),
					}}
					resizeMode="cover"
				>
					<Image
						source={{
							uri: (his?.thumbnail)?.includes("shorts%2F")
								? his?.thumbnail
								: (his?.thumbnail)?.replace("shorts/", "shorts%2F"),
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
						{his?.caption}
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