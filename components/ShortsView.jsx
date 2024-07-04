import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	StyleSheet,
	Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheetComponent from "./CommentSection";
import { ResizeMode, Video } from "expo-av";
import { buttonColor, loadingColor } from "../constants/colors";
import { comment, dislike, like, pause, share } from "../constants/icons";
import OtherViewButtons from "./OtherViewButtons";

const ShortsView = ({ sourceUrl, title, shouldPlay,fix,beFocused }) => {
	const [play, setPlay] = useState(true);
	const [likeClicked, setLikeClicked] = useState(false);
	const [dislikeClicked, setDislikeClicked] = useState(false);
	const [commentsEnabled, setCommentsEnabled] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

	const handleToggleBottomSheet = () => {
		setIsBottomSheetVisible(!isBottomSheetVisible);
	};
	function handleActive(active){
		fix(active)
	}

	const handleCloseBottomSheet = () => {
		setIsBottomSheetVisible(false);
	};


	function addLike() {
		if (!likeClicked) {
			setLikeClicked(true);
			setDislikeClicked(false);
		} else setLikeClicked(false);
	}

	function addDislike() {
		if (!dislikeClicked) {
			console.log("dislike");
			setLikeClicked(false);
			setDislikeClicked(true);
		} else setDislikeClicked(false);
	}

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
			}}
		>
			<Pressable
				style={{ width: "100%", height: "100%" }}
				onPress={() => {
					setPlay(!play);
				}}
			>
				<Video
					resizeMode={ResizeMode.COVER}
					shouldPlay={play && shouldPlay && beFocused}
					isLooping
					onPlaybackStatusUpdate={(video) => {
						if (video.isLoaded) setHasStarted(true);
					}}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#000",
					}}
					source={{
						uri: sourceUrl
					}}
				/>
			</Pressable>
			{!play && (
				<Image
					source={pause}
					style={{
						position: "absolute",
						width: 40,
						height: 40,
						bottom: "40%",
						right: "30%",
						transform: [{ translateX: -50 }, { translateY: -50 }],
					}}
				/>
			)}
			{play && !hasStarted && (
				<ActivityIndicator
					size="large"
					color="#fff"
					style={{
						position: "absolute",
						width: 40,
						height: 40,
						bottom: "40%",
						right: "30%",
						transform: [{ translateX: -50 }, { translateY: -50 }],
					}}
				/>
			)}
			<View
				style={{
					position: "absolute",
					right: 15,
					bottom: "20%",
					gap: 35,
					justifyContent: "center",
				}}
			>
				<TouchableOpacity onPress={addLike}>
					<Image
						source={like}
						style={styles.button}
						tintColor={likeClicked ? buttonColor : "#fff"}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={addDislike}>
					<Image
						source={dislike}
						style={styles.button}
						tintColor={dislikeClicked ? buttonColor : "#fff"}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleToggleBottomSheet}>
					<Image source={comment} style={styles.button} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Image source={share} style={styles.button} tintColor={"#fff"} />
				</TouchableOpacity>
			</View>
			<View style={{ position: "absolute", bottom: 20, left: 10 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 20,
						width: "70%",
					}}
				>
					<Image
						style={{
							width: 45,
							height: 45,
							backgroundColor: "#fff",
							borderRadius: "50%",
						}}
					/>
					<OtherViewButtons
						title={"Subscribe"}
						styles={{
							width: 100,
							height: 30,
							backgroundColor: buttonColor,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 3,
						}}
					/>
				</View>
				<Text
					style={{ fontSize: 18, margin: 8, color: "#fff" }}
					numberOfLines={1}
				>
					{title}
				</Text>
			</View>
			{beFocused && (
				<BottomSheetComponent
					isVisible={isBottomSheetVisible}
					onClose={handleCloseBottomSheet}
					isActive={handleActive}
				/>
			)}
		</View>
	);
};

export default ShortsView;

const styles = StyleSheet.create({
	button: {
		width: 36,
		height: 36,
	},
});
