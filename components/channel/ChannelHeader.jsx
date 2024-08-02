import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	Dimensions,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
	addFriend,
	back,
	chromecast,
	edit,
	message,
	nextPage,
	options,
	requestSent,
	search,
	sendChat,
	watchtime,
} from "../../constants/icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
	bgColor,
	borderLight,
	borderPrimary,
	buttonColor,
	fieldColor,
	ldingColor,
	videoColor,
} from "../../constants/colors";
import MoreButton from "../../components/MoreButton";
import OptionsHeader from "./OptionsHeader";
import { getContext } from "../../context/GlobalContext";
import { getSubsriptions, subscribeToChannel } from "../../libs/videoUpdates";
import OtherViewButtons from "../OtherViewButtons";
import { get, ref } from "firebase/database";
import { db } from "../../libs/config";
import { defaultCover } from "../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	addFriendRequest,
	addNewFriend,
	addNewFriendToCache,
	alreadyRecieved,
	checkIfUserIsFriend,
	getAddedFriends,
} from "../../libs/chatFunctions";
import Toast from "react-native-root-toast";

function AboutBtn({ icon, handlepress, type }) {
	return (
		<TouchableOpacity
			onPress={handlepress}
			style={{
				backgroundColor: type ? buttonColor : fieldColor,
				width: 45,
				height: 45,
				borderRadius: Platform.OS === "ios" ? "50%" : 50,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Image
				source={icon}
				contentFit="contain"
				style={{ width: 24, height: 24 }}
				tintColor={"#fff"}
			/>
		</TouchableOpacity>
	);
}
const ChannelHeader = ({ userInfo, act }) => {
	const { user, refereshing, isConnected } = getContext();
	const [userObj, setUserObj] = useState();
	const [cover, setCover] = useState();
	// console.log(userInfo?.from)
	const [isFocused, setIsFocused] = useState(false);
	useEffect(() => {
		async function getCover() {
			const coverPhoto = ref(db, "usersref/" + userInfo?.uid);
			const res = await get(coverPhoto);
			// console.log(res)
			setCover(res.val().coverPhoto);
			setUserObj(res.val());
		}
		getCover();
	}, [refereshing, isFocused]);
	useFocusEffect(
		useCallback(() => {
			async function getCover() {
				const coverPhoto = ref(db, "usersref/" + userInfo?.uid);
				const res = await get(coverPhoto);
				// console.log(res)
				setCover(res.val().coverPhoto);
				setUserObj(res.val());
				setIsFocused(!isFocused);
				return () => {
					setCover(res.val().coverPhoto);
					setUserObj(res.val());
				};
			}
			getCover();
		}, [])
	);

	const [subscribed, setsubscribed] = useState(false);
	const [isFriend, setIsFriend] = useState(false);
	function handleSubscribe() {
		subscribeToChannel(userInfo?.uid, user?.uid);
		getSubsriptions(user?.uid, setsubscribed, userInfo?.uid);
		// console.log("Get sub status: "+subscribed);
	}
	useEffect(() => {
		checkIfUserIsFriend(userInfo?.uid, setIsFriend);
		getSubsriptions(user?.uid, setsubscribed, userInfo?.uid);
	}, []);
	// console.log("subbed: "+subscribed)
	const [hasBeenSentRequest, setHasBeenSentRequest] = useState(false);
	const [isSent, setIsSent] = useState(false);
	useEffect(() => {
		getAddedFriends().then((res) => {
			if (res.includes(userInfo?.uid)) setHasBeenSentRequest(true);
			else setHasBeenSentRequest(false);
		});
	}, [hasBeenSentRequest, isSent]);

	const insets = useSafeAreaInsets();
	return (
		<View>
			<View style={{ alignItems: "center" }}>
				<ImageBackground
					source={cover ? { uri: cover } : defaultCover}
					style={{
						backgroundColor: videoColor,
						width: "100%",
						height: 200,
						borderRadius: 10,
					}}
				>
					<View
						style={{
							// width: "100%",
							marginTop: insets.top,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginHorizontal: Dimensions.get("screen").width * 0.06,
						}}
					>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => {
								router.push("../");
							}}
						>
							<Image
								source={back}
								contentFit="contain"
								style={{ width: 30, height: 30 }}
							/>
						</TouchableOpacity>

						<TouchableOpacity>
							<Image
								source={options}
								style={{ width: 21, height: 21 }}
								contentFit="contain"
							/>
						</TouchableOpacity>
					</View>
				</ImageBackground>
				<Image
					source={{
						uri: userInfo?.photoURL.replace("ChannelsInfo/", "ChannelsInfo%2F"),
					}}
					contentFit="cover"
					style={{
						position: "absolute",
						top: 155,
						right: Dimensions.get("screen").width * 0.06,
						width: 90,
						height: 90,
						backgroundColor: "#000",
						borderRadius: Platform.OS === "ios" ? "50%" : 50,
						borderColor: borderLight,
						borderWidth: 1,
					}}
				/>
				{userInfo?.uid !== user?.uid && (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
							position: "absolute",
							top: 175,
							left: Dimensions.get("screen").width * 0.06,
						}}
					>
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								width: 130,
								height: 53,
								backgroundColor: subscribed ? fieldColor : buttonColor,
								borderWidth: subscribed ? 0.6 : 0,
								borderColor: borderPrimary,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 30,
							}}
						/>
						{!isFriend  ? (
							!userInfo?.from&&<AboutBtn
								icon={hasBeenSentRequest || isSent ? requestSent : addFriend}
								handlepress={async () => {
									// router.push("userVideos/channelSettings");
									if (isConnected) {
										if (!hasBeenSentRequest) {
											const hasAlreadyReceivedreq = await alreadyRecieved(
												userInfo?.uid
											);
											if (!hasAlreadyReceivedreq)
												addFriendRequest(userInfo?.uid).then(() => {
													addNewFriendToCache(userInfo?.uid);
													setIsSent(true);
												});
											else {
												let toast = Toast.show(
													"User already sent a you friends request",
													{
														duration: Toast.durations.LONG,
													}
												);
												setTimeout(function hideToast() {
													Toast.hide(toast);
												}, 3000);
											}
										} else {
											let toast = Toast.show("Request already sent", {
												duration: Toast.durations.LONG,
											});
											setTimeout(function hideToast() {
												Toast.hide(toast);
											}, 3000);
										}
									}
								}}
								type={"addFried"}
							/>
						) : (
							!userInfo?.from&&<AboutBtn
								icon={sendChat}
								handlepress={() => {
									router.push({
										pathname: "chatScreen",
										params: { chatInfo: JSON.stringify(isFriend) },
									});
								}}
								type={"message"}
							/>
						)}
					</View>
				)}
				<View
					style={{
						width: "100%",
						alignItems: "center",
						marginTop: 45,
						paddingHorizontal: Dimensions.get("screen").width * 0.04,
					}}
				>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							alignItems: "center",
							gap: 20,
							marginBottom: 10,
						}}
					>
						<View>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								{userInfo?.displayName}
							</Text>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									{userObj?.handle ?? "No handle"}
								</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: Dimensions.get("screen").width * 0.02,
						}}
					>
						<Text
							numberOfLines={2}
							style={{
								width: "100%",
								alignItems: "center",
								marginVertical: "1.5%",
								flexWrap: "wrap",
								flexDirection: "row",
								color: "#fff",
							}}
						>
							{userObj?.description ?? "This Channel has no desription"}
						</Text>
						<Image
							source={nextPage}
							style={{
								width: 20,
								height: 20,
							}}
							contentFit="contain"
						/>
					</TouchableOpacity>
				</View>
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 4,
						margin: 4,
						paddingHorizontal: Dimensions.get("screen").width * 0.02,
					}}
				>
					{userInfo?.uid === user?.uid && (
						<>
							<View style={{ flex: 1 }}>
								<MoreButton
									title={"Manage videos"}
									height={42}
									color={buttonColor}
									handlePress={() => {
										router.push("/userVideos/yourVideos");
									}}
								/>
							</View>
							<AboutBtn
								icon={edit}
								handlepress={() => {
									router.push("userVideos/channelSettings");
								}}
							/>
							<AboutBtn icon={watchtime} />
						</>
					)}
				</View>
			</View>
		</View>
	);
};

export default ChannelHeader;
