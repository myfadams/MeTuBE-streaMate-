import { useState, useEffect } from "react";
import {
	Button,
	Text,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Image,
	View,
	Platform,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { bgColor } from "../../constants/colors";
import { formatTime } from "../../constants/videoTime";
import { router } from "expo-router";
import UploadVideoComponent from "../../components/UploadViewComponent";
export default function App() {
	const [doneLoading, setDoneLoading] = useState(false);
	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
	const [videos, setVideos]=useState(null);
	function handleLoaing(){
		setDoneLoading(true);
		// console.log("1232321312")
	}
	useEffect(() => {
		if (!permissionResponse) {
			requestPermission();
		} else if (permissionResponse.granted) {
			// fetchVideos();
			fetchAllVideos()
		}
	}, [permissionResponse]);

	const fetchAllVideos = async () => {
		try {
			let allVideos = [];
			let fetchParams = {
				mediaType: MediaLibrary.MediaType.video,
				first: 100, // Fetch up to 100 videos per request
			};

			while (true) {
				const media = await MediaLibrary.getAssetsAsync(fetchParams);

				if (media.assets.length > 0) {
					allVideos = [...allVideos, ...media.assets];
					if (media.hasNextPage) {
						fetchParams = { ...fetchParams, after: media.endCursor };
					} else {
						break;
					}
				} else {
					break;
				}
			}

			const videoDetails = await Promise.all(
				allVideos.map(async (video) => {
					const info = await MediaLibrary.getAssetInfoAsync(video.id);
					return { ...video, thumbnail: info.localUri || info.uri };
				})
			);

			setVideos(videoDetails);
		} catch (error) {
			console.error("Error fetching all videos:", error);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<Text
				style={{
					color: "#fff",
					fontFamily: "Montserrat_500Medium",
					fontSize: 22,
					marginBottom: 20,
					marginTop: 14,
					marginLeft: 2,
				}}
			>
				Upload video
			</Text>
			{(!videos || !doneLoading) && (
				<ActivityIndicator
					size="large"
					color="#fff"
					style={{ position: "absolute", left: "50%", right: "50%", zIndex: 1 }}
				/>
			)}
			<FlatList
				data={videos}
				renderItem={({ item }) => {
					return <UploadVideoComponent item={item} isLoaded={handleLoaing} />;
				}}
				numColumns={3}
				style={{ borderBottomLeftRadius:20,borderBottomRightRadius:20, borderBottomWidth:0.5}}
				keyExtractor={(item) => item.id}
			/>
			<View style={{ marginTop: 30 }}></View>
		</SafeAreaView>
	);
}

 
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// gap: 8,
		backgroundColor:bgColor,
		justifyContent: "center",
		...Platform.select({
			android: {
				paddingTop: 40,
			},
		}),
	},

});
