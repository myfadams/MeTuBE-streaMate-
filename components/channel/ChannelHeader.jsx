import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
	back,
	chromecast,
	edit,
	options,
	search,
	watchtime,
} from "../../constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import {
	bgColor,
	borderLight,
	buttonColor,
	fieldColor,
	ldingColor,
	videoColor,
} from "../../constants/colors";
import MoreButton from "../../components/MoreButton";
import OptionsHeader from './OptionsHeader';
import { getContext } from '../../context/GlobalContext';
import { getSubsriptions, subscribeToChannel } from '../../libs/videoUpdates';
import OtherViewButtons from '../OtherViewButtons';
const ChannelHeader = ({userInfo,act}) => {
	// console.log(userInfo)
	const {user} = getContext();
	const [subscribed, setsubscribed] = useState(false);
	function handleSubscribe() {
		subscribeToChannel(userInfo?.uid, user?.uid);
		getSubsriptions(user?.uid, setsubscribed, userInfo.uid);
		// console.log("Get sub status: "+subscribed);
	}
	useEffect(() => {
	
		getSubsriptions(user?.uid, setsubscribed, userInfo.uid);
		
	}, []);
	console.log("subbed: "+subscribed)
    function AboutBtn({ icon, handlepress }) {
			return (
				<TouchableOpacity
					onPress={handlepress}
					style={{
						backgroundColor: fieldColor,
						width: 42,
						height: 42,
						borderRadius: Platform.OS === "ios" ? "50%" : 50,
						justifyContent: "center",
						alignItems: "center",
						// position: "absolute",
						opacity: 0.8,
						// top: "2%",
						// left: "2%",
					}}
				>
					<Image
						source={icon}
						resizeMode="contain"
						style={{ width: 25, height: 25 }}
						tintColor={"#fff"}
					/>
				</TouchableOpacity>
			);
		}
  return (
		<View>
			<OptionsHeader userInfo={userInfo} />
			<View style={{ alignItems: "center" }}>
				<Image
					style={{
						backgroundColor: videoColor,
						width: "94%",
						height: 100,
						borderRadius: 10,
					}}
				/>
				<View style={{ width: "100%", alignItems: "center", marginTop: 30 }}>
					<View
						style={{
							width: "97%",
							flexDirection: "row",
							alignItems: "center",
							gap: 20,
							marginBottom: 20,
						}}
					>
						<Image
							source={{ uri: userInfo?.photoURL }}
							resizeMode="contain"
							style={{
								width: 70,
								height: 70,
								backgroundColor: "#000",
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								borderColor: borderLight,
								borderWidth: 1,
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
									@channel_name
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
						}}
					>
						<Text
							numberOfLines={2}
							style={{
								width: "90%",
								alignItems: "center",
								margin: "2%",
								flexWrap: "wrap",
								flexDirection: "row",
								color: "#fff",
							}}
						>
							Regardless of your location, you're legally required to comply
							with the Children's Online Privacy Protection Act (COPPA) and/or
							other laws. You're required to tell us whether your videos are
							made for kids.
						</Text>
						<Image
							source={back}
							style={{
								width: 24,
								height: 24,
								transform: [{ rotate: "180deg" }],
							}}
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
					}}
				>
					{!userInfo.otherChannel || userInfo.uid === user.uid ? (
						<>
							<View style={{ flex: 1 }}>
								<MoreButton
									title={"Manage videos"}
									height={42}
									color={fieldColor}
									handlePress={() => {
										router.push("/userVideos/yourVideos");
									}}
								/>
							</View>
							<AboutBtn icon={edit} />
							<AboutBtn icon={watchtime} />
						</>
					) : (
						
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								flex:1,
								height: 40,
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
			</View>
		</View>
	);
}


export default ChannelHeader