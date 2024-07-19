import {
	View,
	Text,
	// SafeAreaView,
	TouchableOpacity,
	Image,
	FlatList,
    RefreshControl,
    Platform,
	Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { bgColor, borderLight, fieldColor } from "../../constants/colors";
import { back, chromecast, options, search } from "../../constants/icons";
import OtherViewButtons from "../../components/OtherViewButtons";
import YourVideoComponent from "../../components/YourVideoComponent";
import { fetchShorts, fetchVideos } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";
import { router } from "expo-router";
import NotFound from "../../components/NotFound";
import { SafeAreaView } from "react-native-safe-area-context";

const yourVideos = () => {
	const [isActive, setIsActive] = useState(0);
	
    const [videos, setVideos] = useState([]);
	const [shorts, setShorts] = useState([]);
	const [live, setLive] = useState([]);
	
	const [specialItemLayout, setSpecialItemLayout] = useState(null);
    const { setRefreshing, refereshing,user } = getContext();
    const [isRefreshing, setIsRefreshing] = useState(false);

	const [isTrackedViewVisible, setIsTrackedViewVisible] = useState(true);
	const trackedViewRef = useRef(null);
	const screenDimensions = Dimensions.get("window");
	const handleScroll = () => {
    // Calculate if tracked view is visible based on its position
    if (trackedViewRef.current) {
      trackedViewRef.current.measure((x, y, width, height, pageX, pageY) => {
        const isViewVisible = pageY >= 0 && pageY <= screenDimensions.height - height;
        setIsTrackedViewVisible(isViewVisible);
      });
    }
  };
//   console.log("isVisible header: "+isTrackedViewVisible)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const videoData = await fetchVideos();
				const shortsData = await fetchShorts()
				setVideos([...videoData]);
				setShorts([...shortsData]);
			} catch (err) {
				// setError(err);
                console.log(err)
			} 
		};

		fetchData();
	}, [refereshing]);
    
    const vids = videos.filter((v) => {
			return v.creator==user?.uid;
		});
	const short = shorts.filter((s) => {
		return s.creator == user?.uid;
	});
   
	let data = [...vids, ...short];
	
	// shuffleArray([...vids,...short])
	const [dataTodisplay, setDataTodisplay] = useState();
	function handleShorts() {
        setIsActive(3);
		setDataTodisplay([...short]);
		
	}
	function handleVideos() {
		setIsActive(2);
        setDataTodisplay([...vids])
		
	}
	function handleLive() {
        setIsActive(4);
		 setDataTodisplay(live);
		 
	}
	function handleSort() {
        // setIsActive(1);
	}
	
	
	const HeaderVid = () => {
		return (
			<View
				style={{
					gap: 30,
					justifyContent: "center",
					width: "100%",
					alignItems: "center",
					marginBottom: 14,
				}}
			>
				<View style={{ width: "94%" }} ref={trackedViewRef}>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_700Bold",
							fontSize: 35,
							height: 35,
						}}
					>
						{/* {isHeaderVisible && "Your videos"} */}
						{isTrackedViewVisible && "Your videos"}
					</Text>
					{/* <View style={{ height: 2 }} ></View> */}
				</View>
				{/* //chab dasjd */}
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
							isActive={isActive}
							handlePress={handleVideos}
							id={2}
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
							isActive={isActive}
							id={3}
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
							isActive={isActive}
							id={4}
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
			<View style={{ alignItems: "center" ,width:"100%"}}>
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
								resizeMode="contain"
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
								Your videos
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
								resizeMode="contain"
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
								resizeMode="contain"
							/>
						</TouchableOpacity>
						<TouchableOpacity>
							<Image
								source={options}
								style={{ width: 21, height: 21 }}
								resizeMode="contain"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			<FlatList
				data={data&&!dataTodisplay?data:dataTodisplay}
				
				viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
				onViewableItemsChanged={onViewableItemsChanged}
				renderItem={({ item, index }) => {
					return <YourVideoComponent video={item} />;
				}}
				keyExtractor={(item) => {
					return item.id;
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
			/>
			
		</SafeAreaView>
	);
};

export default yourVideos;
