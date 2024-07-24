import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { memo, useEffect, useState } from "react";
import {
	commentOutline,
	dot,
	globe,
	likeOutline,
	options,
	shortLogo,
} from "../constants/icons";
import { borderLight, fieldColor, loadingColor } from "../constants/colors";
import {
	calculateTimePassed,
	formatSubs,
	formatViews,
	getUploadTime,
	getUploadTimestamp,
} from "../libs/videoUpdates";
import { router } from "expo-router";
import { getCreatorInfo } from "../libs/firebase";
import { getContext } from "../context/GlobalContext";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";

const OtherChannelVideo = ({ video, type }) => {
	// console.log(video)
	const [creator, setCreator] = useState([]);
	const [timePassed, setTimePassed] = useState();
	const [noComments, setNoComments] = useState(0);
	const { isConnected,user } = getContext();

	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(video?.creator);
				setCreator([...users]);
			} catch (err) {
				console.log(err);
			}
		};

		fetchCreator();
		// console.log(video.id);

		if (!video?.caption)
			getUploadTime(video.id, "video").then((res) => {
				// console.log(res)
				let time = calculateTimePassed(res);
				// console.log(time)
				setTimePassed(time);
			});
		else {
			getUploadTime(video.id, "shorts").then((res) => {
				// console.log(res)
				let time = calculateTimePassed(res);
				// console.log(time)
				setTimePassed(time);
			});
		}
		const videoCommentRef = ref(db, `commentsRef/${video.id}`);
		const unsubscribe = onValue(videoCommentRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val());
				setNoComments(data?.length);
			}
		});
		return () => unsubscribe();
	}, []);
    // console.log(creator[0])
	return (
		<TouchableOpacity
			onPress={() => {
				// console.log("me now :"+video.description);
				if (!video?.caption)
					router.push({
						pathname: "video/" + video?.id,
						params: {
							...video,
							...creator[0],
							timePassed: timePassed,
							videoDescription: video.description,
						},
					});
				else {
					router.push({
						pathname: "shorts/" + video.id,
						params: {
							...video,
							timePassed: timePassed,
						},
					});
				}
			}}
			activeOpacity={0.6}
			style={{ margin: 10 }}
		>
			<View
				style={{
					flexDirection: "row",
					gap: Dimensions.get("screen").width * 0.1 - 24,
				}}
			>
				<View style={{ width: "45%" }}>
					<Image
						source={{ uri: video?.thumbnail?.replace("videos/", "videos%2F") }}
						style={{
							backgroundColor: fieldColor,
							// width: 150,
							height: 115,
							// borderRadius: 8,
							borderTopLeftRadius: 15,
							borderBottomLeftRadius: 21,
							borderTopRightRadius: 21,
							borderBottomRightRadius: 4,
						}}
						contentFit={!video?.caption ? "cover" : "scale-down"}
					/>
					{video?.caption && (
						<Image
							// tintColor={"#fff"}
							source={shortLogo}
							style={{
								width: 20,
								height: 20,
								position: "absolute",
								bottom: 5,
								right: 5,
							}}
							contentFit="contain"
						/>
					)}
				</View>
				<View style={{ gap: type ? 9 : 14, width: "45%", marginTop: 12 }}>
					<Text
						numberOfLines={2}
						style={{
							color: "white",
							fontSize: 15,
							fontFamily: "Montserrat_500Medium",
							width: 0.44 * Dimensions.get("window").width,
							// flexWrap: "wrap",
							flexShrink: 1,
							flexDirection: "row",
						}}
					>
						{video?.title ?? video?.caption}
						{/* fkafnkjdsa jdsafnjd fda fdiufndajifn fasdjfndsa */}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Image
							source={{ uri: creator[0]?.image }}
							contentFit="cover"
							style={{
								height: 25,
								width: 25,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								backgroundColor: fieldColor,
								borderWidth: 0.5,
								borderColor: borderLight,
							}}
						/>
						<Text
							numberOfLines={1}
							style={{
								color: borderLight,
								fontSize: 13,
								fontFamily: "Montserrat_400Regular",
								width: "100%",
								flexWrap: "wrap",
								// flexShrink:1,
								flexDirection: "row",
							}}
						>
							{creator[0]?.id === user?.uid ? "You" : creator[0]?.name}
						</Text>
					</View>
					<Text
						numberOfLines={1}
						style={{
							color: borderLight,
							fontSize: 10,
							fontFamily: "Montserrat_400Regular",
							width: "100%",
							flexWrap: "wrap",
							// flexShrink:1,
							flexDirection: "row",
						}}
					>
						{formatViews(video?.views)}{" "}
						<View
							style={{
								justifyContent: "center",
								height: 9,
								alignItems: "center",
							}}
						>
							<Image
								source={dot}
								style={{ width: 3, height: 3 }}
								contentFit="contain"
							/>
						</View>{" "}
						{timePassed} ago
					</Text>
				</View>
				<TouchableOpacity style={{ height: "100%" }}>
					<Image
						source={options}
						style={{ width: 15, height: 15 }}
						contentFit="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export default memo(OtherChannelVideo);
