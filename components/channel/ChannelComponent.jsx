import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { formatSubs } from "../../libs/videoUpdates";
import OtherViewButtons from "../OtherViewButtons";
import { borderLight, buttonColor, fieldColor } from "../../constants/colors";
import { get, ref } from "firebase/database";
import { db } from "../../libs/config";
import { getContext } from "../../context/GlobalContext";
import { router } from "expo-router";

const ChannelComponent = ({ channel }) => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [noSubs, setNoSubs] = useState();
	const { user } = getContext();
	// console.log(user.uid)
	function handleSubscribe() {
		subscribeToChannel(channel?.id, user?.uid);
		// getSubsriptions(user?.uid, setIsSubscribed, channel.id);
	}
	useEffect(() => {
		const usersRef = ref(db, `subs/users/${user?.uid}/subscriptions`);
		const subsRef = ref(db, `subs/channel/${channel?.id}/subscribers`);
		async function getSubs() {
			const subs = await (await get(usersRef)).val();
			const subscribers = await (await get(subsRef)).val();
			// console.log(susbcribers)
			setNoSubs(subscribers?.length);
			if (subs?.includes(channel?.id)) {
                // console.log("is true")
				setIsSubscribed(true);
			}
		}
		getSubs();
	}, []);
	console.log(isSubscribed);
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
				marginTop: 15,
				paddingTop: 15,
				borderTopWidth: 0.7,
				borderColor: borderLight,
			}}
		>
			<View
				style={{
					width: "97%",
					flexDirection: "row",
					// alignItems: "center",
					gap: 20,
					marginBottom: 20,
				}}
			>
				<Image
					source={{ uri: channel?.image }}
					resizeMode="contain"
					style={{
						width: 60,
						height: 60,
						backgroundColor: "#000",
						borderColor: borderLight,
						borderWidth: 1,
						borderRadius: Platform.OS === "ios" ? "50%" : 50,
					}}
				/>
				<View>
					<Text
						numberOfLines={2}
						style={{
							color: "white",
							fontSize: 20,
							fontFamily: "Montserrat_600SemiBold",
							flexWrap: "wrap",
							marginBottom: 5,
							flexDirection: "row",
						}}
					>
						{channel?.name}
					</Text>
					<View
						style={{
							gap: 30,
							flexDirection: "row",
							marginTop: 10,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View style={{ gap: 5 }}>
							<Text
								style={{
									color: "white",
									fontSize: 14,
									fontFamily: "Montserrat_300Light",
								}}
							>
								{channel?.handle ?? "No handle"}
							</Text>
							<Text
								style={{
									color: "white",
									fontSize: 14,
									fontFamily: "Montserrat_300Light",
								}}
							>
								{formatSubs(noSubs)}{" "}
								{formatSubs(noSubs) === 1 ? "Subscriber" : "Subscribers"}
							</Text>
						</View>

						<OtherViewButtons
							title={isSubscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								width: 100,
								height: 35,
								backgroundColor: isSubscribed ? fieldColor : buttonColor,
								borderWidth: isSubscribed ? 0.6 : 0,
								borderColor: borderLight,
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 30,
							}}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default ChannelComponent;
