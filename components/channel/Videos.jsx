import { View, Text, Platform, Dimensions, FlatList } from "react-native";
import React, { useRef } from "react";

import { RefreshControl } from "react-native";
import NotFound from "../NotFound";
import YourVideoComponent from "../YourVideoComponent";

const Videos = ({ data, ref, onScroll, scrollEnabled }) => {
	// console.log(data)
	 const flatListRef = useRef(null);
	return (
		<View style={{}}>
			<FlatList
				ref={flatListRef}
				onScroll={onScroll}
				scrollEnabled={scrollEnabled}
				nestedScrollEnabled={true}
				data={data}
				style={{ width: Dimensions.get("window").width }}
				// contentContainerStyle={{height:"100%"}}
				renderItem={({ item, index }) => {
					return <YourVideoComponent video={item} type={"channel"} />;
				}}
				keyExtractor={(item) => {
					return item.id;
				}}
				ListEmptyComponent={<NotFound type={"yourVideos"} />}
			/>
		</View>
	);
};

export default Videos;
