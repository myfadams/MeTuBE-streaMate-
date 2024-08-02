import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
	Pressable,
	Platform,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import BottomSheetComponent from "./CommentSection";
import { ResizeMode, Video } from "expo-av";
import {
	borderLight,
	buttonColor,
	fieldColor,
	loadingColor,
} from "../constants/colors";
import {
	comment,
	dislike,
	incoginito,
	like,
	pause,
	remix,
	share,
} from "../constants/icons";
import OtherViewButtons from "./OtherViewButtons";
import { getCreatorInfo } from "../libs/firebase";
import MoreButton from "./MoreButton";
import { getContext } from "../context/GlobalContext";
import { onValue, ref } from "firebase/database";
import { db } from "../libs/config";
import {
	addToHistory,
	getLikes,
	getSubsriptions,
	incrementVideoViews,
	likeUpadate,
	playList,
	setDisLikeStatus,
	setLikeStatus,
	subscribeToChannel,
} from "../libs/videoUpdates";
import { router, useFocusEffect } from "expo-router";
import Toast from "react-native-root-toast";
import { generateLinkShort } from "../libs/share";
import * as Clipboard from "expo-clipboard";
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
	// console.log("this short " + shouldPlay);
	const width = Dimensions.get("window").width;
	const [play, setPlay] = useState(true);
	const [likeClicked, setLikeClicked] = useState(false);
	const [dislikeClicked, setDislikeClicked] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
	const [creator, setCreator] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [likes, setLikes] = useState(0);
	const { user, isIcognito } = getContext();
	const [subscribed, setSubscribed] = useState(false);
	const [count, setCount] = useState(0);
	const [views, setViews] = useState(0);

	const videoRef = useRef(null);

	useEffect(() => {
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(creatorID);
				getSubsriptions(user?.uid, setSubscribed, creatorID);
				setCreator(users);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCreator();
	}, [creatorID, user?.uid]);

	useEffect(() => {
		const videoRef = ref(db, `shortsRef/${videoId}/views`);
		getLikes(videoId, setLikes, "shortsRef");
		const unsubscribe = onValue(videoRef, (snapshot) => {
			const data = snapshot.val();
			setViews(data || 0);
		});

		return () => unsubscribe();
	}, [videoId]);
	const [noComments,setNoComments]=useState(0);
	useEffect(() => {
		setLikeStatus(videoId, setLikeClicked, user?.uid, "shortsRef");
		setDisLikeStatus(videoId, setDislikeClicked, user?.uid, "shortsRef");
		
	}, [videoId]);

	useEffect(() => {
		if (beFocused && shouldPlay && videoRef.current) {
			videoRef.current.replayAsync();
			setCount(0);
			setPlay(true);
		}
		const videoCommentRef = ref(db, `commentsRef/${videoId}`);
		const unsubscribe = onValue(videoCommentRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val());
				setNoComments(data?.length);
			}
		});
		return () => unsubscribe();
	}, [shouldPlay]);

	const handleToggleBottomSheet = () =>
		setIsBottomSheetVisible((prev) => !prev);

	const handleSubscribe = () => {
		subscribeToChannel(creatorID, user?.uid);
		getSubsriptions(user?.uid, setSubscribed, creatorID);
	};

	const handleLikePress = () => {
		if (!likeClicked) {
			setLikeClicked(true);
			setDislikeClicked(false);
		} else {
			setLikeClicked(false);
		}
		likeUpadate(videoId, "like", "shortsRef", user?.uid);
		getLikes(videoId, setLikes, "shortsRef");
		playList(videoId, "likedShorts", user?.uid);
	};

	const handleDislikePress = () => {
		if (!dislikeClicked) {
			setLikeClicked(false);
			setDislikeClicked(true);
		} else {
			setDislikeClicked(false);
		}
		likeUpadate(videoId, "dislike", "shortsRef", user?.uid);
		getLikes(videoId, setLikes, "shortsRef");
	};
	const [isInFocus,setIsInFocus]=useState(false)
	useFocusEffect(useCallback(()=>{
		setIsInFocus(true)
		return ()=>{
			setIsInFocus(false)
		}
	}, []))
	const shareShort = async () => {
		const textToCopy = generateLinkShort(videoId, title);

		// Copy text to clipboard
		await Clipboard.setStringAsync(textToCopy);

		// Optionally show an alert or message
		let toast = Toast.show("Copied link to copied", {
			duration: Toast.durations.LONG,
		});

		router.push("chatHomeScreen");
		setTimeout(function hideToast() {
			Toast.hide(toast);
		}, 3000);
	};
	return (
		<View style={styles.container}>
			<Pressable
				style={{ width: "100%", height: "100%" }}
				onPress={() => setPlay(!play)}
			>
				<Video
					ref={videoRef}
					resizeMode={ResizeMode.COVER}
					shouldPlay={play && shouldPlay && isInFocus}
					isLooping
					onPlaybackStatusUpdate={(video) => {
						if (video.didJustFinish && play && count === 0 && !isIcognito) {
							addToHistory("shorts", data, video?.videoview, user?.uid);
							setCount(count + 1);
						}
						if (video?.isLoaded && video.isPlaying) setHasStarted(true);
						if (video?.isBuffering && beFocused && shouldPlay)
							setHasStarted(false);
						if (shouldPlay && video?.didJustFinish)
							incrementVideoViews(videoId, "shortsRef");
					}}
					style={styles.video}
					source={{ uri: shouldPlay?sourceUrl:null }}
				/>
			</Pressable>
			{!play && <Image source={pause} style={styles.icon} />}
			{play && !hasStarted && (
				<ActivityIndicator size="large" color="#fff" style={styles.indicator} />
			)}
			<View style={styles.controlsContainer}>
				<TouchableOpacity
					onPress={handleLikePress}
					style={{ alignItems: "center", gap: 4 }}
				>
					<Image
						source={like}
						style={styles.button}
						contentFit="contain"
						tintColor={likeClicked ? buttonColor : "#fff"}
					/>
					<Text style={styles.text}>{likes === 0 ? "Like" : likes}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleDislikePress}
					style={{ alignItems: "center", gap: 4 }}
				>
					<Image
						source={dislike}
						style={styles.button}
						contentFit="contain"
						tintColor={dislikeClicked ? buttonColor : "#fff"}
					/>
					<Text style={styles.text}>{"Dislike"}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleToggleBottomSheet}
					style={{ alignItems: "center", gap: 4 }}
				>
					<Image source={comment} style={styles.button} contentFit="contain" />
					<Text style={styles.text}>{noComments}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ alignItems: "center", gap: 4 }}
					onPress={shareShort}>
					<Image
						source={share}
						style={styles.button}
						tintColor={"#fff"}
						contentFit="contain"
					/>
					<Text style={styles.text}>{"Share"}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{ alignItems: "center", gap: 4 }}>
					<Image
						source={remix}
						style={styles.button}
						tintColor={"#fff"}
						contentFit="contain"
					/>
					<Text style={styles.text}>{"Remix"}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.creatorContainer}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 10,
						
					}}
				>
					<TouchableOpacity
						onPress={() => {
							router.push({
								pathname: "userVideos/aboutVids",
								params: {
									uid: creator[0]?.id,
									photoURL: creator[0]?.image,
									displayName: creator[0]?.name,
									otherChannel: "OtherChannel",
								},
							});
						}}
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Image
							source={{ uri: creator[0]?.image }}
							style={styles.creatorImage}
						/>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							style={styles.creatorText}

						>
							{creator[0]?.name}
						</Text>
					</TouchableOpacity>

					{creatorID !== user?.uid && (
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								width: 100,
								height: 35,
								backgroundColor: subscribed ? fieldColor : buttonColor,
								opacity: subscribed && 0.6,
								borderWidth: subscribed ? 0.6 : 0,
								borderColor: borderLight,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 30,
							}}
						/>
					)}
				</View>
				<View style={{ width: width * 0.8 }}>
					<Text style={styles.title} numberOfLines={3}>
						{title}
					</Text>
				</View>
			</View>
			{beFocused && (
				<BottomSheetComponent
					isVisible={isBottomSheetVisible}
					onClose={handleToggleBottomSheet}
					isIcognito={isIcognito}
					videoID={videoId}
					creatorID={creatorID}
				/>
			)}
			
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 30,
		height: 30,
	},
	video: {
		width: "100%",
		height: "100%",
		backgroundColor: "#000",
	},
	icon: {
		position: "absolute",
		width: 40,
		height: 40,
		bottom: "40%",
		right: "30%",
		transform: [{ translateX: -50 }, { translateY: -50 }],
	},
	indicator: {
		position: "absolute",
		width: 40,
		height: 40,
		bottom: "40%",
		right: "30%",
		transform: [{ translateX: -50 }, { translateY: -50 }],
	},
	container: {
		width: "100%",
		height: "100%",
		position: "relative",
		
	},
	controlsContainer: {
		position: "absolute",
		right: 15,
		bottom: "13%",
		gap: 28,
		justifyContent: "center",
	},
	creatorContainer: {
		position: "absolute",
		bottom: Platform.OS === "ios" ? 30 : 35,
		left: 10,
	},
	creatorImage: {
		width: 35,
		height: 35,
		backgroundColor: "#fff",
		borderRadius: Platform.OS === "ios" ? "50%" : 50,
	},
	creatorText: {
		color: "white",
		fontSize: 16,
		fontFamily: "Montserrat_600SemiBold",
		maxWidth: (Dimensions.get("window").width) * 0.35,
	},
	title: {
		fontSize: 18,
		margin: 8,
		color: "#fff",
	},
	text: {
		color: "white",
		fontSize: 14,
		fontFamily: "Montserrat_600SemiBold",
	},
});

export default memo(ShortsView);
