import { View, Text, Platform, Dimensions, FlatList } from "react-native";
import React, { useRef } from "react";

import { RefreshControl } from "react-native";
import NotFound from "../NotFound";
import YourVideoComponent from "../YourVideoComponent";
import { getContext } from "../../context/GlobalContext";
import OtherChannelVideo from "../OtherChannelVideo";

const Videos = ({ data, ref, onScroll, scrollEnabled,channelID }) => {
	const {user}=getContext()
	// console.log(user?.uid)
	const flatListRef = useRef(null);
	return (
		<View style={{ width: Dimensions.get("window").width }}>
			<FlatList
				ref={flatListRef}
				onScroll={onScroll}
				scrollEnabled={data.length>0&&scrollEnabled}
				nestedScrollEnabled={true}
				data={data}
				// style={{ }}
				contentContainerStyle={
					{
						// paddingHorizontal: Dimensions.get("screen").width * 0.05,
						
					}
				}
				// contentContainerStyle={{height:"100%"}}
				renderItem={({ item, index }) => {
					// console.log(item)
					if(user?.uid===item.creator)
						return <YourVideoComponent video={item} type={"channel"} />;
					else
						return <OtherChannelVideo video={item} type={"channel"}/>

				}}
				keyExtractor={(item) => {
					return item.id;
				}}
				ListEmptyComponent={<NotFound type={"yourVideos"} channelInfoID={channelID}/>}
			/>
		</View>
	);
};

export default Videos;
