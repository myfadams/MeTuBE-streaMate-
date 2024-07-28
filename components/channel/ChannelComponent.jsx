import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
	formatSubs,
	getSubsriptions,
	subscribeToChannel,
} from "../../libs/videoUpdates";
import OtherViewButtons from "../OtherViewButtons";
import { borderLight, buttonColor, fieldColor } from "../../constants/colors";
import { get, ref } from "firebase/database";
import { authentication, db } from "../../libs/config";
import { getContext } from "../../context/GlobalContext";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
const ChannelComponent = ({ channel,type }) => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [noSubs, setNoSubs] = useState();
	const { user } = getContext();
	// console.log(channel)
	function handleSubscribe() {
		subscribeToChannel(channel?.id, user?.uid);
		getSubsriptions(user?.uid, setIsSubscribed, channel.id);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	}
	useEffect(() => {
		const currestUSer = authentication.currentUser;
		if (currestUSer) {
			const usersRef = ref(db, `subs/users/${user?.uid}/subscriptions`);
			const subsRef = ref(db, `subs/channel/${channel?.id}/subscribers`);
			async function getSubs() {
				const subs = await (await get(usersRef)).val();
				const subscribers = await (await get(subsRef)).val();
				// console.log(susbcribers)
				setNoSubs(subscribers?.length ?? "No");
				if (subs?.includes(channel?.id)) {
					// console.log("is true")
					setIsSubscribed(true);
				}
			}

			getSubs();
		}
	}, []);
	// console.log(isSubscribed);
	return (
		<TouchableOpacity
			onPress={() => {
				router.push({
					pathname: "userVideos/aboutVids",
					params: {
						uid: channel?.id,
						photoURL: channel?.image,
						displayName: channel?.name,
					},
				});
			}}
			style={{
				width: "100%",
				alignItems: "center",
				// marginTop: 15,
				// paddingTop: 15,
				// borderTopWidth: 0.7,
				// borderColor: borderLight,
			}}
		>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					alignItems: "center",
					gap: 5,
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<Image
					source={{
						uri: !type
							? channel?.image
							: channel?.image?.replace("/ChannelsInfo/", "/ChannelsInfo%2F"),
					}}
					contentFit="contain"
					style={{
						width: 70,
						height: 70,
						backgroundColor: "#000",
						borderColor: borderLight,
						borderWidth: 1,
						borderRadius: Platform.OS === "ios" ? "50%" : 50,
					}}
				/>
				<View
					style={{
						width: Dimensions.get("window").width * 0.45,
						alignItems: "center",
					}}
				>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 16,
							fontFamily: "Montserrat_500Medium,",
							flexWrap: "wrap",
							// width:Dimensions.get("window").width*0.5,
							marginBottom: 5,
							flexDirection: "row",
						}}
					>
						{/* {channel?.name} */}
						{channel?.handle ?? channel?.name}
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 13,
							fontFamily: "Montserrat_300Light",
						}}
					>
						{formatSubs(noSubs)}{" "}
						{formatSubs(noSubs) <= 1 ? "subscriber" : "subscribers"}
					</Text>
				</View>
				<OtherViewButtons
					title={isSubscribed ? "Subscribed" : "Subscribe"}
					handlePress={handleSubscribe}
					styles={{
						width: 100,
						height: 45,
						backgroundColor: isSubscribed ? fieldColor : buttonColor,
						borderWidth: isSubscribed ? 0.6 : 0,
						borderColor: borderLight,
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 30,
					}}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default ChannelComponent;
