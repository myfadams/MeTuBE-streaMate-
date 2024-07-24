import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { Image, ImageBackground } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { back, options, play, search, shuffle } from "../constants/icons";
import { router } from "expo-router";
import { getCreatorInfo } from "../libs/firebase";
import { calculateTimePassed, getUploadTime } from "../libs/videoUpdates";
import MoreButton from "./MoreButton";
import { borderPrimary, buttonColor, fieldColor } from "../constants/colors";
import { getContext } from "../context/GlobalContext";

const PlayListHeader = ({ firstVideo, title, noVideos, onLayout }) => {
	const { user } = getContext();
	const insets = useSafeAreaInsets();
	const [creator, setCreator] = useState(null); // Changed from array to null
	const [timePassed, setTimePassed] = useState(null); // Initialize as null
	let c;
	if (title === "likedShorts") [(c = "Liked Shorts")];
	else if (title === "likedVideos") {
		c = "Liked Vidoes";
	} else if (title === "watchLater") {
		c = "Watch Later";
	}
	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const user = await getCreatorInfo(firstVideo?.creator);
				setCreator(user); // Assuming `user` is a single object
			} catch (err) {
				console.log(err);
			}
		};

		const fetchTimePassed = async () => {
			try {
				let res;
				if (!firstVideo?.caption) {
					res = await getUploadTime(firstVideo?.id, "video");
				} else {
					res = await getUploadTime(firstVideo?.id, "shorts");
				}
				const time = calculateTimePassed(res);
				setTimePassed(time);
			} catch (err) {
				console.log(err);
			}
		};

		if (firstVideo) {
			fetchCreator();
			fetchTimePassed();
		}
	}, [firstVideo]); // Adding `firstVideo` as a dependency to re-run effect if `firstVideo` changes

	return (
		<View>
			<ImageBackground
				imageStyle={{ opacity: 0.05 }}
				source={{ uri: firstVideo?.thumbnail }}
				blurRadius={15}
				style={{ width: "100%" }}
				contentFit="cover"
			>
				<BlurView
					intensity={5} // Adjust the intensity here
					style={{
						...StyleSheet.absoluteFillObject, // Cover the entire ImageBackground
						justifyContent: "center",
						alignItems: "center",
					}}
				/>

				<View
					style={{
						marginTop: insets.top * 2+6,
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<TouchableOpacity
                        onLayout={onLayout}
						style={{
							width: !firstVideo?.caption ? "87%" : "35%",
							height: 200,
							borderRadius: 20,
							overflow: "hidden",
						}}
						activeOpacity={0.6}
						onPress={() => {
							if (creator && timePassed) {
								if (!firstVideo?.caption) {
									router.push({
										pathname: "video/" + firstVideo?.id,
										params: {
											...firstVideo,
											...creator[0],
											timePassed: timePassed,
											videoDescription: firstVideo.description,
										},
									});
								} else {
									router.push({
										pathname: "shorts/" + firstVideo.id,
										params: {
											...firstVideo,
											timePassed: timePassed,
										},
									});
								}
							}
						}}
					>
						<Image
							source={{ uri: firstVideo?.thumbnail }}
							style={{ width: "100%", height: "100%", opacity: 0.8 }}
							contentFit="cover"
						/>
					</TouchableOpacity>
				</View>
				<View style={{ marginHorizontal: "4%", marginVertical: 20 }}>
					<View style={{ gap: 7 }}>
						<Text
							numberOfLines={2}
							style={{
								color: "white",
								fontSize: 20,
								fontFamily: "Montserrat_600SemiBold",
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							{c ?? title}
						</Text>
						<Text
							numberOfLines={2}
							style={{
								color: "white",
								fontSize: 14,
								fontFamily: "Montserrat_500Medium",
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							{user?.displayName}
						</Text>

						<Text
							numberOfLines={2}
							style={{
								color: "white",
								fontSize: 14,
								fontFamily: "Montserrat_400Regular",
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							{noVideos} {noVideos === 1 ? "Video" : "Videos"}
						</Text>
					</View>
				</View>
				<View
					style={{
						width: "100%",
						paddingHorizontal: "3%",
						flexDirection: "row",
						marginVertical: 8,
					}}
				>
					<View style={{ flex: 1 }}>
						<MoreButton
							title={"Play all"}
							height={42}
							color={buttonColor}
							imageUrl={play}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<MoreButton
							title={"Shuffle"}
							height={42}
							color={borderPrimary}
							imageUrl={shuffle}
						/>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

export default PlayListHeader;
