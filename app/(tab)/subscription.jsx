import {
	View,
	Text,
	FlatList,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { bgColor, buttonColor } from "../../constants/colors";
import HeaderApp from "../../components/HeaderApp";
import HomeHeader from "../../components/HomeHeader";
import TrendingShorts from "../../components/TrendingShorts";
import VideoView from "../../components/VideoView";
import SubcriptionsHeader from "../../components/SubcriptionsHeader";
import { fetchData, fetchVideos } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";
import Offline from "../../components/Offline";
import { router, useFocusEffect } from "expo-router";
import Menu from "../../components/Menu";
import NothingToseeHere from "../../components/NothingToseeHere";
import { searchNotfound } from "../../constants/images";

const subcription = () => {
	const { user, isConnected } = getContext();
	const { setRefreshing, refereshing } = getContext();
	const [users, setUsers] = useState([]);
	const [subscriptions, setSubscriptions] = useState([]);
	const [error, setError] = useState([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [videos, setVideos] = useState([]);

	const [menuVisiblity, setMenuVisiblity] = useState(false);

	const [isMenuVisible, setIsMenuVisible] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setMenuVisiblity(true);
			return () => {
				// This will be called when the screen is unfocused
				// console.log("Screen is unfocused");
				setMenuVisiblity(false);
			};
		}, [])
	);
	const handleCloseMenu = () => {
		setIsMenuVisible(false);
	};
	const [videId, setVideId] = useState("");
	const handleToggleMenu = (id) => {
		setIsMenuVisible(!isMenuVisible);
		setVideId(id);
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await fetchData("usersref");
				// console.log(data);
				const tempdata = shuffleArray(data?.slice());
				setUsers([...tempdata]);
			} catch (err) {
				console.log(err);
			}
		};
		const fetchSubscriptions = async () => {
			try {
				const data = await fetchData(
					"subs/users/" + user?.uid + "/subscriptions"
				);
				// console.log(data);
				const tempdata = shuffleArray(data?.slice());
				setSubscriptions([...tempdata]);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUsers();
		fetchSubscriptions();
	}, [refereshing,user?.uid]);

	useEffect(() => {
		const fetchDataVids = async () => {
			try {
				const videoData = await fetchVideos();
				const tempdata = shuffleArray(videoData?.slice());
				// console.log(videoData)
				setVideos([...tempdata]);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDataVids();
	}, [refereshing, user?.uid]);

	// console.log(users)
	const subscr = users.filter((ch) => {
		return subscriptions.includes(ch.id);
	});
	// console.log(subscr)
	const subVideos = videos.filter((vid) => {
		return subscriptions.includes(vid.creator);
	});
	const insets = useSafeAreaInsets();
	// console.log(subVideos)
	if (isConnected)
		return (
			<View
				style={{
					backgroundColor: bgColor,
					height: "100%",
					paddingTop: insets.top,
				}}
			>
				<FlatList
					data={subVideos}
					showsHorizontalScrollIndicator={false}
					style={{ paddingHorizontal: 10 }}
					renderItem={({ item, index }) => {
						if (index === 0)
							return (
								<>
									<VideoView
										videoInfo={item}
										menu={() => {
											handleToggleMenu(item.id);
										}}
									/>
									<TrendingShorts
										type={"suggested"}
										data={"subs"}
										subs={subscriptions}
									/>
								</>
							);
						return (
							<VideoView
								videoInfo={item}
								menu={() => {
									handleToggleMenu(item.id);
								}}
							/>
						);
					}}
					ListHeaderComponent={<SubcriptionsHeader channel={subscr} />}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={() => {
								setIsRefreshing(true);
								setTimeout(() => {
									setRefreshing(!refereshing);
									setIsRefreshing(false);
								}, 1500);
							}}
							colors={Platform.OS === "android" && ["#fff"]}
							tintColor={Platform.OS === "ios" && "#fff"}
						/>
					}
					ListEmptyComponent={
						<NothingToseeHere
							text={"Subscribed channels will appear here"}
							image={searchNotfound}
							buttonText={"Find a channel"}
							handleButton={() => {
								router.push("search/SearchPage");
							}}
							type={true}
						/>
					}
					// contentInset={{bottom:150}}
				/>
				{menuVisiblity && (
					<Menu
						isVisible={isMenuVisible}
						onClose={handleCloseMenu}
						vidId={videId}
						userId={user.uid}
					/>
				)}
			</View>
		);
	else return <Offline />;
};

export default subcription;
