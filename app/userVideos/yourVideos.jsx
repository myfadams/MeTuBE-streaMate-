import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	FlatList,
    RefreshControl,
    Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { bgColor, borderLight, fieldColor } from "../../constants/colors";
import { back, search } from "../../constants/icons";
import OtherViewButtons from "../../components/OtherViewButtons";
import YourVideoComponent from "../../components/YourVideoComponent";
import { fetchVideos } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";

const yourVideos = () => {
	const [isActive, setIsActive] = useState(0);
    const [videos, setVideos] = useState([]);
    const { setRefreshing, refereshing,user } = getContext();
    const [isRefreshing, setIsRefreshing] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const videoData = await fetchVideos();
			
				setVideos([...videoData]);
			} catch (err) {
				// setError(err);
                console.log(err)
			} 
		};

		fetchData();
	}, [refereshing]);
    
    const vids = videos.filter((v) => {
			return v.creator==user.uid;
		});
    // console.log(vids)

	function handleShorts() {
        setIsActive(3);
	}
	function handleVideos() {
        setIsActive(2);
	}
	function handleLive() {
        setIsActive(4);
	}
	function handleSort() {
        setIsActive(1);
	}

	const HeaderVid = () => {
		return (
			<View
				style={{
					gap: 30,
					justifyContent: "center",
					width: "100%",
					alignItems: "center",
                    marginBottom:14
				}}
			>
				<View style={{ width: "94%" }}>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_700Bold",
							fontSize: 35,
							height: 35,
						}}
					>
						{isHeaderVisible && "Your videos"}
					</Text>
				</View>
				<View style={{ width: "100%", alignItems: "center" }}>
					<View style={{ flexDirection: "row", width: "94%", gap: 10 }}>
						<OtherViewButtons
							title={"Sort by"}
							handlePress={handleSort}
							styles={{
								width: 70,
								height: 31,
								backgroundColor: isActive === 1 ? "white" : fieldColor,
								borderWidth: 0.3,
								borderColor: borderLight,
								//  subscribed ? fieldColor : buttonColor,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						/>
						<OtherViewButtons
							title={"Videos"}
							handlePress={handleVideos}
							styles={{
								width: 70,
								height: 31,
								backgroundColor: isActive === 2 ? "white" : fieldColor,
								borderWidth: 0.3,
								borderColor: borderLight,
								//  subscribed ? fieldColor : buttonColor,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						/>
						<OtherViewButtons
							title={"Shorts"}
							handlePress={handleShorts}
							styles={{
								width: 70,
								height: 31,
								backgroundColor: isActive === 3 ? "white" : fieldColor,
								borderWidth: 0.3,
								borderColor: borderLight,
								//  subscribed ? fieldColor : buttonColor,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						/>
						<OtherViewButtons
							title={"Live"}
							handlePress={handleLive}
							styles={{
								width: 70,
								height: 31,
								backgroundColor: isActive === 4 ? "white" : fieldColor,
								borderWidth: 0.3,
								borderColor: borderLight,
								//  subscribed ? fieldColor : buttonColor,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 8,
							}}
						/>
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
			<View
				style={{
					width: "90%",

					flexDirection: "row",
					justifyContent: "space-between",
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
							resizeMode="contain"
							style={{ width: 35, height: 35 }}
						/>
					</TouchableOpacity>
					{!isHeaderVisible && (
						<Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_600SemiBold",
								fontSize: 20,
							}}
						>
							Your videos
						</Text>
					)}
				</View>
				<TouchableOpacity
					style={{ margin: 10 }}
					activeOpacity={0.7}
					onPress={() => {
						router.push("search/SearchPage");
					}}
				>
					<Image
						source={search}
						resizeMode="contain"
						style={{ width: 24, height: 24 }}
					/>
				</TouchableOpacity>
			</View>

			<FlatList
				data={vids}
				viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
				onViewableItemsChanged={onViewableItemsChanged}
				renderItem={({ item, index }) => {
					return <YourVideoComponent video={item} />;
				}}
                keyExtractor={(item)=>{
                    return item.id
                }}
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
			/>
		</SafeAreaView>
	);
};

export default yourVideos;
