import {
	View,
	Text,
	// SafeAreaView,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	Platform,
	Dimensions,
	TextInput,
	TouchableHighlight,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { bgColor, borderLight, fieldColor } from "../../constants/colors";
import {
	back,
	chromecast,
	options,
	search,
	searchIcon,
	shortLogo,
} from "../../constants/icons";
import OtherViewButtons from "../../components/OtherViewButtons";
import YourVideoComponent from "../../components/YourVideoComponent";
import { fetchData, fetchShorts, fetchVideos } from "../../libs/firebase";
import { formatDate, groupData, renameKey, shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";
import { router } from "expo-router";
import NotFound from "../../components/NotFound";
import TrendingShorts from "../../components/TrendingShorts";
import ShortComponent from "../../components/ShortComponent";
import { onValue, ref } from "firebase/database";
import { db } from "../../libs/config";
import { combineAndGroupByDate } from "../../libs/otherFunctions";
import { SafeAreaView } from "react-native-safe-area-context";
import OtherChannelVideo from "../../components/OtherChannelVideo";

const historyVideos = () => {
	const [isEnabled, setIsEnabled] = useState();
	const { setRefreshing, refereshing, user } = getContext();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const [isTrackedViewVisible, setIsTrackedViewVisible] = useState(true);
	const trackedViewRef = useRef(null);
	const screenDimensions = Dimensions.get("window");
	const handleScroll = () => {
		// Calculate if tracked view is visible based on its position
		if (trackedViewRef.current) {
			trackedViewRef.current.measure((x, y, width, height, pageX, pageY) => {
				const isViewVisible =
					pageY >= 0 && pageY <= screenDimensions.height - height;
				setIsTrackedViewVisible(isViewVisible);
			});
		}
	};
	const [history, setHistory] = useState([]);
	const { addedToplaylist, setAddedToplaylist } = getContext();
	const [historyShorts, setHistoryShorts] = useState([]);
	useEffect(() => {
		const videoRef = ref(db, `history/videos/${user?.uid}`);

		const unsubscribe = onValue(videoRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val())

				setHistory([...data]);
			}
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [user?.uid, refereshing]);
	useEffect(() => {
		const shortsRef = ref(db, `history/shorts/${user?.uid}`);

		const unsubscribe = onValue(shortsRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val())

				setHistoryShorts([...data]);
			}
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [user?.uid, refereshing]);

	const historyVideos = [];
	history.forEach((vid) => {
		renameKey(vid, "videoview", "id");
		// console.log(vid)
		historyVideos.push(vid);
	});

	historyShorts.sort((a, b) => Date(b.date) - Date(a.date));
	historyVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
	// console.log(historyVideos)
	const v = groupData(historyVideos);
	const groupedHistoryVideos = Object.values(v);
	const s = groupData(historyShorts);
	const groupedHistoryShorts = Object.values(s);
	const combinedArrayHistory = combineAndGroupByDate(groupedHistoryShorts, groupedHistoryVideos);
	// console.log(combinedArray[0]);

	const HeaderVid = () => {
		return (
			<View>
				<View
					style={{
						gap: 30,
						justifyContent: "center",
						width: "100%",
						alignItems: "center",
						marginBottom: 14,
					}}
				>
					<View style={{ width: "94%", height: 40 }} ref={trackedViewRef}>
						<Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_700Bold",
								fontSize: 35,
								// height: 35,
							}}
						>
							{/* {isHeaderVisible && "Your videos"} */}
							{isTrackedViewVisible && "History"}
						</Text>
					</View>

					<View
						style={{
							width: "100%",
							alignItems: "center",
							marginVertical: 15,
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								height: 60,
								backgroundColor: fieldColor,
								alignItems: "center",
							}}
						>
							<Image
								source={searchIcon}
								style={{ width: 25, height: 25, marginLeft: 10 }}
								tintColor={"#fff"}
							/>
							<TextInput
								placeholder="Search watch history"
								placeholderTextColor={borderLight}
								returnKeyType="search"
								onSubmitEditing={() => {
									console.log("submitted");
								}}
								style={{
									height: "90%",
									flex: 1,
									fontFamily: "Montserrat_500Medium",
									fontSize: 17,
									color: "#fff",
									paddingHorizontal: 5,
								}}
								onBlur={() => {
									setIsEnabled(false);
								}}
								autoFocus={isEnabled}
								showSoftInputOnFocus={isEnabled}
								onFocus={() => {
									console.log("focused");
									setIsEnabled(true);
								}}
							/>
							{isEnabled && (
								<TouchableOpacity
									style={{
										width: 70,
										opacity: !isEnabled ? 0 : 1,
										height: "90%",
										justifyContent: "center",
										alignItems: "center",
										marginHorizontal: 10,
									}}
									disabled={!isEnabled}
									onPress={() => {
										setIsEnabled(false);
									}}
								>
									<Text
										style={{
											color: "white",
											fontFamily: "Montserrat_400Regular",
										}}
									>
										Cancel
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>
				
			</View>
		);
	};
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
		const headerVisible = viewableItems.some((item) => item.index === 0); // Check if header is viewable
		setIsHeaderVisible(headerVisible);
	}).current;
	// console.log("header: " + isHeaderVisible);
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<View style={{ alignItems: "center", width: "100%" }}>
				<View
					style={{
						width: "97%",

						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity
							style={{ margin: 10 }}
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
						{!isTrackedViewVisible && (
							<Text
								style={{
									color: "#fff",
									fontFamily: "Montserrat_600SemiBold",
									fontSize: 20,
								}}
							>
								History
							</Text>
						)}
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 30,
						}}
					>
						<TouchableOpacity>
							<Image
								source={chromecast}
								style={{ width: 21, height: 21 }}
								contentFit="contain"
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								router.push("/search/SearchPage");
							}}
						>
							<Image
								source={search}
								style={{ width: 21, height: 21 }}
								contentFit="contain"
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
			</View>

			<FlatList
				data={combinedArrayHistory}
				viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
				onViewableItemsChanged={onViewableItemsChanged}
				renderItem={({ item, index }) => {
					const date = item[0][0]?.date ?? item[1][0]?.date;
					// console.log(date);

					return (
						<View style={{ marginBottom: 20 }}>
							<View style={{ width: "94%" }}>
								<Text
									style={{
										color: "#fff",
										fontFamily: "Montserrat_500Medium",
										fontSize: 20,
										// height: 35,
									}}
								>
									{formatDate(date)}
								</Text>
							</View>
							{item[0].length > 0 && (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										gap: 10,
										marginTop: 20,
										marginBottom: 10,
									}}
								>
									<Image
										source={shortLogo}
										style={{ width: 30, height: 30 }}
										contentFit="contain"
									/>
									<Text
										style={{
											color: "#fff",
											fontFamily: "Montserrat_700Bold",
											fontSize: 20,
											marginLeft: 2,
										}}
									>
										Shorts
									</Text>
								</View>
							)}
							<FlatList
								horizontal
								data={item[0]}
								keyExtractor={(item) => item.id}
								showsHorizontalScrollIndicator={false}
								decelerationRate={"fast"}
								renderItem={({ item, index }) => {
									return (
										<ShortComponent
											title={item?.caption}
											marginVid={8}
											short={item}
											type={"history"}
										/>
									);
								}}
							/>
							{item[1].map((video, id) => {
								return <OtherChannelVideo video={video} key={id} />;
							})}
						</View>
					);
				}}
				keyExtractor={(item, index) => {
					return index;
				}}
				ListEmptyComponent={<NotFound type={"yourVideos"} />}
				ListHeaderComponent={<HeaderVid />}
				refreshControl={
					<RefreshControl
						colors={Platform.OS === "android" && ["#fff"]}
						tintColor={Platform.OS === "ios" && "#fff"}
						refreshing={isRefreshing}
						onRefresh={() => {
							setIsRefreshing(true);
							setTimeout(() => {
								setRefreshing(!refereshing);
								setIsRefreshing(false);
							}, 1500);
						}}
					/>
				}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			/>
		</SafeAreaView>
	);
};

export default historyVideos;
