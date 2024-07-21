import { View, Text, Platform } from 'react-native'
import { Image } from "expo-image";
import React, { useEffect, useState } from 'react'
import { Tabs, useFocusEffect } from 'expo-router';
import { add, addFill, home, homeFill, shorts, shortsFill, subsFilled, subsription} from '../../constants/icons';
import { bgColor, borderLight, borderPrimary, buttonColor, fieldColor } from '../../constants/colors';
import { getContext } from '../../context/GlobalContext';
import { getUSerProfile } from '../../libs/firebase';
function TabIcon({ icon, color, name, focused }) {
	const { user, refereshing } = getContext();
	// console.log(user)
	const [userInfo,setUserInfo]=useState(null)
	// const [userImage, setUserImage] = useState("")
	// console.log(user)

	useEffect(() => {
		async function daTa() {
			if (user && user?.emailVerified) {
				const getDAta = await getUSerProfile(user?.uid);
				setUserInfo(getDAta);
			}
		}
		daTa();
	}, [refereshing]);
	
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				gap: 1,
				marginTop: 9,
			}}
		>
			{name !== "You" ? (
				<Image
					source={icon}
					contentFit="contain"
					tintColor={color} //so this is passed from tab icon
					style={{ width: 25, height: 25 }}
				/>
			) : (
				// userInfo?.image
				// user?.photoURL
				<Image
					source={{ uri: userInfo?.image }}
					cachePolicy={'memory-disk'}
					contentFit="cover"
					style={{
						width: 26,
						height: 26,
						borderWidth: 1.3,
						borderRadius: Platform.OS === "ios" ? "50%" : 50,
						borderColor: color,
						backgroundColor: color,
					}}
				/>
			)}
			<Text
				// styles{`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
				style={{
					color: color,
					fontFamily: focused
						? "Montserrat_600SemiBold"
						: "Montserrat_400Regular",
					fontSize: 10.5,
				}}
			>
				{name}
			</Text>
		</View>
	);
}

const TabsLayout = () => {
  return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarActiveTintColor: buttonColor, //so this is passed to set the text color for active
				tabBarInactiveTintColor: "#fff",
				//for inactive'
				tabBarStyle: {
					backgroundColor: fieldColor,
					borderTopWidth: 1,
					borderTopColor: borderPrimary,
					height:Platform.OS==="ios"?80:60,
					paddingBottom:15
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={focused ? homeFill : home}
								color={color}
								name="Home"
								focused={focused}
							/>
						);
					},
				}}
			/>

			<Tabs.Screen
				name="shorts"
				options={{
					
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={focused ? shortsFill : shorts}
								color={color}
								name="Shorts"
								focused={focused}
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={focused ? addFill : add}
								color={color}
								name=""
								focused={focused}
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="subscription"
				options={{
					lazy: false,
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={focused ? subsFilled : subsription}
								color={color}
								name="Subscriptions"
								focused={focused}
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					lazy: false,
					title: "profile",
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={subsription}
								color={color}
								name="You"
								focused={focused}
							/>
						);
					},
				}}
			/>
		</Tabs>
	);
}

export default TabsLayout