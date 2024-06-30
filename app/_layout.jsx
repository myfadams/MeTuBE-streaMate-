import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {SplashScreen, Stack} from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { useFonts } from 'expo-font';
import {
	useFonts,
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
SplashScreen.preventAutoHideAsync()
const _layout = () => {

		const [fontsLoaded] = useFonts({
			Montserrat_100Thin,
			Montserrat_200ExtraLight,
			Montserrat_300Light,
			Montserrat_400Regular,
			Montserrat_500Medium,
			Montserrat_600SemiBold,
			Montserrat_700Bold,
			Montserrat_800ExtraBold,
			Montserrat_900Black,
		});
    useEffect(()=>{
      if(fontsLoaded)
        SplashScreen.hideAsync()
    })
  return (
		<GlobalContext>
			<GestureHandlerRootView>
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
				</Stack>
			</GestureHandlerRootView>
		</GlobalContext>
	);
}

export default _layout