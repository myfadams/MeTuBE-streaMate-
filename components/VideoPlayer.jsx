import React, { useRef, useState, useEffect, useCallback } from "react";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import {
	TouchableOpacity,
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Platform,
	ActivityIndicator,
	Text,
} from "react-native";
import { Image } from "expo-image";
import Slider from "@react-native-community/slider";
import { getContext } from "../context/GlobalContext";
import {
	exitFullScreen,
	fowardVid,
	fullScreen,
	pause,
	playIcon,
	replay,
	rewindVid,
	videothumb,
} from "../constants/icons";
import { borderLight, buttonColor, fieldColor } from "../constants/colors";
import { addToHistory, incrementVideoViews } from "../libs/videoUpdates";
import { useFocusEffect } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function VideoPlayerComponent({
	video,
	setFullScreen,
	setVideoPlaying,
	// isFocused,
}) {
	const [playing, setPlaying] = useState(true);
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);
	const [isSeeking, setIsSeeking] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const [controlsVisible, setControlsVisible] = useState(true);
	const [controlsTimeout, setControlsTimeout] = useState(null);
	const videoRef = useRef(null);
	const { user, isIcognito, isConnected } = getContext();

	useEffect(() => {
		const updatePosition = async () => {
			if (videoRef.current && !isSeeking) {
				const status = await videoRef.current.getStatusAsync();
				if (status.isLoaded) {
					setPosition(status.positionMillis || 0);
				}
			}
		};

		const interval = setInterval(updatePosition, 1000);
		return () => clearInterval(interval);
	}, [isSeeking]);

	useEffect(() => {
		// Hide controls automatically after 3 seconds of inactivity
		if (controlsVisible) {
			if (controlsTimeout) {
				clearTimeout(controlsTimeout);
			}
			const timeout = setTimeout(() => setControlsVisible(false), 3000);
			setControlsTimeout(timeout);
		}
		return () => {
			if (controlsTimeout) {
				clearTimeout(controlsTimeout);
			}
		};
	}, [controlsVisible]);

	const togglePlayPause = async () => {
		if (playing) {
			await videoRef.current.pauseAsync();
		} else {
			await videoRef.current.playAsync();
		}
		setPlaying(!playing);
	};

	const skip = async (forward) => {
		const status = await videoRef.current.getStatusAsync();
		if (status) {
			const tenSeconds = 10000;
			const newPos = Math.max(
				0,
				Math.min(
					(status.positionMillis || 0) + (forward ? tenSeconds : -tenSeconds),
					duration
				)
			);
			setPosition(newPos);
			await videoRef.current.setPositionAsync(newPos);
		}
	};

	const handleSlidingStart = () => {
		setIsSeeking(true);
		if (playing) {
			videoRef.current.pauseAsync();
		}
	};

	const handleSlidingComplete = async (value) => {
		setIsSeeking(false);
		setPosition(value);
		await videoRef.current.setPositionAsync(value);
		if (playing) {
			await videoRef.current.playAsync();
		}
	};

	const handlePlaybackStatusUpdate = (status) => {
		if (isConnected) {
			setVideoPlaying(status?.isLoaded || false);
		}
		if (status.isLoaded) {
			setHasStarted(true);
			if (!isSeeking) {
				setPosition(status.positionMillis || 0);
			}
			if (duration === 0) {
				setDuration(status.durationMillis || 0);
			}
		}
		if (status.didJustFinish) {
			setIsDone(true);
		}
	};

	const handleRestart = async () => {
		if (videoRef.current) {
			await videoRef.current.setPositionAsync(0); // Seek to the beginning
			await videoRef.current.playAsync(); // Start playing the video
		}
		setPlaying(true);
		setIsDone(false);
	};

	const toggleFullScreen = async () => {
		if (isFullScreen) {
			await ScreenOrientation.unlockAsync();
			setIsFullScreen(false);
			setFullScreen(false);
		} else {
			await ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.LANDSCAPE
			);
			setIsFullScreen(true);
			setFullScreen(true);
		}
	};

	const handleTouch = () => {
		setControlsVisible(true); // Show controls on touch
		if (controlsTimeout) {
			clearTimeout(controlsTimeout);
		}
		const timeout = setTimeout(() => setControlsVisible(false), 3000);
		setControlsTimeout(timeout);
	};

	useEffect(() => {
		setVideoPlaying(true);
	}, []);

	const formatTime = (timeMillis) => {
		if (!timeMillis) return "00:00";
		const minutes = Math.floor(timeMillis / 60000);
		const seconds = Math.floor((timeMillis % 60000) / 1000);
		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};
	const [isFocused,setIsFocused]=useState(false)
	useFocusEffect(
		useCallback(() => {
			setIsFocused(true);

			return () => {
				setIsFocused(false);
			};
		}, [])
	);

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.videoContainer}>
				<Video
					ref={videoRef}
					source={{
						uri: video?.video?.replace("videos/", "videos%2F"),
					}}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					resizeMode={isFullScreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
					onLoad={() => {
						setTimeout(() => {
							incrementVideoViews(video?.videoview, "videosRef");
							if (!isIcognito)
								addToHistory("videos", video, video?.videoview, user?.uid);
						}, 4000);
					}}
					shouldPlay={isFocused}
					style={isFullScreen ? styles.fullScreenVideo : styles.video}
					onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
					onTouchStart={handleTouch} // Show controls on touch
				/>
				{controlsVisible && hasStarted && (
					<View style={styles.controls}>
						<TouchableOpacity
							style={styles.fullScreenButton}
							onPress={toggleFullScreen}
						>
							<Image
								style={styles.icon}
								source={isFullScreen ? exitFullScreen : fullScreen}
								contentFit="contain"
								tintColor="#fff"
							/>
						</TouchableOpacity>
						<View style={styles.buttonContainer}>
							{!isDone ? (
								<>
									<TouchableOpacity
										onPress={() => skip(false)}
										style={styles.controlButton}
									>
										<Image
											source={rewindVid}
											style={styles.icon}
											contentFit="contain"
											tintColor="#fff"
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={togglePlayPause}
										style={{ ...styles.controlButton, width: 60, height: 60 }}
									>
										{playing ? (
											<Image
												source={pause}
												style={styles.icon}
												contentFit="contain"
											/>
										) : (
											<Image
												source={playIcon}
												style={styles.icon}
												contentFit="contain"
											/>
										)}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => skip(true)}
										style={styles.controlButton}
									>
										<Image
											source={fowardVid}
											style={styles.icon}
											contentFit="contain"
											tintColor="#fff"
										/>
									</TouchableOpacity>
								</>
							) : (
								<TouchableOpacity
									onPress={handleRestart}
									style={styles.controlButton}
								>
									<Image
										source={replay}
										style={{ width: 27, height: 27 }}
										tintColor="#fff"
									/>
								</TouchableOpacity>
							)}
						</View>
						{!isDone && (
							<>
								<Slider
									thumbTintColor="transparent"
									value={position}
									minimumValue={0}
									maximumValue={duration}
									minimumTrackTintColor={buttonColor}
									maximumTrackTintColor="#fff"
									onValueChange={setPosition}
									onSlidingStart={handleSlidingStart}
									onSlidingComplete={handleSlidingComplete}
									style={{
										...styles.slider,
										width: isFullScreen ? "95%" : "100%",
									}}
									step={1}
								/>
								<View style={styles.timeContainer}>
									<Text style={styles.timeText}>
										{formatTime(position)} /{" "}
										<Text style={{ color: borderLight }}>
											{formatTime(duration)}
										</Text>
									</Text>
								</View>
							</>
						)}
					</View>
				)}
				{!hasStarted && (
					<ActivityIndicator
						size="large"
						color="#fff"
						style={{ position: "absolute" }}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000",
	},
	videoContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		width: "100%",
	},
	video: {
		width: screenWidth,
		height: screenWidth * 0.62,
		backgroundColor: fieldColor,
	},
	fullScreenVideo: {
		width: screenHeight,
		height: screenWidth,
	},
	controls: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	fullScreenButton: {
		position: "absolute",
		right: 10,
		bottom: 25,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "80%",
		marginVertical: 10,
	},
	controlText: {
		color: "white",
		fontSize: 16,
	},
	slider: {
		height: 40,
		position: "absolute",
		bottom: -20,
	},
	icon: {
		width: 25,
		height: 25,
	},
	timeContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		// marginTop: 10,
		bottom: 30,
		left: 10,
		position: "absolute",
	},
	timeText: {
		color: "#fff",
		fontSize: 14,
		fontFamily: "Montserrat_500Medium",
	},
});
