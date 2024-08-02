import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";

import { get, ref } from "firebase/database";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { authentication, db } from "../libs/config";
import { formatSubs } from "../libs/videoUpdates";
import { borderLight, buttonColor, fieldColor } from "../constants/colors";
import { getContext } from "../context/GlobalContext";
import OtherViewButtons from "./OtherViewButtons";
import { AboutBtn } from "./AbtBtn";
import { close } from "../constants/icons";
import {
	acceptRequest,
	removeFriendRequest,
	removeRequestNotifications,
} from "../libs/chatFunctions";
const FriendsRequestComponent = ({ channel, type, reload, setReload }) => {
	const [noSubs, setNoSubs] = useState();
	const { user } = getContext();
	// console.log(channel)
	const [remove, setRemove] = useState(false);
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
			}

			getSubs();
		}
	}, []);
	// console.log(isSubscribed);
	return (
		<>
			{!remove && (
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
							// gap: 5,
							justifyContent: "space-between",
							marginBottom: 20,
						}}
					>
						<Image
							source={{
								uri: !type
									? channel?.image
									: channel?.image?.replace(
											"/ChannelsInfo/",
											"/ChannelsInfo%2F"
									  ),
							}}
							contentFit="contain"
							style={{
								width: 60,
								height: 60,
								backgroundColor: "#000",
								borderColor: borderLight,
								borderWidth: 1,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
							}}
						/>
						<View
							style={{
								maxWidth: Dimensions.get("window").width * 0.35,
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
						<View style={{ flexDirection: "row", gap: 8 }}>
							<OtherViewButtons 
                                isActive={remove}
								title={"Accept"}
								handlePress={() => {
									acceptRequest(channel?.id).then(() => {
										setRemove(true);
										setReload(!reload);
										removeFriendRequest(channel?.id);
									});
								}}
								styles={{
									width: 90,
									height: 45,
									backgroundColor: buttonColor,
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 30,
								}}
							/>
							<AboutBtn
                                disabled={remove}
								handlepress={() => {
									removeFriendRequest(channel?.id).then(() => {
										setRemove(true);
										setReload(!reload);
									});
								}}
								bColor={fieldColor}
								btnHeight={45}
								btnWidth={45}
								imgHeight={24}
								imgWidth={24}
								icon={close}
							/>
						</View>
					</View>
				</TouchableOpacity>
			)}
		</>
	);
};

export default FriendsRequestComponent;
