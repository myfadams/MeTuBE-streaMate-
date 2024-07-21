import { View, Text, TouchableOpacity, Platform} from "react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import { borderLight, buttonColor, fieldColor, loadingColor } from "../constants/colors";
import OtherViewButtons from "./OtherViewButtons";
import BottomSheetComponent from "./CommentSection";
import ScrollButtons from "./ScrollButtons";
import { getContext } from "../context/GlobalContext";
import { formatSubs, formatViews, getNumberSubs, getSubsriptions, setDisLikeStatus, setLikeStatus, subscribeToChannel } from "../libs/videoUpdates";

import { ref, onValue, get } from "firebase/database";
import { db } from "../libs/config";
import { router, useFocusEffect } from "expo-router";
import { shuffleArray } from "../libs/sound";

const VidHeader = ({ comment, about,vidinfo}) => {
	// console.log(vidinfo)
	const { user } = getContext();
	const [subscribed, setsubscribed] = useState(false);
	const [noSubs,setNoSubs]=useState(0)
	const [views, setViews] = useState(0);
	const [like, setlike] = useState(false)
	const [dislike, setdislike] = useState(false);
	const [latestComment, setLatestComment] = useState();
	const [noComments, setNoComments] = useState();
	useEffect(() => {
		const videoRef = ref(db, `videosRef/${vidinfo.videoview}/views`);
		getSubsriptions(user?.uid, setsubscribed, vidinfo.creator);
		const unsubscribe = onValue(videoRef, (snapshot) => {
			const data = snapshot.val();
			setViews(data || 0);
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [vidinfo?.videoview]);
	useEffect(() => {
		const videoCommentRef = ref(db, `commentsRef/${vidinfo?.videoview}`);
		const unsubscribe = onValue(videoCommentRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val())
				const commentsWithInfo = [];
				data.forEach(async (comment) => {
					const commenterRef = ref(db, `usersref/${comment?.commenterID}`);
					const commenterInfo = await (await get(commenterRef)).val();
					// console.log(commenterInfo)
					commentsWithInfo.push({
						...comment,
						name: commenterInfo.name,
						handle: commenterInfo?.handle,
						image: commenterInfo?.image,
					});
					setNoComments(commentsWithInfo?.length)
					setLatestComment(shuffleArray(commentsWithInfo)[0]);
				});
			}
		});

		// Cleanup listener on unmountjj
		return () => unsubscribe();
	}, [user?.uid]);
	// console.log(latestComment)
	useEffect(() => {
		// const chSubsRef = ref(db, `subs/channel/${vidinfo.creator}/subscribers`);
		// getSubsriptions(user.uid, setsubscribed, vidinfo.creator);
		// const unsubscribe = onValue(chSubsRef, (snapshot) => {
		// 	if(snapshot.exists()){
		// 		const data = snapshot.val().length;
		// 		setNoSubs(data);
		// 	}else{
		// 		setNoSubs(0);

		// 	}
		// });

		// // Cleanup listener on unmount
		// return () => unsubscribe();
		getNumberSubs(vidinfo.creator, setNoSubs)
		setLikeStatus(vidinfo.videoview, setlike, user?.uid, "videosRef");
		setDisLikeStatus(vidinfo.videoview, setdislike, user?.uid, "videosRef");
	}, [vidinfo.videoview]);
	// console.log(vidinfo)
	// console.log("the namei s: "+like)
	function handleSubscribe(){
		subscribeToChannel(vidinfo?.creator, user?.uid);
		getSubsriptions(user?.uid, setsubscribed, vidinfo.creator); 
		// console.log("Get sub status: "+subscribed);
	}
	console.log(latestComment)
	return (
		<View
			style={{
				width: "100%",
				alignItems: "center",
			}}
		>
			<TouchableOpacity
				onPress={about}
				activeOpacity={0.8}
				style={{
					width: "96%",
					marginTop: 15,
					borderRadius: Platform.OS === "ios" ? "5%" : 5,
				}}
			>
				<Text
					numberOfLines={1}
					style={{
						color: "white",
						fontSize: 20,
						fontFamily: "Montserrat_600SemiBold",
						flexWrap: "wrap",
						flexDirection: "row",
					}}
				>
					{vidinfo.title}
				</Text>
				<View
					style={{
						marginTop: 15,
						flexDirection: "row",
						width: "100%",
						gap: 15,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						{formatViews(views)}
					</Text>

					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						{vidinfo.timePassed} ago
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						...more
					</Text>
				</View>
			</TouchableOpacity>
			<View
				style={{
					width: "96%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					margin: 15,
				}}
			>
				<TouchableOpacity
					onPress={()=>{
						router.push({
							pathname: "userVideos/aboutVids",
							params: { uid: (vidinfo.id??vidinfo.creator), photoURL:vidinfo.image,displayName:vidinfo.name},
						});
					}}
					style={{
						width: "50%",
						flexDirection: "row",
						alignItems: "center",
						gap: 10,
					}}
				>
					<Image
						source={{ uri: vidinfo?.image }}
						style={{
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							width: 45,
							borderWidth: 0.7,
							borderColor: borderLight,
							height: 45,
							backgroundColor: "#000",
						}}
						contentFit="cover"
					/>
					<View style={{ flexDirection: "row", gap: 10 }}>
						<Text
							numberOfLines={1}
							style={{
								color: "white",
								// width: "70%",
								// flex:0.7,
								flexShrink: 1,
								fontSize: 14,
								fontFamily: "Montserrat_600SemiBold",
							}}
						>
							{vidinfo?.name}
						</Text>

						<Text
							numberOfLines={1}
							style={{
								color: "white",
								flexShrink: 1,
								fontSize: 14,
								fontFamily: "Montserrat_300Light",
							}}
						>
							{/* 4.7M */}
							{formatSubs(noSubs)}
						</Text>
					</View>
				</TouchableOpacity>
				<View>
					{vidinfo.creator !== user?.uid && (
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								width: 100,
								height: 35,
								backgroundColor: subscribed ? fieldColor : buttonColor,
								borderWidth: subscribed? 0.6:0,
								borderColor: borderLight,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 30,
							}}
						/>
					)}
				</View>
			</View>
			{/* //my ScrollButtons */}
			<ScrollButtons
				videoId={vidinfo.videoview}
				userId={user?.uid}
				likeStatus={like}
				disLikeStatus={dislike}
			/>
			<TouchableOpacity
				onPress={comment}
				activeOpacity={0.6}
				style={{
					width: "96%",
					// height: 80,

					backgroundColor: fieldColor,
					marginTop: 10,
					borderRadius: Platform.OS === "ios" ? "10%" : 10,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 10,
						margin: 10,
						marginBottom: 0,
					}}
				>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 16,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						Comments
					</Text>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_400Regular",
						}}
					>
						{noComments}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 10,
						width: "100%",
						margin: 10,
					}}
				>
					{latestComment&&<Image
						source={{uri:latestComment?.image}}
						contentFit="cover"
						style={{
							width: 30,
							height: 30,
							backgroundColor: "#000",

							borderRadius: Platform.OS === "ios" ? "50%" : 50,
						}}
					/>}
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						style={{
							color: "white",
							fontSize: 14.5,
							fontFamily: "Montserrat_400Regular",
							flexWrap: "wrap",
							flexDirection: "row",
							
							flex: 1,
						}}
					>
						{latestComment?.text ?? "No comments available for this video"}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default VidHeader;
