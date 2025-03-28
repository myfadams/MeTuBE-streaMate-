import {
	View,
	Text,
	FlatList,
	Dimensions,
	TouchableOpacity,
	
} from "react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor } from "../../constants/colors";
import ShortsView from "../../components/ShortsView";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { back, search } from "../../constants/icons";
import { fetchShorts, getEncodedFirebaseUrl } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";

const windowHeight = Dimensions.get("window").height;
const screenHeight = Dimensions.get("screen").height
const TrendingShort = () => {
	// const { trendingshort: toBePlayed } = useLocalSearchParams();
	const shortItem = useLocalSearchParams();
	console.log(shortItem)
	const [shorts, setShorts] = useState([]);
	const [error, setError] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const shortsData = await fetchShorts();
				// console.log(shortsData);
				const tempdata = shuffleArray (shortsData?.slice());
				setShorts([...tempdata]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);

	const [viewableItems, setViewableItems] = useState([]);
	const [scollable, setScollable] = useState(false);
	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		// console.log(viewableItems)
		setViewableItems(viewableItems.map((item) => item.key));
	});
	// console.log(viewableItems)
	const [isFocused, setIsFocused] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);
			return () => {
				setIsFocused(false);
			};
		}, [])
	);
	const newS = shorts.filter((short) => {
		return short.id !== shortItem?.id;
	});
	newS.unshift(shortItem)
	// console.log(newS)
	const renderItem = useCallback(
		({ item, index }) => {
			const shouldPlay = viewableItems.includes(item.id?.toString());
			// console.log(index+" "+shouldPlay)
			return (
				<View
					style={{
						height: windowHeight,
						borderTopWidth: 0.7,
						borderBottomWidth: 0.7,
					}}
				>
					<ShortsView
						title={item.caption}
						sourceUrl={getEncodedFirebaseUrl(item.video)}
						creatorID={item.creator}
						shouldPlay={shouldPlay}
						videoId={item?.id}
						fix={(val) => {
							// console.log(val);
							setScollable(val);
						}}
						data={item}
						beFocused={isFocused}
					/>
				</View>
			);
		},
		[viewableItems, screenHeight]
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
					left: "5%",
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
						contentFit="contain"
						style={{ width: 30, height: 30 }}
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
						contentFit="contain"
						style={{ width: 24, height: 24 }}
					/>
				</TouchableOpacity>
			</View>
			<FlatList
				data={newS}
				initialNumToRender={3}
				removeClippedSubviews={true}
				viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
				onViewableItemsChanged={onViewableItemsChanged.current}
				pagingEnabled
				scrollEnabled={!scollable}
				snapToAlignment="start"
				decelerationRate="fast"
				showsVerticalScrollIndicator={false}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

export default TrendingShort;
