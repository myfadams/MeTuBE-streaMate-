import { View, Text,FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor, loadingColor } from '../../constants/colors';
import { ResizeMode, Video } from 'expo-av';
import VidScreenLoad from '../../components/VidScreenLoad';
import { replay } from '../../constants/icons';
import VidHeader from '../../components/VideoHeader';
import BottomSheetComponent from '../../components/CommentSection';
import VideoView from '../../components/VideoView';


const VideoPlayer = () => {
    const videoID = useLocalSearchParams()
	const [isDone, setIsDone] = useState(false)
	const videoRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const handleCloseBottomSheet = () => {
		setIsBottomSheetVisible(false);
	};
	const handleToggleBottomSheet = () => {
		setIsBottomSheetVisible(!isBottomSheetVisible);
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
	// const testData=[1, 2, 3, 4, 5, 6, ,7]
  return (
		<SafeAreaView
			style={{ backgroundColor: bgColor, width: "100%", height: "100%" }}
		>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Video
					ref={videoRef}
					resizeMode={ResizeMode.CONTAIN}
					shouldPlay={true}
					useNativeControls={!isDone}
					onPlaybackStatusUpdate={(video) => {
						if (video.isLoaded) setHasStarted(true);
						if (video.didJustFinish) setIsDone(true);
					}}
					isMuted={false}
					style={{ width: "100%", height: 250, backgroundColor: "#000" }}
					source={{
						uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
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
				data={testData}
				ListHeaderComponent={testData.length>0 && <VidHeader comment={()=>{handleToggleBottomSheet()}}/>}
				renderItem={(item) => {
					return <VideoView type={"subvideos"} />;
				}}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={<VidScreenLoad />}
			/>
			{/* <View></View> */}
			<BottomSheetComponent
				isVisible={isBottomSheetVisible}
				onClose={handleCloseBottomSheet}
			/>
		</SafeAreaView>
	);
}

export default VideoPlayer