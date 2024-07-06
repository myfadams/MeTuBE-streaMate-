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
import {
	borderLight,
	buttonColor,
	fieldColor,
	loadingColor,
} from "../constants/colors";
import { comment, dislike, incoginito, like, pause, share } from "../constants/icons";
import OtherViewButtons from "./OtherViewButtons";
import { getCreatorInfo } from "../libs/firebase";
import MoreButton from "./MoreButton";
import { getContext } from "../context/GlobalContext";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";
import { addToHistory, incrementVideoViews } from "../libs/videoUpdates";

const ShortsView = ({
	sourceUrl,
	title,
	shouldPlay,
	fix,
	beFocused,
	creatorID,
	videoId,
	data,
}) => {
	// console.log(creatorID)
	const [play, setPlay] = useState(true);
	const [likeClicked, setLikeClicked] = useState(false);
	const [dislikeClicked, setDislikeClicked] = useState(false);
	// const [commentsEnabled, setCommentsEnabled] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const [creator, setCreator] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	// thumbnail={item.thumbnail} id={item.id}
	
	const { user, isIcognito } = getContext();
	const [subscribed, setsubscribed] = useState(false);
	function handleSubscribe() {
		setsubscribed(!subscribed);
	}
	const [count, setCount] = useState(0)
	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(creatorID);
				// console.log(users)
				setCreator([...users]);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCreator();
	}, [creatorID]);

	const [views, setViews] = useState(0);
	useEffect(() => {
		const videoRef = ref(db, `shortsRef/${videoId}/views`);

		const unsubscribe = onValue(videoRef, (snapshot) => {
			const data = snapshot.val();
			setViews(data || 0);
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [videoId]);

	const handleToggleBottomSheet = () => {
		setIsBottomSheetVisible(!isBottomSheetVisible);
	};
	function handleActive(active) {
		fix(active);
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
	// console.log(shouldPlay);
	const videoRef = useRef(null);

	useEffect(() => {
		if (beFocused && shouldPlay && videoRef.current) {
			videoRef.current.replayAsync();
			setCount(0);
			setPlay(true);
		}
	}, [shouldPlay]);
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
				}} //mn
			>
				<Video
					ref={videoRef}
					resizeMode={ResizeMode.COVER}
					shouldPlay={play && shouldPlay && beFocused}
					isLooping
					onPlaybackStatusUpdate={(video) => {
						// console.log(count)
						if (video.didJustFinish && play && count === 0 && !isIcognito) {
							addToHistory("shorts", data, video.videoview, user.uid);
							setCount(count+1);
						}
						if (video.isLoaded && video.isPlaying) setHasStarted(true);
						if (video.isBuffering && beFocused && shouldPlay)
							setHasStarted(false);
						// else setHasStarted(true);
						if (shouldPlay)
							if (video.didJustFinish)
								incrementVideoViews(videoId, "shortsRef");
					}}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#000",
					}}
					source={{
						uri: sourceUrl,
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
			{(play && !hasStarted) && (
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
			<View style={{ position: "absolute", bottom: 50, left: 10 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 15,
						width: "70%",
					}}
				>
					<Image
						source={{ uri: creator[0]?.image }}
						style={{
							width: 45,
							height: 45,
							backgroundColor: "#fff",
							borderRadius: "50%",
						}}
					/>
					<Text
						style={{
							color: "white",
							fontSize: 18,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						{creator[0]?.name}
					</Text>

					{creatorID !== user.uid && (
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								width: 100,
								height: 35,
								backgroundColor: subscribed ? fieldColor : buttonColor,
								borderWidth: subscribed && 0.6,
								borderColor: borderLight,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 30,
							}}
						/>
					)}
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
