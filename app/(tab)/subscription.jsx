import {
	View,
	Text,
	FlatList,
	ScrollView,
	Image,
	TouchableOpacity,
	RefreshControl,
	Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, buttonColor } from "../../constants/colors";
import HeaderApp from "../../components/HeaderApp";
import HomeHeader from "../../components/HomeHeader";
import TrendingShorts from "../../components/TrendingShorts";
import VideoView from "../../components/VideoView";
import SubcriptionsHeader from "../../components/SubcriptionsHeader";
import { fetchData, fetchVideos } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";

const subcription = () => {
	const { user } = getContext();
	const { setRefreshing, refereshing } = getContext();
	const [users, setUsers] = useState([]);
	const [subscriptions, setSubscriptions] = useState([]);
	const [error, setError] = useState([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [videos, setVideos] = useState([]);
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
	}, [refereshing]);

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
	}, [refereshing]);

	// console.log(users)
	const subscr = users.filter((ch) => {
		return subscriptions.includes(ch.id);
	});
	// console.log(subscr)
	const subVideos = videos.filter((vid) => {
		return subscriptions.includes(vid.creator);
	});
	// console.log(subVideos)
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<FlatList
				data={subVideos}
				renderItem={({ item, index }) => {
					if (index === 0)
						return (
							<>
								<VideoView videoInfo={item} />
								<TrendingShorts
									type={"suggested"}
									data={"subs"}
									subs={subscriptions}
								/>
							</>
						);
					return <VideoView videoInfo={item} />;
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
			/>
		</SafeAreaView>
	);
};

export default subcription;
