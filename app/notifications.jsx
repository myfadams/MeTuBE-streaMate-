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
import NothingToseeHere from "../components/NothingToseeHere";
import { noNotifications, notfoundlogo } from "../constants/images";
import { get, ref } from "firebase/database";
import { db } from "../libs/config";
import ChannelComponent from "../components/channel/ChannelComponent";
import FriendsRequestComponent from "../components/FriendsRequestComponent";

const notifications = () => {
	const { user } = getContext();
	// const [videos, setvideos] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [isLoading,setIsLoading]=useState(true)
	const [reload,setReload]=useState(false);
	async function fetchVideo(type, id) {
		const tRef = ref(db, `${type}/${id}`);
		const vidRes = await get(tRef);
		let t = vidRes.val();
		return { id: id, ...t };
	}
	async function fetchRequest( id) {
		const tRef = ref(db, `usersref/${id}`);
		const uRes = await get(tRef);
		let t = uRes.val();
		return { id: id, ...t,friendsRequest:true };
	}
	useEffect(() => {
		const notiRef = ref(db, `notifications/${user?.uid}/noti`);
		async function getPlayList() {
			try {
				const res = await get(notiRef);
				// console.log(nlist);
				if (res.exists()) {
					const nlist = res.val();
					// Use map to create an array of promises
					const fetchPromises = nlist?.map(async (Id) => {
						async function tempFunc() {
							if(typeof Id !== "object"){
								const t = await fetchVideo("shortsRef", Id);
								const items = Object.keys(t).length;
								if (items <= 1) {
									return fetchVideo("videosRef", Id);
								} else {
									return fetchVideo("shortsRef", Id);
								}
							}else{
								return fetchRequest(Id.id);
							}
						}

						return tempFunc();
					});

					// Wait for all promises to resolve
					const temp = await Promise.all(fetchPromises);
					temp.reverse();
					// console.log(temp);
					setNotifications([...temp]);
				}
			} catch (error) {
				console.error("Error fetching playlist or videos:", error);
			}
		}

		getPlayList();
		setIsLoading(false)
	}, [reload]);
	// console.log(videos);
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
					if (!item?.friendsRequest) {
						if (item?.caption)
							return (
								<OtherChannelVideo video={item} type={"short"} noti={"yes"} />
							);
						return <OtherChannelVideo video={item} noti={"yes"} />;
					}else{
						return <FriendsRequestComponent channel={item} setReload={setReload} reload={reload} />
					}
				}}
				keyExtractor={(item) => {
					return item.id;
				}}
				contentContainerStyle={{ paddingHorizontal: "2%", paddingTop:30 }}
				contentInset={{ bottom: insets.bottom }}
				ListEmptyComponent={
					// <NothingToseeHere type={false} image={noNotifications} />
					() => {
						if(!isLoading){
							return (
								<View
									style={{
										flex: 1, // Ensures the component takes up the full available space
										justifyContent: "center", // Centers content vertically
										alignItems: "center", // Centers content horizontally
										backgroundColor: bgColor, // Optional, to ensure the background matches
										paddingTop: 30,
									}}
								>
									<Image
										source={noNotifications}
										style={{ width: "80%", height: 350 }} // Adjust width as needed
										contentFit="contain"
										tintColor={buttonColor}
									/>
									<Text
										style={{
											marginTop: 30,
											fontFamily: "Montserrat_700Bold",
											fontSize: 20,
											color: "white",
											textAlign: "center",
											fontWeight: "600",
										}}
									>
										Nothing new
									</Text>
								</View>
							);
						}
					}
				}
			/>
		</View>
	);
};

export default notifications;
