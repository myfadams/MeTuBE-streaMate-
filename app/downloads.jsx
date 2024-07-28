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
import { downloadsHere } from "../constants/images";
import DownloadVideoView from "../components/DownloadVideoView";
import { fetchDownloadedFiles } from "../libs/downloads";


const downloads = () => {
	const { user } = getContext();
	const [videos, setvideos] = useState([]);
	const insets = useSafeAreaInsets();
	const [refreshDownloads, setRefreshDownloads] = useState(false);
	useEffect(()=>{
		fetchDownloadedFiles().then((res)=>{
			// console.log(res)
			setvideos(res)
		})
	},[refreshDownloads])
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
					Downloads
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
				data={videos}
				renderItem={({ item, index }) => {
					return (
						<DownloadVideoView
							video={item}
							key={index}
							setRefresh={setRefreshDownloads}
							refre={refreshDownloads}
						/>
					);
				}}
				// keyExtractor={(item) => {
				// 	return item.id;
				// }}
				contentContainerStyle={{ paddingHorizontal: "2%", paddingTop: 30 }}
				contentInset={{ bottom: insets.bottom }}
				ListEmptyComponent={
					// <NothingToseeHere type={false} image={noNotifications} />
					() => {
						
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
										source={downloadsHere}
										style={{ width: "80%", height: 350 }} // Adjust width as needed
										contentFit="contain"
										tintColor={buttonColor}
									/>
									<Text
										style={{
											// marginTop: 30,
											fontFamily: "Montserrat_700Bold",
											fontSize: 20,
											color: "white",
											textAlign: "center",
											fontWeight: "600",
										}}
									>
										Downloads will appear here
									</Text>
								</View>
							);
						}
					}
				
			/>
		</View>
	);
};

export default downloads;
