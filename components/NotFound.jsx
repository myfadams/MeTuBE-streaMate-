import { View, Text ,Image, ScrollView} from 'react-native'
import Button from "../components/Button"
import React from 'react'
import { notfoundlogo } from '../constants/images';
import { buttonColor, loadingColor } from '../constants/colors';
import { router } from 'expo-router';
import MoreButton from './MoreButton';

const NotFound = () => {
  return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
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
						source={notfoundlogo}
						tintColor={"#fff"}
						style={{ width: "100%", height: 300 }}
						resizeMode="contain"
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
						No videos found
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
						Be the first to upload on MeTube
					</Text>
				</View>
				{/* <Button
					title={"Create A Video"}
					handlePress={() => {
						router.push("create");
					}}
				/> */}
				<View style={{ width: "97%" }}>
					<MoreButton
						title={"Create A Video"}
						height={60}
						color={buttonColor}
						handlePress={() => {
							router.push("create");
						}}
						typeauth={"auth"}
					/>
				</View>
			</View>
		</ScrollView>
	);
}

export default NotFound