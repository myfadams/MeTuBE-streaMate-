import { View, Text,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'expo-router';
import { add, home, shorts, subsription} from '../../constants/icons';
import { bgColor, buttonColor, fieldColor } from '../../constants/colors';
import { getContext } from '../../context/GlobalContext';
import { getUSerProfile } from '../../libs/firebase';
function TabIcon({ icon, color, name, focused }) {
	const {user} = getContext();
	const [userInfo,setUserInfo]=useState(null)
	// const [userImage, setUserImage] = useState("")
	// console.log(user)

	useEffect(() => {
		async function daTa (){
			if(user && user.emailVerified){
				const getDAta = await getUSerProfile(user.uid);
				setUserInfo(getDAta)

			}
			
		}
		daTa()
		
	}, []);
	
	return (
		<View style={{ justifyContent: "center", alignItems: "center", gap: 1, marginTop:9}}>
			{name !== "You" ? (
				<Image
					source={icon}
					resizeMode="contain"
					tintColor={color} //so this is passed from tab icon
					style={{ width: 25, height: 25 }}
				/>
			) : (
				<Image
					source={{ uri: userInfo?.image }}
					resizeMode="contain"
					style={{
						width: 26,
						height: 26,
						borderWidth: 1,
						borderRadius: "50%",
						borderColor: "#fff",
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
				tabBarInactiveTintColor: "#fff", //for inactive
				tabBarStyle: {
					backgroundColor: bgColor,
					borderTopWidth: 1,
					borderTopColor: fieldColor,
					height: 80,
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
								icon={home}
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
								icon={shorts}
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
							<TabIcon icon={add} color={color} name="" focused={focused} />
						);
					},
				}}
			/>
			<Tabs.Screen
				name="subscription"
				options={{
					headerShown: false,
					tabBarIcon: ({ color, focused }) => {
						return (
							<TabIcon
								icon={subsription}
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