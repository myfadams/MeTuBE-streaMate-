import {
	View,
	Text,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor } from "../../constants/colors";
import ShortsView from "../../components/ShortsView";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { back, search } from "../../constants/icons";

const windowHeight = Dimensions.get("window").height;

const TrendingShort = () => {
    const {trendingshort: toBePlayed} = useLocalSearchParams();
	const [viewableItems, setViewableItems] = useState([]);
	const [scollable, setScollable] = useState(false);
	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		setViewableItems(viewableItems.map((item) => item.key));
	});
	const [isFocused, setIsFocused] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);
			return () => {
				setIsFocused(false);
			};
		}, [])
	);

	return (
		<View
			style={{
				backgroundColor: bgColor,
				height: "100%",
				flex: 1,
				position: "relative",
			}}
		>
			<View
				style={{
					width: "90%",
					top: "8%",
					right: "5%",
					left:"5%",
					position: "absolute",
					zIndex: 1,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
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
				data={[1, 2, 3, 4, 5]}
				viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
				onViewableItemsChanged={onViewableItemsChanged.current}
				pagingEnabled
				scrollEnabled={!scollable}
				snapToAlignment="start"
				decelerationRate="fast"
				showsVerticalScrollIndicator={false}
				renderItem={({ item, index }) => {
					const shouldPlay = viewableItems.includes(item.toString());
					return (
						<View
							style={{
								height: windowHeight,
								borderTopWidth: 0.7,
								borderBottomWidth: 0.7,
							}}
						>
							{index === 0 ? (
								<ShortsView
									title={toBePlayed}
									sourceUrl={require("../../tempVid/small.mp4")}
									shouldPlay={shouldPlay}
									fix={(val) => {
										// console.log(val);
										setScollable(val);
									}}
									beFocused={isFocused}
								/>
							) : (
								<ShortsView
									sourceUrl={require("../../tempVid/small.mp4")}
									shouldPlay={shouldPlay}
									fix={(val) => {
										console.log(val);
										setScollable(val);
									}}
									beFocused={isFocused}
								/>
							)}
						</View>
					);
				}}
				keyExtractor={(item) => item.toString()}
			/>
		</View>
	);
};

export default TrendingShort;
