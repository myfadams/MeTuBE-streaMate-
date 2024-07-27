import { View, Text,TouchableOpacity, Platform } from 'react-native'
import { Image } from "expo-image";
import React, { useEffect, useState } from 'react'
import { logo } from '../constants/images';
import { chromecast, gear, message, search, sub } from '../constants/icons';
import { router } from 'expo-router';
import HomeHeader from './HomeHeader';
import { db } from '../libs/config';
import { getContext } from '../context/GlobalContext';
import { get, ref } from 'firebase/database';

const HeaderApp = ({ screenName, disable,type }) => {
	// console.log(screenName)
	const { user, hasNotifications, setHasNotifications } = getContext();
	// const [hasNotifications,setHasNotifications]=useState(false)
	useEffect(()=>{
		if(user)
		{
			const notificationsRef = ref(db, `notifications/${user?.uid}/noti`);
		async function getNoti(){
			const notificationsSnapshot = await get(notificationsRef);
			if(notificationsSnapshot.exists()){
				const t= notificationsSnapshot.val()
				setHasNotifications(t?.length>0 ?? false)
			}
		}
		getNoti()
		}
	},[user])
	// console.log("noti: "+hasNotifications)
	return (
		<>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginLeft: 6,
						// alignSelf: "flex-start",
					}}
				>
					<Image
						source={logo}
						style={{ width: 105, height: 60 }}
						contentFit="contain"
					/>
					{/* <Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_900Black",
							fontSize: 17,
							marginLeft: 2,
						}}
					>
						StreaMate
					</Text> */}
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginLeft: 7,
						flex: 0.55,
						justifyContent: "space-between",
						// borderWidth:1,
						marginRight: 7,
						// borderColor:"#000"
					}}
				>
					{screenName !== "you" && (
						<TouchableOpacity onPress={()=>{
							router.push("post")
						}}>
							<Image
								source={message}
								style={{ width: 21, height: 21 }}
								contentFit="contain"
								tintColor={"#fff"}
							/>
							<View
								style={{
									height: 7,
									width: 7,
									borderRadius: Platform.OS === "ios" ? "50%" : 50,
									position: "absolute",
									backgroundColor: "red",
									right: 0,
								}}
							></View>
						</TouchableOpacity>
					)}
					<TouchableOpacity>
						<Image
							source={chromecast}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>{
						setHasNotifications(false)
						router.push("notifications")
					}}>
						<Image
							source={sub}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
							tintColor={"#fff"}
						/>
						{hasNotifications&&<View
							style={{
								height: 7,
								width: 7,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								position: "absolute",
								backgroundColor: "red",
								right: 0,
							}}
						></View>}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							router.push("/search/SearchPage");
						}}
					>
						<Image
							source={search}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
					{screenName === "you" && (
						<TouchableOpacity
							onPress={() => {
								router.push("settings");
							}}
						>
							<Image
								source={gear}
								style={{ width: 21, height: 21 }}
								contentFit="contain"
								tintColor={"#fff"}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			{type === "home" && (
				<HomeHeader
					text={[
						"Gaming",
						"Football",
						"Call of Duty: Mobile",
						"Music",
						"Combat sports",
					]}
				/>
			)}
		</>
	);
};

export default HeaderApp