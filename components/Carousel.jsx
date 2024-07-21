import React, { useEffect, useState } from "react";
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { borderLight, loadingColor } from "../constants/colors";
import Videos from "./channel/Videos";
import { getContext } from "../context/GlobalContext";
import { fetchShorts, fetchVideos } from "../libs/firebase";
import ChannelHeader from "./channel/ChannelHeader";
import HorizontalHeaderScrollView from "./channel/HorizontalHeader";

const MyCarousel = ({ data, onScroll, scrollEnabled, onLayout, isVisible,act }) => {
	// console.log(data)
	const [videos, setVideos] = useState([]);
	const [shorts, setShorts] = useState([]);
	const [live, setLive] = useState([]);
	// console.log(isVisible)
	const { setRefreshing, refereshing, user } = getContext();
	const [isRefreshing, setIsRefreshing] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const videoData = await fetchVideos();
				const shortsData = await fetchShorts();
				setVideos([...videoData]);
				setShorts([...shortsData]);
			} catch (err) {
				// setError(err);
				console.log(err);
			}
		};

		fetchData();
	}, [refereshing]);

	const vids = videos.filter((v) => {
		return v.creator ==data?.uid;
	});
	const short = shorts.filter((s) => {
		return s.creator == data?.uid;
	});
	const [activePage, setActivePage] = useState(0);

	const pages = [
		{ title: "Home", color: "red" },
		{ title: "Videos", color: "green" },
		{ title: "Shorts", color: "blue" },
		{ title: "Playlists", color: "yellow" },
		{ title: "Community", color: "purple" },
	];

	const handleScroll = (event) => {
		const pageWidth = event.nativeEvent.layoutMeasurement.width;
		const currentPage = Math.floor(
			event.nativeEvent.contentOffset.x / pageWidth
		);
		setActivePage(currentPage);
		act(currentPage);
	};

	return (
		<View style={{ height: "100%" }}>
			<ChannelHeader userInfo={data} act={isVisible}/>
			<View style={{ height: 2 }} onLayout={onLayout}></View>
			{/* <View style={{}}>
				<ScrollView
					contentContainerStyle={styles.headerContainer}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{pages.map((page, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => {
								this.scrollView.scrollTo({
									x: index * Dimensions.get("window").width,
									animated: true,
								});
								setActivePage(index);
							}}
						>
							<Text
								style={[
									styles.headerText,
									activePage === index && styles.activeHeaderText,
								]}
							>
								{page.title}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View> */}
			{isVisible&&<HorizontalHeaderScrollView activePage={activePage} pages={pages} setActivePage={setActivePage}/>}
			<ScrollView
				ref={(ref) => (this.scrollView = ref)}
				horizontal
				pagingEnabled
				nestedScrollEnabled={true}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				
			>
				{pages.map((page, index) => {
					switch (index) {
						case 0:
							return (
								<View style={{}} key={index}>
									<Videos
										data={[...vids, ...short]}
										onScroll={onScroll}
										scrollEnabled={scrollEnabled}
										// style={styles.flatList}
									/>
								</View>
							);

						case 1:
							return (
								<View style={{}} key={index}>
									<Videos
										data={vids}
										onScroll={onScroll}
										scrollEnabled={scrollEnabled}
										// style={styles.flatList}
									/>
								</View>
							);

						case 2:
							return (
								<View style={{}} key={index}>
									<Videos
										data={short}
										onScroll={onScroll}
										scrollEnabled={scrollEnabled}
										// style={styles.flatList}
									/>
								</View>
							);

						case 3:
							return (
								<View style={{}} key={index}>
									<Videos
										data={[]}
										onScroll={onScroll}
										scrollEnabled={scrollEnabled}
										// style={styles.flatList}
									/>
								</View>
							);

						case 4:
							return (
								<View style={{}} key={index}>
									<Videos
										data={[]}
										onScroll={onScroll}
										scrollEnabled={scrollEnabled}
										// style={styles.flatList}
									/>
								</View>
							);
						default:
							break;
					}
				}
					
				)}
			</ScrollView>
			{/* <Text style={{ color: "white", fontSize: 18 }}>fkjfjadksf</Text> */}
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		// height:70,
		borderColor: borderLight,
		borderBottomWidth: 0.5,
		// backgroundColor: "#ccc",
	},
	headerText: {
		marginVertical: 10,
		fontSize: 16,
		fontFamily: "Montserrat_500Medium",
		padding: 10,
		color: loadingColor,
	},
	activeHeaderText: {
		color: "white",
		fontFamily: "Montserrat_600SemiBold",
	},
	page: {
		width: Dimensions.get("window").width,
		height: "100%",
		// justifyContent: "center",
		alignItems: "center",
	},
});

export default MyCarousel;
