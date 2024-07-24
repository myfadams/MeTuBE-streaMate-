import {
	View,
	Text,
	ImageBackground,
	TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useState } from "react";
import { loadingColor } from "../constants/colors";
import { clock, like, options, shortLogo } from "../constants/icons";
import { router, useFocusEffect } from "expo-router";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";

const PlaylistView = ({ data }) => {
	const lastItemId = Object.keys(data).length - 2;
	const [getLastVid, setgetLastVid] = useState({});
	const [refe, setRefe] = useState(false)
    // console.log(data);
	useFocusEffect(
		useCallback(() => {
			setRefe(true);
			return () => {
				// This will be called when the screen is unfocused
				// console.log("Screen is unfocused");
				setRefe(false);
			};
		}, [])
	);
	useEffect(() => {
		function unsubscribe() {
			if (data.id !== "likedShorts") {
				const lastref = ref(db, "videosRef/" + data[lastItemId]);
				onValue(lastref, (snapshot) => {
					const data = [];
					// console.log(snapshot.val());
					setgetLastVid(snapshot.val());
					// console.log(data)
				});
			} else {
				const lastref = ref(db, "shortsRef/" + data[lastItemId]);
				onValue(lastref, (snapshot) => {
					setgetLastVid(snapshot.val());
					// console.log(data)
				});
			}
		}
		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [refe]);
	// console.log(getLastVid);

	return (
		<TouchableOpacity style={{ margin: 4 }} onPress={()=>{
			if (data?.id === "likedShorts")
				router.push({ pathname: "playlist/playlist",params:{type:"likedShorts"} });
			if (data?.id === "likedVideos")
				router.push({ pathname: "playlist/playlist",params:{type:"likedVideos"} });
			if (data?.id === "watchLater")
				router.push({
					pathname: "playlist/playlist",
					params: { type: "watchLater" },
				});
			
		}}>
			<View>
				<Image
					source={{ uri: getLastVid.thumbnail }}
					style={{
						backgroundColor: "#000",
						width: 140,
						height: 100,
						borderRadius: 8,
						opacity: 0.5,
					}}
					contentFit="cover"
				/>
				<Image
					tintColor={"#fff"}
					source={data?.id === "watchLater" ? clock : like}
					style={{
						width: 25,
						height: 25,
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: [
							{ translateX: -12.5 }, // Adjust based on your component size
							{ translateY: -12.5 }, // Adjust based on your component size
						],
					}}
					contentFit="contain"
				/>
				<Image
					// tintColor={"#fff"}
					source={data?.id === "likedShorts" && shortLogo}
					style={{
						width: 20,
						height: 20,
						position: "absolute",
                        bottom:5,
                        right:5
                    
					}}
					contentFit="contain"
				/>
			</View>
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
					{data?.id === "likedShorts" && "Liked shorts"}
					{data?.id === "likedVideos" && "Liked videos"}
					{data?.id === "watchLater" && "watch later"}
				</Text>

				<TouchableOpacity style={{ position: "absolute", right: 0 }}>
					<Image
						source={options}
						style={{ width: 15, height: 15, position: "absolute", right: 0 }}
						contentFit="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export default memo(PlaylistView);
