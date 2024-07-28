import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native"
import { Image } from "expo-image";
import {
	clip,
	dislikOutline,
	dislike,
	download,
	flag,
	foward,
	like,
	likeOutline,
	save,
	shorts,
} from "../constants/icons";
import { buttonColor, fieldColor} from "../constants/colors";
import React, { useEffect, useState } from 'react'
import { formatSubs, getLikes, likeUpadate, playList } from "../libs/videoUpdates";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";
import * as Haptics from "expo-haptics";
import {startDownload} from "../libs/downloads"
import { getContext } from "../context/GlobalContext";
const ScrollButtons = ({
	videoId,
	userId,
	likeStatus,
	disLikeStatus,
	vidinfo,
}) => {
	// console.log(likeStatus)
	const { user, isConnected } = getContext();
	const [likeClicked, setLikeClicked] = useState(false);
	const [dislikeClicked, setDislikeClicked] = useState(false);
	const [likes, setlikes] = useState(0);
	useEffect(() => {
		getLikes(videoId, setlikes, "videosRef");
	}, [videoId]);

	useEffect(() => {
		setLikeClicked(likeStatus);
		setDislikeClicked(disLikeStatus);
	}, [likeStatus, disLikeStatus]);
	function addLike() {
		if (!likeClicked) {
			setLikeClicked(true);
			setDislikeClicked(false);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		} else setLikeClicked(false);
		likeUpadate(videoId, "like", "videosRef", userId);
		getLikes(videoId, setlikes, "videosRef");
		playList(videoId, "likedVideos", userId);
	}

	function addDislike() {
		if (!dislikeClicked) {
			// console.log("dislike");
			setLikeClicked(false);
			setDislikeClicked(true);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		} else setDislikeClicked(false);
		// console.log("kjfkdsaf: "+dislikeClicked)
		likeUpadate(videoId, "dislike", "videosRef", userId);
		getLikes(videoId, setlikes, "videosRef");
	}
	const [progressDownload,setProgressDownload]=useState()
	console.log(progressDownload)
	return (
		<ScrollView
			horizontal
			decelerationRate={"fast"}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				gap: 5,
				margin: 6,
				justifyContent: "space-between",
			}}
		>
			<View
				style={{
					// gap: 5,
					height: 35,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					alignItems: "center",

					flexDirection: "row",
				}}
			>
				<TouchableOpacity
					onPress={addLike}
					style={{
						flexDirection: "row",
						alignItems: "center",
						margin: 14,
						height: "70%",
					}}
				>
					<Image
						source={likeClicked ? like : likeOutline}
						tintColor={likeClicked ? buttonColor : "#fff"}
						style={{ width: 22, height: 22 }}
						contentFit="contain"
					/>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						{" "}
						{formatSubs(likes)}
					</Text>
				</TouchableOpacity>
				<Text style={{ color: "#fff", fontSize: 18 }}>|</Text>
				<TouchableOpacity
					onPress={addDislike}
					style={{
						flexDirection: "row",
						alignItems: "center",
						margin: 14,
						height: "70%",
					}}
				>
					<Image
						source={dislikeClicked ? dislike : dislikOutline}
						tintColor={dislikeClicked ? buttonColor : "#fff"}
						style={{ width: 22, height: 22 }}
						contentFit="contain"
					/>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={foward}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					share
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={shorts}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
					tintColor={"#fff"}
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					remix
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={()=>{
					if(isConnected)
						startDownload(vidinfo,setProgressDownload)
				}}
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={download}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					download
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={clip}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					clip
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={save}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					save
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					height: 35,
					gap: 3,
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={flag}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					contentFit="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					report
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default ScrollButtons