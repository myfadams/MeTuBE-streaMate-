import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
	BackHandler,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Redirect,
	router,
	useFocusEffect,
	useLocalSearchParams,
	useNavigation,
	useRouter,
} from "expo-router";
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
import VideoPlayerComponent from "../../components/VideoPlayer";

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

	// useEffect(() => {
	// 	// Update videoPlaying based on network status
	// 	if (isConnected) {
	// 		setVideoPlaying(videoRef.current?.status?.isPlaying || false);
	// 	}
	// }, [isConnected]);
	
	
	// console.log("vido: "+videoPlaying)
	const [isFullScreen, setIsFullScreen] = useState(false);
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({ gestureEnabled: !isFullScreen });
	}, [isFullScreen, navigation]);

	const handleBack = () => {
		if (isFullScreen) {
			Alert.alert("Back navigation is disabled in full-screen mode");
			return true; // Prevent default back action
		}
		return false; // Allow default back action
	};

	useEffect(() => {
		if (Platform.OS === "android") {
			const backHandler = BackHandler.addEventListener(
				"hardwareBackPress",
				handleBack
			);
			return () => backHandler.remove(); // Cleanup listener on unmount
		}
	}, [isFullScreen]);

	if (!isConnected && videoPlaying === false) {
		// router.replace("offline")
		// return <Redirect href={"offline"} />;
		return <Offline type={"video"} />;
	}
	return (
		<SafeAreaView
			style={{ backgroundColor: bgColor, width: "100%", height: "100%" }}
		>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<VideoPlayerComponent
					video={video}
					setFullScreen={setIsFullScreen}
					setVideoPlaying={setVideoPlaying}
					isFocused
				/>
			</View>
			<FlatList
				data={subvideos
					.filter((vid) => vid.id !== video?.videoview)
					.slice(0, 10)}
				key={(item) => item.id}
				style={{ marginHorizontal: 10 }}
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
			{!isFullScreen && (
				<BottomSheetComponent
					isVisible={isBottomSheetVisible}
					onClose={handleCloseBottomSheet}
					videoID={video?.videoview}
					creatorID={video?.creator}
				/>
			)}
			{!isFullScreen && (
				<AboutVideo
					isVisible={isAboutVisible}
					onClose={handleCloseAbout}
					info={video}
				/>
			)}
		</SafeAreaView>
	);
};

export default VideoPlayer;
