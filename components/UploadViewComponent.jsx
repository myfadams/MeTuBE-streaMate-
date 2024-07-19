import { Video } from "expo-av";
import React, { memo, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { formatTime } from "../constants/videoTime";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";

const UploadVideoComponent = React.memo(({ item, isLoaded }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [thumbnail, setThumbnail] = useState();
	useEffect(() => {
		if (item) {
			generateThumbnail(item.thumbnail);
			isLoaded();
		}
	}, [item]);
	const generateThumbnail = async (url) => {
		try {
			const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
				time: 1000,
			});
			setThumbnail(uri);
			// console.log(uri)
			return uri;
		} catch (e) {
			console.warn(e);
		}
	};
	return (
		<TouchableOpacity
			style={{ flex: 1, margin: 2, height: 120 }}
			activeOpacity={0.6}
			onPress={() => {
				if(parseInt(item.height)>=630 && Math.round(item.duration)<=60)
					router.push({
						pathname: "/upload/uploadShorts",
						params: { ...item, thumbnailURL: thumbnail },
					});
				else
					router.push({
						pathname: "/upload/uploadScreen",
						params: { ...item, thumbnailURL: thumbnail },
					});
			}}
		>
			<Image
				source={{ uri: thumbnail }}
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: "#000",
					borderRadius: 5,
				}}
				resizeMode="cover"
			/>

			<View style={{ position: "absolute", bottom: 5, right: 10 }}>
				<Text style={{ color: "white" }}>{formatTime(item.duration)}</Text>
			</View>
		</TouchableOpacity>
	);
});

export default memo(UploadVideoComponent);
