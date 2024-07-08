import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, borderLight, loadingColor } from "../../constants/colors";
import HeaderApp from "../../components/HeaderApp";
import { ScrollView } from "react-native-gesture-handler";
import ForYouButtons from "../../components/ForYouButtons";
import {
	back,
	clapper,
	download,
	getPremium,
	google,
	help,
	incoginito,
	lightbulb,
	switchAccount,
	watchtime,
	yourVideos,
} from "../../constants/icons";
import MoreButton from "../../components/MoreButton";
import History from "../../components/History";
import { getContext } from "../../context/GlobalContext";
import Toast from "react-native-root-toast";
import { onValue, ref } from "firebase/database";
import { db } from "../../libs/config";
import { router } from "expo-router";
const profile = () => {
	const [isActivated, setIsActivated] = useState(false);
	const { user, isIcognito, setIsIncognito } = getContext();
	const incognitoMode = () => {
		setIsIncognito(!isIcognito);
		setIsActivated(!isActivated);
		if (!isActivated) {
			let toast = Toast.show("Videos will not be in your history", {
				duration: Toast.durations.LONG,
			});
			setTimeout(function hideToast() {
				Toast.hide(toast);
			}, 3000);
		} else {
			let toast = Toast.show("Incognito mode turned off", {
				duration: Toast.durations.LONG,
			});
			setTimeout(function hideToast() {
				Toast.hide(toast);
			}, 3000);
		}
	};
	const [history, setHistory] = useState([]);
	const [historyShorts, setHistoryShorts] = useState([]);
	useEffect(() => {
		const videoRef = ref(db, `history/videos/${user?.uid}`);

		const unsubscribe = onValue(videoRef, (snapshot) => {
			if(snapshot.exists()){
				const data = snapshot.val();
				// console.log(snapshot.val())

				setHistory([...data]);
			}
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [user?.uid]);
	useEffect(() => {
		const shortsRef = ref(db, `history/shorts/${user?.uid}`);

		const unsubscribe = onValue(shortsRef, (snapshot) => {
			if(snapshot.exists()){
				const data = snapshot.val();
				// console.log(snapshot.val())

				setHistoryShorts([...data]);
			}
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [user?.uid]);
	// console.log(historyShorts)
	// history.reverse();
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
				<HeaderApp screenName="you" disable={true} />
				<TouchableOpacity
					style={{ width: "100%", alignItems: "center", marginTop: 30 }}
				>
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
							source={{ uri: user?.photoURL }}
							resizeMode="contain"
							style={{
								width: 70,
								height: 70,
								backgroundColor: "#000",
								borderRadius: "50%",
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
								{user?.displayName}
							</Text>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									@channel_name {" . "}
								</Text>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
										alignItems: "center",
										justifyContent: "center",
										// flexDirection:"row"
									}}
								>
									view channel{" "}
									<Image
										source={back}
										style={{
											width: 14,
											height: 14,
											transform: [{ rotate: "180deg" }],
										}}
									/>
								</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<MoreButton
						imageUrl={switchAccount}
						title={"Switch Account"}
						handlePress={() => {
							router.push("account");
						}}
					/>
					<MoreButton imageUrl={google} title={"Google Account"} />
					<MoreButton
						imageUrl={incoginito}
						title={`Turn ${isActivated ? "off" : "on"} incognito`}
						handlePress={incognitoMode}
					/>
				</ScrollView>
				<View style={{ marginBottom: 25 }}>
					<View style={{ marginTop: 25 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginLeft: "2%",
								marginRight: "2%",
								justifyContent: "space-between",
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									marginBottom: 8,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								History
							</Text>
							<MoreButton title={"View all"} />
						</View>
						<FlatList
							horizontal
							decelerationRate={"fast"}
							showsHorizontalScrollIndicator={false}
							data={history.slice(0, 5)}
							renderItem={({ item, index }) => {
								// if(index===0)

								return <History data={item} />;
							}}
							keyExtractor={(item) => item?.videoview}
						/>
						<FlatList
							horizontal
							decelerationRate={"fast"}
							showsHorizontalScrollIndicator={false}
							data={historyShorts?.slice(0, 5)}
							renderItem={({ item, index }) => {
								// if(index===0)

								return <History data={item} type={"shorts"} />;
							}}
							keyExtractor={(item) => item?.id}
						/>
					</View>
					<View style={{ marginTop: 25 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginLeft: "2%",
								marginRight: "2%",
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									marginBottom: 8,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								Playlist
							</Text>
							<MoreButton title={"View all"} />
						</View>
						<FlatList
							horizontal
							decelerationRate={"fast"}
							showsHorizontalScrollIndicator={false}
							data={[1, 2, 3, 4, 5, 6]}
							renderItem={({ item, index }) => {
								return <History />;
							}}
						/>
					</View>
				</View>
				<View style={{ borderColor: loadingColor, borderBottomWidth: 0.9 }}>
					<ForYouButtons sourceUrl={yourVideos} title={"Your videos"} />
					<ForYouButtons sourceUrl={download} title={"Downloads"} />
					<ForYouButtons sourceUrl={lightbulb} title={"Your courses"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
				<View style={{ borderColor: loadingColor, borderBottomWidth: 0.9 }}>
					<ForYouButtons sourceUrl={clapper} title={"Your movies"} />
					<ForYouButtons sourceUrl={getPremium} title={"Get MeTuBE premium"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
				<View style={{}}>
					<ForYouButtons sourceUrl={watchtime} title={"Time Watched"} />
					<ForYouButtons sourceUrl={help} title={"Help & feedback"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default profile;
