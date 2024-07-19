import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { addToHistory, incrementVideoViews } from "../../libs/videoUpdates";
import { getContext } from "../../context/GlobalContext";
import { get, ref } from "firebase/database";
import { db } from "../../libs/config";
import Offline from "../../components/Offline";
import { shuffleArray } from "../../libs/sound";

const VideoPlayer = () => {
	const { user, isIcognito, isConnected } = getContext();
	let video = useLocalSearchParams();
	const [vidLoad, setVidLoad] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [subvideos, setSubvideos] = useState([]);
	const [error, setError] = useState();
	const [subscribed, setsubscribed] = useState(false);
	const [creator, setcreator] = useState();
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const [isAboutVisible, setIsAboutVisible] = useState(false);
	const [videoPlaying, setVideoPlaying] = useState(false); // Track if video is playing
	const videoRef = useRef(null);
	// console.log(video)
	useEffect(() => {
		async function getCre() {
			const crRef = ref(db, `usersref/${video.creator}`);
			let temp = await get(crRef);
			setcreator(temp.val());
		}
		getCre();
	}, []);

	video = { ...video, ...creator };

	useEffect(() => {
		const fetchData = async () => {
			try {
				const videoData = await fetchVideos();
				setSubvideos([...shuffleArray(videoData)]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);

	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);

			return () => {
				setIsFocused(false);
			};
		}, [])
	);

	const handleCloseBottomSheet = () => {
		setIsBottomSheetVisible(false);
	};

	const handleToggleBottomSheet = () => {
		setIsBottomSheetVisible(!isBottomSheetVisible);
	};

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

	useEffect(() => {
		// Update videoPlaying based on network status
		if (isConnected) {
			setVideoPlaying(videoRef.current?.status?.isPlaying || false);
		}
	}, [isConnected]);

	if (!isConnected && !videoPlaying) {
		return <Offline type={"video"} />;
	}

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
							setVideoPlaying(true); // Mark video as playing
						}
						if (vid.didJustFinish) setIsDone(true);
					}}
					isMuted={false}
					style={{ width: "100%", height: 250, backgroundColor: "#1A1818" }}
					source={{ uri: video.video.replace("videos/", "videos%2F") }}
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
				data={subvideos
					.filter((vid) => vid.id !== video?.videoview)
					.slice(0, 10)}
				key={(item) => item.id}
				initialNumToRender={3}
				decelerationRate={0.94}
				ListHeaderComponent={
					<VidHeader
						comment={() => handleToggleBottomSheet()}
						about={() => handleToggleAbout()}
						vidinfo={video}
						substatus={subscribed}
					/>
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
			<BottomSheetComponent
				isVisible={isBottomSheetVisible}
				onClose={handleCloseBottomSheet}
				videoID={video?.videoview}
				creatorID={video?.creator}
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
