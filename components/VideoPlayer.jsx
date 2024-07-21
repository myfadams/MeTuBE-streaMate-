import React, { useRef, useState, useEffect } from "react";
import {
	View,
	Text,
	Animated,
	PanResponder,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";

const VideoPlayer = ({ uri, onClose }) => {
	const [showMiniPlayer, setShowMiniPlayer] = useState(false);
	const [videoStatus, setVideoStatus] = useState({});
	const [originalHeight, setOriginalHeight] = useState(300); // Track the original height
	const [originalPosition] = useState(new Animated.Value(0)); // Track the original position

	const playerHeight = useRef(new Animated.Value(originalHeight)).current;
	const panY = useRef(new Animated.Value(0)).current;

	const mainVideoRef = useRef(null);
	const miniVideoRef = useRef(null);

	useEffect(() => {
		if (mainVideoRef.current && miniVideoRef.current) {
			synchronizePlayback();
		}
	}, [showMiniPlayer]);

	useEffect(() => {
		// Update the original height if it's changed
		playerHeight.setValue(originalHeight);
	}, [originalHeight]);

	const synchronizePlayback = async () => {
		try {
			const mainStatus = await mainVideoRef.current.getStatusAsync();
			if (mainStatus) {
				await miniVideoRef.current.setStatusAsync({
					shouldPlay: showMiniPlayer || mainStatus.isPlaying,
					positionMillis: mainStatus.positionMillis,
				});
			}
		} catch (error) {
			console.error("Error synchronizing playback:", error);
		}
	};

	const handlePlaybackStatusUpdate = async (status) => {
		setVideoStatus(status);
		if (miniVideoRef.current) {
			try {
				await miniVideoRef.current.setStatusAsync({
					shouldPlay: status.isPlaying,
					positionMillis: status.positionMillis,
				});
			} catch (error) {
				console.error("Error updating playback status:", error);
			}
		}
	};

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (e, gestureState) => {
				panY.setValue(gestureState.dy);
				Animated.timing(playerHeight, {
					toValue: Math.max(100, originalHeight - gestureState.dy),
					duration: 0,
					useNativeDriver: false,
				}).start();
			},
			onPanResponderRelease: (e, gestureState) => {
				if (gestureState.dy > 150) {
					setShowMiniPlayer(true);
					Animated.parallel([
						Animated.spring(playerHeight, {
							toValue: 100,
							useNativeDriver: false,
						}),
						Animated.spring(panY, {
							toValue: 0,
							useNativeDriver: false,
						}),
					]).start();
				} else if (showMiniPlayer && gestureState.dy < -150) {
					setShowMiniPlayer(false);
					Animated.parallel([
						Animated.spring(playerHeight, {
							toValue: originalHeight,
							useNativeDriver: false,
						}),
						Animated.spring(panY, {
							toValue: 0,
							useNativeDriver: false,
						}),
					]).start();
				} else {
					Animated.parallel([
						Animated.spring(playerHeight, {
							toValue: showMiniPlayer ? 100 : originalHeight,
							useNativeDriver: false,
						}),
						Animated.spring(panY, {
							toValue: 0,
							useNativeDriver: false,
						}),
					]).start();
				}
			},
		})
	).current;

	const handleClose = () => {
		Animated.parallel([
			Animated.spring(playerHeight, {
				toValue: 0,
				useNativeDriver: false,
			}),
			Animated.spring(panY, {
				toValue: 0,
				useNativeDriver: false,
			}),
		]).start(() => {
			onClose();
		});
	};

	return (
		<Animated.View
			style={[
				styles.container,
				{
					height: playerHeight,
					transform: [{ translateY: panY }],
					position: "absolute",
					bottom: showMiniPlayer ? 0 : "auto",
					left: showMiniPlayer ? 0 : "auto",
					right: showMiniPlayer ? 0 : "auto",
				},
			]}
			{...panResponder.panHandlers}
		>
			{!showMiniPlayer ? (
				<>
					<Video
						ref={mainVideoRef}
						source={{ uri }}
						style={styles.video}
						useNativeControls
						resizeMode="contain"
						onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
					/>
					<TouchableOpacity style={styles.closeButton} onPress={handleClose}>
						<Text style={styles.closeText}>Close</Text>
					</TouchableOpacity>
				</>
			) : (
				<View style={styles.miniPlayer}>
					<Video
						ref={miniVideoRef}
						source={{ uri }}
						style={styles.video}
						useNativeControls
						resizeMode="contain"
						onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
						shouldPlay={true} // Automatically play the video when the mini player is shown
					/>
					<TouchableOpacity style={styles.closeButton} onPress={handleClose}>
						<Text style={styles.closeText}>X</Text>
					</TouchableOpacity>
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "black",
		width: "100%",
	},
	video: {
		width: "100%",
		height: "100%",
	},
	closeButton: {
		position: "absolute",
		top: 10,
		right: 10,
		padding: 10,
		backgroundColor: "white",
		borderRadius: 20,
	},
	closeText: {
		fontWeight: "bold",
	},
	miniPlayer: {
		width: "100%",
		height: "100%",
		backgroundColor: "black",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		padding: 10,
	},
});

export default VideoPlayer;
