// components/CustomVideoPlayer.js
import React, { useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	// Slider,
	Dimensions,
} from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
const CustomVideoPlayer = ({ source }) => {
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [playbackStatus, setPlaybackStatus] = useState({});
	const [showControls, setShowControls] = useState(true);

	const handlePlayPause = async () => {
		if (playbackStatus.isPlaying) {
			await videoRef.current.pauseAsync();
		} else {
			await videoRef.current.playAsync();
		}
		setIsPlaying(!playbackStatus.isPlaying);
	};

	const handleMuteUnmute = async () => {
		setIsMuted(!isMuted);
		await videoRef.current.setIsMutedAsync(!isMuted);
	};

	const handleSeek = async (value) => {
		await videoRef.current.setPositionAsync(value);
	};

	const handleProgress = (status) => {
		setPlaybackStatus(status);
	};

	const { width } = Dimensions.get("window");
	// console.log(source)

	return (
		<View style={styles.container}>
			<Video
				ref={videoRef}
				source={source}
				style={styles.video}
				useNativeControls={false}
				resizeMode="contain"
				onPlaybackStatusUpdate={handleProgress}
				onLoadStart={() => setShowControls(true)}
				onLoad={() => setShowControls(false)}
				onEnd={() => setIsPlaying(false)}
			/>
			{showControls && (
				<View style={styles.controls}>
					<TouchableOpacity onPress={handlePlayPause}>
						<Text style={styles.controlText}>
							{isPlaying ? "Pause" : "Play"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleMuteUnmute}>
						<Text style={styles.controlText}>
							{isMuted ? "Unmute" : "Mute"}
						</Text>
					</TouchableOpacity>
					<Slider
						style={styles.slider}
						minimumValue={0}
						maximumValue={playbackStatus.durationMillis}
						value={playbackStatus.positionMillis}
						onValueChange={handleSeek}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	video: {
		width: "100%",
		height: 200,
		backgroundColor:"#000"
	},
	controls: {
		position: "absolute",
		bottom: 20,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
	},
	controlText: {
		color: "white",
		fontSize: 16,
	},
	slider: {
		width: "60%",
	},
});

export default CustomVideoPlayer;
