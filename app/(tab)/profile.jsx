import { View, Text, FlatList, TouchableOpacity, Platform, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
	bgColor,
	borderLight,
	buttonColor,
	loadingColor,
} from "../../constants/colors";
import HeaderApp from "../../components/HeaderApp";
import { ScrollView } from "react-native-gesture-handler";
import ForYouButtons from "../../components/ForYouButtons";
import { Image } from "expo-image";
import {
	back,
	clapper,
	download,
	getPremium,
	google,
	help,
	incoginito,
	lightbulb,
	nextPage,
	switchAccount,
	watchtime,
	yourVideos,
} from "../../constants/icons";
import MoreButton from "../../components/MoreButton";
import History from "../../components/History";
import { getContext } from "../../context/GlobalContext";
import Toast from "react-native-root-toast";
import { get, onValue, ref } from "firebase/database";
import { authentication, db } from "../../libs/config";
import { router, useFocusEffect } from "expo-router";
import { fetchData } from "../../libs/firebase";
import PlaylistView from "../../components/PlaylistView";
const profile = () => {
	const [isActivated, setIsActivated] = useState(false);

	const {
		user,
		setUser,
		isIcognito,
		setIsIncognito,
		refereshing,
		setRefreshing,
		isConnected,
	} = getContext();
	const [isFocused, setIsFocused] = useState(false);
	useFocusEffect(
		useCallback(() => {
			// console.log(authentication.currentUser);c

			setIsFocused(true);
			setRefreshing(!refereshing);
			return () => {
				// setUser(authentication.currentUser);
				setIsFocused(false);
			};
		}, [])
	);
	useEffect(() => {
		const currestUSer = authentication.currentUser;
		// console.log(currestUSer)
		if (currestUSer) {
			async function getD() {
				const tempdata = await fetchData("playlist/" + user?.uid);
				// console.log(tempdata);
				setplayList([...tempdata]);
			}
			getD();
			setUser(authentication.currentUser);
		}
	}, [isFocused]);
	// console.log(user)
	const [playList, setplayList] = useState([]);
	const incognitoMode = () => {
		if (isConnected) {
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
		} else {
			let toast = Toast.show(
				"You need an internet connection to change account settings",
				{
					duration: Toast.durations.LONG,
				}
			);
			setTimeout(function hideToast() {
				Toast.hide(toast);
			}, 3000);
		}
	};
	const [history, setHistory] = useState([]);
	const { addedToplaylist, setAddedToplaylist } = getContext();
	const [historyShorts, setHistoryShorts] = useState([]);
	useEffect(() => {
		const currestUSer = authentication.currentUser;
		if (currestUSer) {
			async function getD() {
				const tempdata = await fetchData("playlist/" + user?.uid);
				// console.log(tempdata);
				setplayList([...tempdata]);
			}
			getD();
			const videoRef = ref(db, `history/videos/${user?.uid}`);

			const unsubscribe = onValue(videoRef, (snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.val();
					// console.log(snapshot.val())

					setHistory([...data]);
				}
			});

			// Cleanup listener on unmount
			return () => unsubscribe();
		}
	}, [user?.uid, refereshing]);
	useEffect(() => {
		const shortsRef = ref(db, `history/shorts/${user?.uid}`);

		const unsubscribe = onValue(shortsRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val())

				setHistoryShorts([...data]);
			}
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [user?.uid, refereshing]);
	const [userObj, setUserObj] = useState();

	useEffect(() => {
		async function getCover() {
			const detailRef = ref(db, "usersref/" + user?.uid);
			const res = await get(detailRef);
			// console.log(res);

			setUserObj(res.val());
		}
		getCover();
	}, [refereshing]);
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				backgroundColor: bgColor,
				height: "100%",
				paddingTop: insets.top,
			}}
		>
			<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
				<HeaderApp screenName="you" disable={true} />
				<TouchableOpacity
					onPress={() => {
						// console.log(user)
						router.push({ pathname: "userVideos/aboutVids", params: user });
					}}
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
							contentFit="cover"
							style={{
								width: 70,
								height: 70,
								backgroundColor: "#000",
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
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
									width: Dimensions.get("window").width * 0.65,
								}}
							>
								{user?.displayName}
							</Text>
							<View style={{ flexDirection: "row" }}>
								<View style={{}}>
									<Text
										style={{
											color: "white",
											fontSize: 14,
											fontFamily: "Montserrat_300Light",
											flexWrap: 1,
											flexShrink: 1,
											width: Dimensions.get("window").width * 0.65,
											marginVertical: 5,
										}}
									>
										{userObj?.handle ?? "No handle"}
									</Text>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Text
											style={{
												color: buttonColor,
												fontSize: 14,
												fontFamily: "Montserrat_400Regular",
												alignItems: "center",
												justifyContent: "center",

												// flexDirection:"row"lk
											}}
										>
											view channel{" "}
										</Text>
									</View>
								</View>
								<Image
									source={nextPage}
									style={{
										width: 14,
										height: 14,
									}}
									contentFit="contain"
									tintColor={buttonColor}
								/>
							</View>
						</View>
					</View>
				</TouchableOpacity>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<MoreButton
						imageUrl={switchAccount}
						title={"Switch Account"}
						handlePress={() => {
							if (isConnected) router.push("account");
							else {
								let toast = Toast.show(
									"Connect to internet to change account",
									{
										duration: Toast.durations.LONG,
									}
								);
								setTimeout(function hideToast() {
									Toast.hide(toast);
								}, 3000);
							}
						}}
					/>
					<MoreButton imageUrl={google} title={"Google Account"} />
					<MoreButton
						imageUrl={incoginito}
						title={`Turn ${isActivated ? "off" : "on"} incognito`}
						handlePress={incognitoMode}
					/>
				</ScrollView>
				{isConnected && (
					<View style={{ marginBottom: 25 }}>
						<View style={{ marginTop: 25 }}>
							{(history.length > 0 || historyShorts.length > 0) && (
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
									{(history.length >= 3 || historyShorts.length >= 3) && (
										<MoreButton
											title={"View all"}
											color={buttonColor}
											handlePress={() => {
												router.push("userVideos/historyVideos");
											}}
										/>
									)}
								</View>
							)}
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
								{playList.length >= 3 && <MoreButton title={"View all"} />}
							</View>
							<FlatList
								horizontal
								decelerationRate={"fast"}
								showsHorizontalScrollIndicator={false}
								data={playList}
								renderItem={({ item, index }) => {
									return <PlaylistView data={item} />;
								}}
								keyExtractor={(item) => {
									return item.id;
								}}
							/>
						</View>
					</View>
				)}
				<View
					style={{
						borderColor: loadingColor,
						borderBottomWidth: isConnected ? 0.9 : 0,
					}}
				>
					{isConnected && (
						<ForYouButtons
							sourceUrl={yourVideos}
							title={"Your videos"}
							handlePress={() => {
								router.push("userVideos/yourVideos");
							}}
						/>
					)}
					<ForYouButtons sourceUrl={download} title={"Downloads"} handlePress={()=>{
						router.push("downloads");
					}}/>
					{isConnected && (
						<ForYouButtons sourceUrl={lightbulb} title={"Your courses"} />
					)}
					<View style={{ marginBottom: 10 }}></View>
				</View>
				{isConnected && (
					<View style={{ borderColor: loadingColor, borderBottomWidth: 0.9 }}>
						<ForYouButtons sourceUrl={clapper} title={"Your movies"} />
						<ForYouButtons
							sourceUrl={getPremium}
							title={"Get StreaMate premium"}
						/>
						<View style={{ marginBottom: 10 }}></View>
					</View>
				)}
				{isConnected && (
					<View style={{}}>
						<ForYouButtons sourceUrl={watchtime} title={"Time Watched"} />
						<ForYouButtons sourceUrl={help} title={"Help & feedback"} />
						<View style={{ marginBottom: 10 }}></View>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

export default profile;
