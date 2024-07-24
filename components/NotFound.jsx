import { View, Text , ScrollView} from 'react-native'
import { Image } from "expo-image";
import Button from "../components/Button"
import React from 'react'
import { notAvailable, notfoundlogo } from '../constants/images';
import { buttonColor, loadingColor } from '../constants/colors';
import { router } from 'expo-router';
import MoreButton from './MoreButton';
import { getContext } from '../context/GlobalContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotFound = ({ type, channelInfoID }) => {
	const { user } = getContext();
	// console.log("cgh: "+channelInfoID);#
	const insets= useSafeAreaInsets();
	return (
		<View
			style={{
				flex:1,
				justifyContent: "center",
				height: "100%",
				marginBottom:insets.bottom
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					borderColor: "black",
					marginTop: 50,
				}}
			>
				<View style={{ width: "100%", height: 300 }}>
					<Image
						source={type ? notAvailable : notfoundlogo}
						tintColor={!type && buttonColor}
						style={{ width: "100%", height: 300 }}
						contentFit="contain"
					/>
				</View>
				<View style={{ marginTop: 20, marginBottom: 20 }}>
					<Text
						style={{
							fontFamily: "Montserrat_700Bold",
							fontSize: 25,
							color: "white",
							textAlign: "center",
							fontWeight: "600",
						}}
					>
						{!type && "No videos found"}
					</Text>
					<Text
						style={{
							fontFamily: "Montserrat_300Light,",
							fontSize: 16,
							color: loadingColor,
							marginTop: 12,
							textAlign: "center",
						}}
					>
						{type
							? "Share your videos with anyone or everyone"
							: "Be the first to upload on StreaMate"}
					</Text>
				</View>
				{/* <Button
					title={"Create A Video"}
					handlePress={() => {
						router.push("create");
					}}
				/> */}
				{channelInfoID===user?.uid&&<View style={{ width: "97%" }}>
					<MoreButton
						title={"Create A Video"}
						height={60}
						color={buttonColor}
						handlePress={() => {
							if (!type) router.push("create");
							else {
								router.replace("create");
							}
						}}
						typeauth={"auth"}
					/>
				</View>}
			</View>
		</View>
	);
};

export default NotFound