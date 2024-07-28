import {
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
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
import { removeNotifications } from "../libs/notifications";
import { deleteFileAndMetadata } from "../libs/downloads";
import Toast from "react-native-root-toast";

const DownloadVideoView = ({ video, type, setRefresh,refre }) => {
	const [creator, setCreator] = useState([]);
	const [showDelete, setShowDelete] = useState(false);
	const { isConnected, user } = getContext();
	// console.log(video.imgURL)
	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(video?.creatorId);
				setCreator([...users]);
			} catch (err) {
				console.log(err);
			}
		};

		fetchCreator();
	}, []);

	const handleOptionsPress = () => {
		setShowDelete(!showDelete);
	};

	const handlePressOutside = () => {
		if (showDelete) {
			setShowDelete(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={handlePressOutside}>
			<View style={{ margin: 10 }}>
				<View
					style={{
						flexDirection: "row",
						gap: Dimensions.get("screen").width * 0.1 - 24,
					}}
				>
					<View style={{ width: "45%" }}>
						<Image
							source={{ uri: video.imgURL }}
							onError={(e) => {
								console.log(e);
							}}
							style={{
								backgroundColor: fieldColor,
								height: 115,
								borderTopLeftRadius: 15,
								borderBottomLeftRadius: 21,
								borderTopRightRadius: 21,
								borderBottomRightRadius: 4,
							}}
							contentFit={!video?.caption ? "cover" : "scale-down"}
						/>
						{video?.caption && (
							<Image
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
								flexShrink: 1,
								flexDirection: "row",
							}}
						>
							{video?.title}
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
									flexDirection: "row",
								}}
							>
								{creator[0]?.id === user?.uid ? "You" : creator[0]?.name}
							</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={handleOptionsPress}
						style={{ height: "100%" }}
					>
						<Image
							source={options}
							style={{ width: 15, height: 15 }}
							contentFit="contain"
						/>
					</TouchableOpacity>
				</View>
				{showDelete && (
					<TouchableOpacity
						onPress={() => {
							deleteFileAndMetadata(video?.vidURL, video?.imgURL, video.id)
								.then(() => {
									let toast = Toast.show("Video Deleted", {
										duration: Toast.durations.LONG,
									});
									setRefresh(!refre)
									// Hide toast after 3 seconds
									setTimeout(() => Toast.hide(toast), 3000);
								})
								.catch((err) => {
									console.log(err);
								});
						}}
						style={{
							position: "absolute",
							backgroundColor: fieldColor,
							right: 19,
							padding: 15,
							borderRadius: 9,
						}}
						activeOpacity={0.6}
					>
						<Text
							numberOfLines={2}
							style={{
								color: "white",
								fontSize: 15,
								fontFamily: "Montserrat_500Medium",
							}}
						>
							Delete video
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

export default memo(DownloadVideoView);
