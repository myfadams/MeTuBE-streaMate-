// BottomSheetComponent.js

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Button,
	StyleSheet,
	View,
	Text,
	Keyboard,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Platform,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import {
	bgColor,
	borderLight,
	fieldColor,
	loadingColor,
} from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import CommentsHeader from "./CommentsHeader";
import CommentFooter from "./CommentFooter";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { get, onValue, ref } from "firebase/database";
import { db } from "../libs/config";
import { calculateTimePassed, formatSubs, getLikes, getNumberSubs, getUploadTime } from "../libs/videoUpdates";
import { LinkText } from "./DescriptionComponent";
const windowHeight = Dimensions.get("window").height;
const AboutVideo = ({ isVisible, onClose, isActive, info }) => {
	// console.log(info)
	const [creator, setcreator] = useState();
	const insets = useSafeAreaInsets();
	const commentHeight =
		((windowHeight - 250 - insets.bottom) / windowHeight) * 100;
	const bottomSheetRef = useRef(null);
	const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(-1);
	const [noSubs, setNoSubs] = useState(0);
	// Handle opening the bottom sheet when isVisible changes to true
	// const [creator, setcreator] = useState();
	// useEffect(()=>{
	// 	async function getCre(){
	// 		const crRef = ref(db, `usersref/${info.creator}`);
	// 		let temp = await get(crRef);
	// 		setcreator(temp)
	// 		console.log(temp)
	// 	}
	// 	getCre()
	// },[])
	React.useEffect(() => {
		if (isVisible) {
			bottomSheetRef.current?.expand();
			if (isActive) isActive(true);
		}
	}, [isVisible]);

	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
		Keyboard.dismiss();
		onClose && onClose();
		if (isActive) isActive(false);
	}, [onClose]);

	const handleSheetChanges = useCallback(
		(index) => {
			setCurrentSnapPointIndex(index);

			if (index === 0) {
				bottomSheetRef.current?.close();
				Keyboard.dismiss();
				onClose && onClose();
				if (isActive) isActive(false);
			}

			// Perform other actions based on snap point index if needed
		},
		[onClose]
	);
	const [likes, setlikes] = useState(0);
	useEffect(() => {
		getLikes(info?.videoview, setlikes, "videosRef");
	}, [info?.videoview]);

	const [views, setViews] = useState(0);
	useEffect(() => {
		const videoRef = ref(db, `videosRef/${info.videoview}/views`);

		const unsubscribe = onValue(videoRef, (snapshot) => {
			const data = snapshot.val();
			setViews(data || 0);
		});
		getNumberSubs(info.creator, setNoSubs);
		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [info.videoview]);

	const [timePassed,setTimePassed]=useState()
	useEffect(()=>{
		getUploadTime(info.videoview, "video").then((res) => {
			// console.log(res)
			let time = calculateTimePassed(res);
			// console.log(time)
			setTimePassed(time);
		});
	},[])
	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isVisible ? 0 : -1} // Start at snap point 0 when visible
			// 60%"
			snapPoints={["2%", `${commentHeight}%`]}
			enablePanDownToClose={false}
			onChange={handleSheetChanges}
			backgroundStyle={{
				backgroundColor: bgColor,
			}}
		>
			<View style={{ height: "100%", flex: 1 }}>
				<CommentsHeader handleClose={handleClosePress} text={"Description"} />

				<ScrollView
					contentContainerStyle={{
						width: "100%",
						// height: "100%",
						flexGrow: 1,
						marginTop: 10,
						// justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View style={{ width: "100%", borderTopWidth: 0.6 }}></View>
					<View style={{ width: "96%", marginTop: 30 }}>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontFamily: "Montserrat_500Medium",
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							{info?.title}
						</Text>
					</View>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-around",
							marginTop: 40,
						}}
					>
						<View
							style={{
								justifyContent: "center",
								gap: 5,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: "Montserrat_500Medium",
									// flex:1
								}}
							>
								{formatSubs(likes)}
							</Text>
							<Text
								style={{
									color: loadingColor,
									fontSize: 14,
									fontFamily: "Montserrat_400Regular",
									// flex:1
								}}
							>
								Likes
							</Text>
						</View>
						<View
							style={{
								justifyContent: "center",
								gap: 5,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: "Montserrat_500Medium",
									// flex:1
								}}
							>
								{views}
							</Text>
							<Text
								style={{
									color: loadingColor,
									fontSize: 14,
									fontFamily: "Montserrat_400Regular",
									// flex:1
								}}
							>
								Views
							</Text>
						</View>
						<View
							style={{
								justifyContent: "center",
								gap: 5,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: "Montserrat_500Medium",
									// flex:1
								}}
							>
								{/* {info?.timePassed} */}
								{timePassed}
							</Text>
							<Text
								style={{
									color: loadingColor,
									fontSize: 14,
									fontFamily: "Montserrat_400Regular",
									// flex:1
								}}
							>
								Ago
							</Text>
						</View>
					</View>
					<View
						style={{
							width: "96%",
							marginTop: 30,
							alignItems: "center",
							justifyContent: "center",
							minHeight: 80,
							backgroundColor: fieldColor,
							paddingTop: 15,
							paddingBottom: 15,
							borderRadius: 9,
						}}
					>
						{/* <Text
							style={{
								color: "white",
								fontSize: 15,
								fontFamily: "Montserrat_400Regular",
								flexWrap: "wrap",
								flexDirection: "row",
								paddingLeft: 4,
								paddingRight: 4,
							}}
						>
							{info.videoDescription !== ""
								? info.videoDescription
								: "This video has no description"}
						</Text> */}
						<LinkText text={info.videoDescription !== ""
								? info.videoDescription
								: "This video has no description"}/>
					</View>

					<TouchableOpacity
						style={{
							width: "50%",
							flexDirection: "row",
							marginTop: 30,
							marginBottom: 40,
							alignItems: "center",
							gap: 10,
						}}
					>
						<Image
							source={{ uri: info?.image }}
							style={{
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								width: 45,
								height: 45,
								borderWidth: 0.7,
								borderColor: borderLight,
								backgroundColor: "#000",
							}}
						/>
						<View style={{ gap: 6 }}>
							<Text
								style={{
									color: "white",
									fontSize: 18,
									fontFamily: "Montserrat_600SemiBold",
								}}
							>
								{info?.name}
							</Text>

							<Text
								style={{
									color: "white",
									fontSize: 14,
									fontFamily: "Montserrat_300Light",
								}}
							>
								{formatSubs(noSubs)}{" "}
								{formatSubs(noSubs) === 1 ? "Subscriber" : "Subscribers"}
							</Text>
						</View>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default AboutVideo;
