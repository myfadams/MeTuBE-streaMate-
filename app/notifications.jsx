import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getContext } from "../context/GlobalContext";
import { back, options, search } from "../constants/icons";
import OtherChannelVideo from "../components/OtherChannelVideo";
import { bgColor, buttonColor } from "../constants/colors";
import { Image } from "expo-image";
import { FlatList } from "react-native";

const notifications = () => {
	const { user } = getContext();
	const [videos, setvideos] = useState([]);
	// async function fetchVideo(type, id) {
	// 	const tRef = ref(db, `${type}/${id}`);
	// 	const vidRes = await get(tRef);
	// 	let t = vidRes.val();
	// 	return { id: id, ...t };
	// }
	// useEffect(() => {
	// 	const playlistRef = ref(db, `playlist/${user?.uid}/${type}`);
	// 	async function getPlayList() {
	// 		try {
	// 			const res = await get(playlistRef);
	// 			const plist = res.val();

	// 			// Use map to create an array of promises
	// 			const fetchPromises = plist?.map(async (vidId) => {
	// 				if (type === "likedShorts") {
	// 					return fetchVideo("shortsRef", vidId);
	// 				} else if (type === "likedVideos") {
	// 					return fetchVideo("videosRef", vidId);
	// 				} else {
	// 					async function tempFunc() {
	// 						const t = await fetchVideo("shortsRef", vidId);
	// 						const items = Object.keys(t).length;
	// 						if (items <= 1) {
	// 							return fetchVideo("videosRef", vidId);
	// 						} else {
	// 							return fetchVideo("shortsRef", vidId);
	// 						}
	// 					}

						return tempFunc();
					});

	// 			// Wait for all promises to resolve
	// 			const temp = await Promise.all(fetchPromises);
	// 			temp.reverse();
	// 			// console.log(temp);
	// 			setvideos([...temp]);
	// 		} catch (error) {
	// 			console.error("Error fetching playlist or videos:", error);
	// 		}
	// 	}

	// 	getPlayList();
	// }, []);
	// console.log(videos)
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				height: "100%",
				backgroundColor: bgColor,
				width: "100%",
				paddingTop: insets.top,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					paddingBottom: 6,
					justifyContent: "space-between",
					alignItems: "center",

					width: "100%",
					paddingVertical: 14,
					paddingHorizontal: "3%",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						style={{}}
						activeOpacity={0.7}
						onPress={() => {
							router.push("../");
						}}
					>
						<Image
							source={back}
							contentFit="contain"
							style={{ width: 30, height: 30 }}
						/>
					</TouchableOpacity>
				</View>
				<Text
					style={{
						color: "#fff",
						fontFamily: "Montserrat_600SemiBold",
						fontSize: 20,
					}}
				>
					Notifications
				</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 30,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							router.push("/search/SearchPage");
						}}
					>
						<Image
							source={search}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={options}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
						/>
					</TouchableOpacity>
				</View>
			</View>
			<FlatList
				data={notifications}
				renderItem={({ item, index }) => {
					if (item?.caption)
						return <OtherChannelVideo video={item} type={"short"} />;
					return <OtherChannelVideo video={item} />;
				}}
				keyExtractor={(item) => {
					return item.id;
				}}
				contentContainerStyle={{ paddingHorizontal: "2%", paddingTop:30 }}
				contentInset={{ bottom: insets.bottom }}
				
			/>
		</View>
	);
};

export default notifications;
