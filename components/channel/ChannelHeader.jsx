import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {
	back,
	chromecast,
	edit,
	nextPage,
	options,
	search,
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
import OptionsHeader from './OptionsHeader';
import { getContext } from '../../context/GlobalContext';
import { getSubsriptions, subscribeToChannel } from '../../libs/videoUpdates';
import OtherViewButtons from '../OtherViewButtons';
import { get, ref } from 'firebase/database';
import { db } from '../../libs/config';
import { defaultCover } from '../../constants/images';
const ChannelHeader = ({userInfo,act}) => {
	const { user, refereshing } = getContext();
	const [userObj,setUserObj]= useState()
	const [cover,setCover]=useState()
	// console.log(userInfo)
	const [isFocused,setIsFocused]=useState(false)
	useEffect(() => {
		async function getCover() {
			const coverPhoto = ref(db, "usersref/" + userInfo?.uid);
			const res = await get(coverPhoto);
			// console.log(res)
			setCover(res.val().coverPhoto);
			setUserObj(res.val())
		}
		getCover();
	}, [refereshing,isFocused]);
	useFocusEffect(useCallback(()=>{
		async function getCover() {
			const coverPhoto = ref(db, "usersref/" + userInfo?.uid);
			const res = await get(coverPhoto);
			// console.log(res)
			setCover(res.val().coverPhoto);
			setUserObj(res.val());
			setIsFocused(!isFocused)
			return ()=>{
				setCover(res.val().coverPhoto);
				setUserObj(res.val());
			}
		}
		getCover();
	}, []))
	
	const [subscribed, setsubscribed] = useState(false);
	function handleSubscribe() {
		subscribeToChannel(userInfo?.uid, user?.uid);
		getSubsriptions(user?.uid, setsubscribed, userInfo?.uid);
		// console.log("Get sub status: "+subscribed);
	}
	useEffect(() => {
	
		getSubsriptions(user?.uid, setsubscribed, userInfo?.uid);
		
	}, []);
	// console.log("subbed: "+subscribed)
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
					source={cover ? { uri: cover } : defaultCover}
					style={{
						backgroundColor: videoColor,
						width: "94%",
						height: 120,
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
							source={{
								uri: userInfo?.photoURL.replace(
									"ChannelsInfo/",
									"ChannelsInfo%2F"
								),
							}}
							resizeMode="cover"
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
							{userObj?.description ?? "This Channel has no desription"}
						</Text>
						<Image
							source={nextPage}
							style={{
								width: 24,
								height: 24,
								
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
					{userInfo?.uid === user?.uid ? (
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
					) : (
						<OtherViewButtons
							title={subscribed ? "Subscribed" : "Subscribe"}
							handlePress={handleSubscribe}
							styles={{
								flex: 1,
								height: 40,
								backgroundColor: subscribed ? fieldColor : buttonColor,
								borderWidth: subscribed ? 0.6 :0,
								borderColor: borderPrimary,
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