import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getContext } from '../../context/GlobalContext';
import { Redirect, SplashScreen } from 'expo-router';
import { bgColor } from '../../constants/colors';
import { getUSerProfile } from '../../libs/firebase';

const home = () => {	
	
	const { user, setUsrInfo, usrInfo } = getContext();
	if(!user  || user && !user.emailVerified)
		return <Redirect href="sign-in"/>
  return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<Text>home</Text>
		</SafeAreaView>
	);
}

export default home