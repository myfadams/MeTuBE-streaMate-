import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {SplashScreen, Stack} from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { useFonts } from 'expo-font';
import {
	// useFonts,
	Montserrat_100Thin,
	Montserrat_200ExtraLight,
	Montserrat_300Light,
	Montserrat_400Regular,
	Montserrat_500Medium,
	Montserrat_600SemiBold,
	Montserrat_700Bold,
	Montserrat_800ExtraBold,
	Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { GlobalContext } from '../context/GlobalContext';
import { bgColor } from '../constants/colors';
SplashScreen.preventAutoHideAsync()
const _layout = () => {
		const [fontsLoaded] = useFonts({
			Montserrat_100Thin: require("../assets/fonts/Montserrat-Thin.ttf"),
			Montserrat_200ExtraLight: require("../assets/fonts/Montserrat-ExtraLight.ttf"),
			Montserrat_300Light: require("../assets/fonts/Montserrat-Light.ttf"),
			Montserrat_400Regular: require("../assets/fonts/Montserrat-Regular.ttf"),
			Montserrat_500Medium: require("../assets/fonts/Montserrat-Medium.ttf"),
			Montserrat_600SemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
			Montserrat_700Bold: require("../assets/fonts/Montserrat-Bold.ttf"),
			Montserrat_800ExtraBold: require("../assets/fonts/Montserrat-ExtraBold.ttf"),
			Montserrat_900Black: require("../assets/fonts/Montserrat-Black.ttf"),
		});
		// const [fontsLoaded] = useFonts({
		// 	Montserrat_100Thin,
		// 	Montserrat_200ExtraLight,
		// 	Montserrat_300Light,
		// 	Montserrat_400Regular,
		// 	Montserrat_500Medium,
		// 	Montserrat_600SemiBold,
		// 	Montserrat_700Bold,
		// 	Montserrat_800ExtraBold,
		// 	Montserrat_900Black,
		// });
    useEffect(()=>{
		// configureAudio(); 
      if(fontsLoaded)
        SplashScreen.hideAsync()
    })
  return (
		<GlobalContext>
			<GestureHandlerRootView>
				<RootSiblingParent>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen
							name="index"
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="(auth)"
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="(tab)"
							options={{
								headerShown: false,
								gestureEnabled: false,
							}}
						/>

						<Stack.Screen
							name="upload/[uploadFeatures]"
							options={{
								headerShown: false,
								gestureEnabled: false,
							}}
						/>
						<Stack.Screen
							name="settings"
							options={{
								// gestureResponseDistance: { vertical: 10 },
								headerShown: false,
								gestureEnabled: true,
								gestureDirection: "vertical",
								presentation: "card",
							}}
						/>
						<Stack.Screen
							name="account"
							options={{
								gestureResponseDistance: { vertical: 0 },
								headerShown: false,
								gestureDirection: "vertical",
								presentation: "card",
							}}
						/>
						<Stack.Screen
							name="video/[videoview]"
							options={{
								gestureResponseDistance: { vertical: 0 },
								headerShown: false,
								gestureDirection: "vertical",
								presentation: "card",
							}}
						/>
						
					</Stack>
				</RootSiblingParent>
			</GestureHandlerRootView>
		</GlobalContext>
	);
}

export default _layout