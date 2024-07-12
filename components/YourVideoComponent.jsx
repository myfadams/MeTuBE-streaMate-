import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
	commentOutline,
	dot,
	globe,
	likeOutline,
	options,
	shortLogo,
} from "../constants/icons";
import { borderLight, loadingColor } from "../constants/colors";
import { formatSubs, formatViews } from "../libs/videoUpdates";
import { router } from "expo-router";
import { getCreatorInfo } from "../libs/firebase";

const YourVideoComponent = ({ video,type }) => {
	// console.log(video.views)
	const [creator, setCreator] = useState([]);

	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(video?.creator);
				setCreator([...users]);
			} catch (err) {
				console.log(err)
			}
		};

		fetchCreator();
	}, []);
	return (
		<TouchableOpacity
			onPress={() => {
				if (!video?.caption)
					router.push({
						pathname: "video/" + video?.id,
						params: { ...video, ...creator[0] },
					});
				else {
					router.push({ pathname: "shorts/" + video.id, params: video });
				}
			}}
			activeOpacity={0.6}
			style={{ margin: 10 }}
		>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 17 }}>
				<View>
					<Image
						source={{ uri: video?.thumbnail.replace("videos/", "videos%2F") }}
						style={{
							backgroundColor: "#1A1818",
							width: 150,
							height: 85,
							borderRadius: 8,
						}}
						resizeMode="cover"
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
							resizeMode="contain"
						/>
					)}
				</View>
				<View style={{ gap:type?9: 4 }}>
					<Text
						numberOfLines={2}
						style={{
							color: "white",
							fontSize: 13,
							fontFamily: "Montserrat_500Medium",
							width: type?"90%":"45%",
							flexWrap: "wrap",
							flexDirection: "row",
						}}
					>
						{video?.title ?? video?.caption}
					</Text>
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
								resizeMode="contain"
							/>
						</View>{" "}
						3 months ago
					</Text>
					<View style={{ flexDirection: "row", gap: 15 }}>
						<Image
							source={globe}
							style={{ width: 20, height: 20 }}
							resizeMode="contain"
						/>
						<View
							style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
						>
							<Image
								source={likeOutline}
								style={{ width: 20, height: 20 }}
								resizeMode="contain"
							/>
							<Text
								numberOfLines={1}
								style={{
									color: borderLight,
									fontSize: 11,
									fontFamily: "Montserrat_400Regular",
									flexDirection: "row",
								}}
							>
								{formatSubs(video?.likes?.length)}
							</Text>
						</View>
						<View
							style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
						>
							<Image
								source={commentOutline}
								style={{ width: 20, height: 20 }}
								resizeMode="contain"
							/>
							<Text
								numberOfLines={1}
								style={{
									color: borderLight,
									fontSize: 11,
									fontFamily: "Montserrat_400Regular",
									flexDirection: "row",
								}}
							>
								0
							</Text>
						</View>
					</View>
				</View>
				<TouchableOpacity style={{ position: "absolute", right: 1, top: 1 }}>
					<Image
						source={options}
						style={{ width: 15, height: 15 }}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export default YourVideoComponent;
