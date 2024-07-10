import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, loadingColor } from "../../constants/colors";
import { ResizeMode, Video } from "expo-av";
import VidScreenLoad from "../../components/VidScreenLoad";
import { replay } from "../../constants/icons";
import VidHeader from "../../components/VideoHeader";
import BottomSheetComponent from "../../components/CommentSection";
import VideoView from "../../components/VideoView";
import AboutVideo from "../../components/AboutVideo";
import TrendingShorts from "../../components/TrendingShorts";
import { fetchVideos } from "../../libs/firebase";
import { addToHistory, getSubsriptions, incrementVideoViews } from "../../libs/videoUpdates";
import { getContext } from "../../context/GlobalContext";

const VideoPlayer = () => {
	const { user, isIcognito } = getContext();
	const video = useLocalSearchParams();
	// console.log(video.video)
	const [isDone, setIsDone] = useState(false);
	const videoRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [subvideos, setSubvideos] = useState([]);
	const [error, setError] = useState();
	const [subscribed, setsubscribed]=useState(false)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const videoData = await fetchVideos();
				// console.log(videoData)
				setSubvideos([...videoData]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
		
	}, []);
	// console.log(subvideos)
	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);
			
			return () => {
				setIsFocused(false);
			};
		}, [])
	);
	console.log(subscribed);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const handleCloseBottomSheet = () => {
		setIsBottomSheetVisible(false);
	};
	const handleToggleBottomSheet = () => {
		setIsBottomSheetVisible(!isBottomSheetVisible);
	};

	const [isAboutVisible, setIsAboutVisible] = useState(false);
	const handleCloseAbout = () => {
		setIsAboutVisible(false);
	};
	const handleToggleAbout = () => {
		setIsAboutVisible(!isBottomSheetVisible);
	};

	const handleRestart = async () => {
		if (videoRef.current) {
			await videoRef.current.setPositionAsync(0); // Seek to the beginning
			await videoRef.current.playAsync(); // Start playing the video
		}
		setIsDone(false);
	};
	// console.log(videoID)

	return (
		<SafeAreaView
			style={{ backgroundColor: bgColor, width: "100%", height: "100%" }}
		>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Video
					ref={videoRef}
					resizeMode={ResizeMode.CONTAIN}
					shouldPlay={true && isFocused && !isDone}
					useNativeControls={!isDone}
					onLoad={() => {
						setTimeout(() => {
							incrementVideoViews(video.videoview, "videosRef");
							if (!isIcognito)
								addToHistory("videos", video, video.videoview, user?.uid);
						}, 4000);
					}}
					onPlaybackStatusUpdate={(vid) => {
						if (vid.isLoaded) {
							setHasStarted(true);
						}
						if (video.isBuffering) setHasStarted(false);
						else setHasStarted(true);

						if (vid.didJustFinish) setIsDone(true);
						// if(vid.is)
					}}
					isMuted={false}
					style={{ width: "100%", height: 250, backgroundColor: "#1A1818" }}
					source={{
						uri: video.video.replace("videos/", "videos%2F"),
					}}
				/>
				{isDone && (
					<TouchableOpacity
						style={{ position: "absolute" }}
						onPress={handleRestart}
					>
						<Image source={replay} style={{ width: 45, height: 45 }} />
					</TouchableOpacity>
				)}
				{!hasStarted && (
					<ActivityIndicator
						size="large"
						color="#fff"
						style={{ position: "absolute" }}
					/>
				)}
			</View>
			<FlatList
				data={subvideos.filter((vid) => {
					// console.log(vid)
					return vid.id !== video.videoview;
				})}
				// removeClippedSubviews
				key={(item) => item.id}
				initialNumToRender={3}
				decelerationRate={0.94}
				ListHeaderComponent={
					<VidHeader
						comment={() => {
							handleToggleBottomSheet();
						}}
						about={() => {
							handleToggleAbout();
						}}
						vidinfo={video}
						substatus={subscribed}
					/>
					// testData.length > 0 && (
					// )
				}
				renderItem={({ item, index }) => {
					if (index === 1)
						return (
							<>
								<TrendingShorts type={"suggested"} />
								<VideoView videoInfo={item} type={"subvideo"} />
							</>
						);
					return <VideoView videoInfo={item} type={"subvideo"} />;
				}}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={<VidScreenLoad />}
			/>
			{/* <View></View> */}
			<BottomSheetComponent
				isVisible={isBottomSheetVisible}
				onClose={handleCloseBottomSheet}
			/>
			<AboutVideo
				isVisible={isAboutVisible}
				onClose={handleCloseAbout}
				info={video}
			/>
		</SafeAreaView>
	);
};
export default VideoPlayer;
