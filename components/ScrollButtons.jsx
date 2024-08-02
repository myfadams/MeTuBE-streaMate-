import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Platform,
	Linking,
} from "react-native";
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
import { buttonColor, fieldColor } from "../constants/colors";
import React, { useEffect, useState } from "react";
import {
	formatSubs,
	getLikes,
	likeUpadate,
	playList,
} from "../libs/videoUpdates";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";
import * as Haptics from "expo-haptics";
import { startDownload } from "../libs/downloads";
import { getContext } from "../context/GlobalContext";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { router } from "expo-router";
import { generateLinkVideos } from "../libs/share";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
	const [isDownloaded,setIsDownloaded]=useState(false)
	useEffect(() => {
		AsyncStorage.getItem("downloads").then((res) => {
			if (res) {
				const array = JSON.parse(res);
				// console.log("res",res)
				const containsObjectWithKey = array.some(
					(item) => item["id"] === videoId
				);
				setIsDownloaded(containsObjectWithKey);
			}
		});
	}, [progressDownload]);
	useEffect(() => {
		getLikes(videoId, setlikes, "videosRef");
		AsyncStorage.getItem("downloads").then((res)=>{
			if(res){
				const array= JSON.parse(res)
				// console.log("res",res)
				const containsObjectWithKey = array.some((item) => item["id"] === videoId);
				setIsDownloaded(containsObjectWithKey);
			}
		})
	}, [videoId]);
	console.log("isDownloaded",isDownloaded)
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
	const [progressDownload, setProgressDownload] = useState();
	console.log(progressDownload);
	const shareVideo = async () => {
		const textToCopy = generateLinkVideos(videoId, vidinfo?.title);

		// Copy text to clipboard
		await Clipboard.setStringAsync(textToCopy);

		// Optionally show an alert or message
		let toast = Toast.show("Copied link to copied", {
			duration: Toast.durations.LONG,
		});

		router.push("chatHomeScreen");
		setTimeout(function hideToast() {
			Toast.hide(toast);
		}, 3000);
	};
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
				onPress={shareVideo}
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
				disabled={isDownloaded}
				onPress={async () => {
					if (isConnected) {
						startDownload(vidinfo, setProgressDownload);
					}
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
					{/* {progressDownload?.download && !isDownloaded && `downloading`} */}
					{isDownloaded
						? "Downloaded"
						: "download"}
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

export default ScrollButtons;
