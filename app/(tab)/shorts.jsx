import {
	View,
	Text,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor } from "../../constants/colors";
import ShortsView from "../../components/ShortsView";

import { router, useFocusEffect } from "expo-router";
import { search } from "../../constants/icons";
import { fetchShorts } from "../../libs/firebase";
import { shuffleArray } from "../../libs/sound";
import { getContext } from "../../context/GlobalContext";

const windowHeight = Dimensions.get("window").height;

const shorts = () => {
	const {refereshing}=getContext();
	const [viewableItems, setViewableItems] = useState([]);
	const [scollable, setScollable] = useState(false);
	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		setViewableItems(viewableItems.map((item) => item.key));
	});
	const [isFocused, setIsFocused] = useState(false);

	useFocusEffect(
		useCallback(() => {
			console.log("shorts focused")
			setIsFocused(true);
			return () => {
				setIsFocused(false);
			};
		}, [])
	);
	const [shorts, setShorts] = useState([]);
	const [error, setError] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const shortsData = await fetchShorts();
				// console.log(shortsData);
				const tempdata = shuffleArray(shortsData?.slice());
				setShorts([...tempdata]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, [refereshing]);

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
					width: "100%",
					top: "8%",
					right: 15,
					position: "absolute",
					zIndex: 1,
					flexDirection: "row",
					justifyContent: "flex-end",
				}}
			>
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
				data={shorts}
				viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
				onViewableItemsChanged={onViewableItemsChanged.current}
				pagingEnabled
				scrollEnabled={!scollable}
				snapToAlignment="start"
				decelerationRate="fast"
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => {
					const shouldPlay = viewableItems.includes(item.id.toString());
					return (
						<View
							style={{
								height: windowHeight - 80,
								borderTopWidth: 0.7,
								borderBottomWidth: 0.7,
							}}
						>
							<ShortsView
								sourceUrl={item.video}
								shouldPlay={shouldPlay}
								title={item.caption}
								videoId={item.id}
								creatorID={item.creator}
								fix={(val) => {
									// console.log(val);
									setScollable(val);
								}}
								data={item}
								beFocused={isFocused}
							/>
						</View>
					);
				}}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

export default shorts;
