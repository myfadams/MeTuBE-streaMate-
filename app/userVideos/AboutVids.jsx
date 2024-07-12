import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import {
	bgColor,
	borderLight,
	buttonColor,
	fieldColor,
	ldingColor,
	videoColor,
} from "../../constants/colors";
import MoreButton from "../../components/MoreButton";
import MyCarousel from "../../components/Carousel";
import ChannelHeader from "../../components/channel/ChannelHeader";
import { ScrollView } from "react-native";
import HorizontalHeaderScrollView from "../../components/channel/HorizontalHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OptionsHeader from "../../components/channel/OptionsHeader";

const { height: windowHeight } = Dimensions.get("window");

const isItemVisible = (itemLayout, scrollY) => {
	if (!itemLayout) return false;
	return (
		itemLayout.y >= scrollY &&
		itemLayout.y <= scrollY + windowHeight - itemLayout.height
	);
};

export default function MyPager() {
	const userInfo = useLocalSearchParams();
	// console.log(userInfo.uid)
	const scrollViewRef = useRef(null);
	const [flatListAtEnd, setFlatListAtEnd] = useState(false);
	const [flatListAtStart, setFlatListAtStart] = useState(true);

	const [specialItemLayout, setSpecialItemLayout] = useState(null);
	const [scrollY, setScrollY] = useState(0);

	const handleSpecialItemLayout = (event) => {
		setSpecialItemLayout(event.nativeEvent.layout);
	};

	const handleScroll = (event) => {
		setScrollY(event.nativeEvent.contentOffset.y);
	};
	// console.log()
	const handleFlatListScroll = (event) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const contentHeight = event.nativeEvent.contentSize.height;
		const layoutHeight = event.nativeEvent.layoutMeasurement.height;

		if (offsetY + layoutHeight >= contentHeight) {
			setFlatListAtEnd(true);
		} else {
			setFlatListAtEnd(false);
		}

		if (offsetY <= 0) {
			setFlatListAtStart(true);
		} else {
			setFlatListAtStart(false);
		}
	};
	const pages = [
		{ title: "Home", color: "red" },
		{ title: "Videos", color: "green" },
		{ title: "Shorts", color: "blue" },
		{ title: "Playlists", color: "yellow" },
		{ title: "Community", color: "purple" },
	];
	const [activePage, setActivePage] = useState(0);
	function handleActivePage(curr){
		setActivePage(curr)
	}
	 const insets = useSafeAreaInsets();
	// console.log();
	return (
		<SafeAreaView style={{ backgroundColor: bgColor }}>
			{!isItemVisible(specialItemLayout, scrollY) && (
				<View style={{ position: "absolute", top: insets.top, zIndex: 1 }}>
					<OptionsHeader userInfo={userInfo} />
					<HorizontalHeaderScrollView
						activePage={activePage}
						pages={pages}
						setActivePage={setActivePage}
					/>
				</View>
			)}
			<ScrollView
				ref={scrollViewRef}
				scrollEnabled={flatListAtStart}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				<MyCarousel
					data={userInfo}
					onScroll={handleFlatListScroll}
					scrollEnabled={!flatListAtEnd}
					onLayout={handleSpecialItemLayout}
					isVisible={isItemVisible(specialItemLayout, scrollY)}
					act={handleActivePage}
				
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-around",
		// paddingVertical: 10,
		// alignItems:"baseline",
		// backgroundColor: "#fff",
	},
	headerText: {
		fontSize: 16,
		marginVertical: 20,
		fontWeight: "bold",
		color: borderLight,
	},
	activeHeaderText: {
		color: "#fff",
	},
	indicatorContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		// paddingBottom: 10,
		backgroundColor: ldingColor,
	},
	indicator: {
		height: 1.4,
		width: "20%",
		backgroundColor: "transparent",
	},
	activeIndicator: {
		backgroundColor: "#fff",
	},
	pagerView: {
		flex: 1,
		width: "100%",
		// height:500
	},
	page: {
		justifyContent: "center",
		alignItems: "center",
	},
});
