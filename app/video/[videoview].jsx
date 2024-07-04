import { View, Text,FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor, loadingColor } from '../../constants/colors';
import { ResizeMode, Video } from 'expo-av';
import VidScreenLoad from '../../components/VidScreenLoad';
import { replay } from '../../constants/icons';
import VidHeader from '../../components/VideoHeader';
import BottomSheetComponent from '../../components/CommentSection';
import VideoView from '../../components/VideoView';
import AboutVideo from '../../components/AboutVideo';
import TrendingShorts from '../../components/TrendingShorts';
import { fetchVideos } from '../../libs/firebase';


const VideoPlayer = () => {
    const video = useLocalSearchParams()
	// console.log(video)
	const [isDone, setIsDone] = useState(false)
	const videoRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [subvideos, setSubvideos] = useState([])
	const [error,setError]=useState()	
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
		setIsDone(false)
	};
    // console.log(videoID)
	const [testData, settestData] = useState([])
	useEffect(()=>{
		setTimeout(()=>{
			settestData([1, 2, 3, 4, 5, 6, , 7]);
		},2000)
	})
	// const memoizedData = useMemo(() => data, [data]);
	// const testData=[1, 2, 3, 4, 5, 6, ,7]
  return (
		<SafeAreaView
			style={{ backgroundColor: bgColor, width: "100%", height: "100%" }}
		>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Video
					ref={videoRef}
					resizeMode={ResizeMode.CONTAIN}
					shouldPlay={true&&isFocused&&!isDone}
					useNativeControls={!isDone}
					onPlaybackStatusUpdate={(video) => {
						if (video.isLoaded) setHasStarted(true);
						if (video.didJustFinish) setIsDone(true);
					}}
					isMuted={false}
					style={{ width: "100%", height: 250, backgroundColor: "#000" }}
					source={{
						uri: video.video,
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
				data={subvideos.filter((vid)=>{
					return vid.id !==video.id
				})}
				// removeClippedSubviews
				initialNumToRender={3}
				decelerationRate={0.94}
				ListHeaderComponent={
					testData.length > 0 && (
						<VidHeader
							comment={() => {
								handleToggleBottomSheet();
							}}
							about={() => {
								handleToggleAbout();
							}}
							vidinfo={video}
						/>
					)
				}
				renderItem={({ item, index }) => {
					if (index === 1)
						return (
							<>
								<TrendingShorts type={"suggested"} />
								<VideoView  videoInfo={item} type={"subvideo"}/>
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
			<AboutVideo isVisible={isAboutVisible} onClose={handleCloseAbout} info={video} />
		</SafeAreaView>
	);
}
export default VideoPlayer
