import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Alert,
	Platform,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { accountSetting, addAccount, checkMark, close, signout } from "../constants/icons";
import { bgColor, borderLight, buttonColor } from "../constants/colors";
import { getContext } from "../context/GlobalContext";
import MoreButton from "../components/MoreButton";
import ForYouButtons from "../components/ForYouButtons";
import {
	signInWithCredential,
	signOut,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { authentication, db } from "../libs/config";
import { formatSubs, getNumberSubs } from "../libs/videoUpdates";
import { get, ref } from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStoredAccountIds } from "../libs/otherFunctions";
import Toast from "react-native-root-toast";
import { setRequests } from "../libs/chatFunctions";

function OtherAccount({ accInfo, handleSwitchAccount }) {
	return (
		<View>
			<Text
				style={{
					color: borderLight,
					fontSize: 14,
					marginBottom: 12,
					// fontWeight:"600",
					fontFamily: "Montserrat_400Regular",
					alignItems: "center",
					justifyContent: "center",
					marginLeft: "3%",
					// flexDirection:"row"
				}}
			>
				{accInfo?.email}
			</Text>
			<TouchableOpacity
				onPress={() => {
					handleSwitchAccount(accInfo);
				}}
				style={{
					width: "100%",
					alignItems: "center",
					marginTop: 15,
				}}
			>
				<View
					style={{
						width: "97%",
						flexDirection: "row",
						// alignItems: "center",
						gap: 20,
						marginBottom: 20,
					}}
				>
					<Image
						source={{ uri: accInfo?.image }}
						contentFit="contain"
						style={{
							width: 50,
							height: 50,
							backgroundColor: "#000",
							borderColor: borderLight,
							borderWidth: 1,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
						}}
					/>
					<View style={{ gap: 8 }}>
						<Text
							numberOfLines={2}
							style={{
								color: "white",
								fontSize: 20,
								fontFamily: "Montserrat_500Medium",
								flexWrap: "wrap",
								marginBottom: 5,
								flexDirection: "row",
							}}
						>
							{accInfo?.name}
						</Text>

						<Text
							style={{
								color: "white",
								fontSize: 14,
								fontFamily: "Montserrat_300Light",
							}}
						>
							{accInfo?.handle ?? "No handle"}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
}
const AccountInfo = () => {
	const { user, setUser } = getContext();
	const [noSubs, setNoSubs] = useState(0);
	const [otherAcc, setOtherAcc] = useState([]);
	useEffect(() => {
		const cUSer = authentication.currentUser;
		if (cUSer) {
			getNumberSubs(user?.uid, setNoSubs);
			function returnSubNo(subNo) {
				// console.log(subNo);
				return subNo;
			}
			getStoredAccountIds().then(async (accounts) => {
				// Filter out the current user's ID
				const altAccounts = accounts.filter((acc) => acc.uid !== user?.uid);

				// Prepare an array of promises for fetching details
				const detailPromises = altAccounts.map(async (acc) => {
					const inforef = ref(db, "usersref/" + acc?.uid);
					const d = await get(inforef);
					getNumberSubs(acc?.uid, returnSubNo);
					return { ...d.val(), credential: acc?.credential }; // Return the data for each account
				});

				try {
					// Wait for all promises to resolve
					const altDetails = await Promise.all(detailPromises);
					// console.log(altDetails[0]);
					setOtherAcc(altDetails);
					// Log the details once all promises are resolved
				} catch (error) {
					console.error("Error fetching account details:", error);
				}
			});
		}
	}, [user]);
	const handleSignOut = () => {
		signOut(authentication)
			.then(() => {
				Alert.alert("Signed Out", "You have been signed out successfully.");
				// while (router.canGoBack()) { router.back() }
				router.dismissAll();
				router.replace("sign-in");

				// Perform any additional actions like navigating to the login screen
			})
			.catch((error) => {
				Alert.alert("Error", error.message);
			});
	};
	const [chInfo, setChInfo] = useState();
	useEffect(() => {
		const cUSer = authentication.currentUser;
		if (cUSer) {
			async function getCover() {
				const inforef = ref(db, "usersref/" + user?.uid);
				const res = await get(inforef);
				// console.log(res)
				setChInfo(res.val());
			}
			getCover();
		}
	}, []);
	const [isSwitching,setIsSwitching]=useState(false)
	const handleSwitchAccount = async (accInfo) => {
		try {
			// Sign out the current user
			setIsSwitching(true)
			await signOut(authentication);

			// Show a toast message indicating account switch
			const toast = Toast.show("Switching accounts", {
				duration: Toast.durations.LONG,
			});

			// Sign in with the new credentials
			const userCredential = await signInWithEmailAndPassword(
				authentication,
				accInfo.credential.email,
				accInfo.credential.password
			);
			const user = userCredential.user;

			// Update user state and show success toast
			setUser(user);
			Toast.show("Switched to " + accInfo.name, {
				duration: Toast.durations.LONG,
			});

			await setRequests()
			// Hide toast after 3 seconds
			setTimeout(() => Toast.hide(toast), 3000);
			setIsSwitching(false);
		} catch (error) {
			// Handle errors
			Alert.alert("Error", error.message);
			console.log(error);

		}
		setIsSwitching(false);
	};
	
	return (
		<SafeAreaView
			style={{
				flex: 1,
				// alignItems: "center",
				// justifyContent: "center",
				backgroundColor: bgColor,
			}}
		>
			<View
				style={{
					flexDirection: "row",

					alignItems: "center",
					width: "100%",
					gap: 10,
				}}
			>
				<TouchableOpacity
					style={{ justifyContent: "center", marginLeft: 15 }}
					disabled={isSwitching}
					onPress={() => {
						router.push("../");
					}}
				>
					<Image
						source={close}
						contentFit="contain"
						style={{ width: 25, height: 25 }}
					/>
				</TouchableOpacity>
				<Text
					style={{
						color: "#fff",
						fontFamily: "Montserrat_500Medium",
						fontSize: 22,
						marginBottom: 20,

						marginTop: 14,
						marginLeft: 2,
					}}
				>
					Account
				</Text>
			</View>
			<ScrollView style={{ paddingHorizontal: "2%" }}>
				<View
					style={{
						borderColor: borderLight,
						borderBottomWidth: 0.3,
						gap: 8,
						// paddingHorizontal: "4%",
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 15.5,
							marginTop: 12,
							marginLeft: "3%",
							fontFamily: "Montserrat_500Medium",
							alignItems: "center",
							fontWeight: "500",
							justifyContent: "center",
							// flexDirection:"row"
						}}
					>
						{user?.displayName}
					</Text>
					<Text
						style={{
							color: borderLight,
							fontSize: 14,
							marginBottom: 12,
							fontFamily: "Montserrat_400Regular",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "3%",
							// flexDirection:"row"
						}}
					>
						{user?.email}
					</Text>
				</View>
				<TouchableOpacity
					style={{
						width: "100%",
						alignItems: "center",
						marginTop: 30,
						// paddingHorizontal: "4%",
					}}
				>
					<View
						style={{
							// width: "100%",
							flexDirection: "row",
							// alignItems: "center",
							gap: 20,
							marginBottom: 20,
						}}
					>
						<Image
							source={{ uri: user?.photoURL }}
							contentFit="cover"
							style={{
								width: 60,
								height: 60,
								backgroundColor: "#000",
								borderColor: borderLight,
								borderWidth: 1,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
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
									marginBottom: 5,
									flexDirection: "row",
								}}
							>
								{user?.displayName}
							</Text>
							<View style={{ gap: 5 }}>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									{chInfo?.handle ?? "No handle"}
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
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginTop: 20, marginBottom: "20" }}
								onPress={() => {
									router.replace("userVideos/channelSettings");
								}}
							>
								<Text
									style={{
										color: buttonColor,
										fontSize: 14,
										fontFamily: "Montserrat_400Regular",
									}}
								>
									Edit channel
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flexDirection: "row",
								flex: 1,
								justifyContent: "flex-end",
								height: "100%",
								alignItems: "center",
							}}
						>
							<Image
								source={checkMark}
								tintColor={buttonColor}
								style={{ width: 20, height: 20 }}
							/>
						</View>
					</View>
				</TouchableOpacity>
				<View
					style={{
						width: "100%",
						height: 6,
						backgroundColor: borderLight,
						opacity: 0.3,
					}}
				></View>
				<View>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_500Medium",
							fontSize: 18,
							marginBottom: 20,

							marginTop: 14,
							marginLeft: "3%",
						}}
					>
						Other accounts
					</Text>
					<View
						style={{
							borderBottomWidth: 0.3,
							borderColor: borderLight,
							width: "100%",
						}}
					>
						{otherAcc.map((account, index) => {
							return (
								<OtherAccount
									accInfo={account}
									key={index}
									handleSwitchAccount={handleSwitchAccount}
								/>
							);
						})}
					</View>
				</View>
				<View style={{ marginTop: 7, paddingLeft: "2%", paddingRight: "2%" }}>
					<ForYouButtons
						sourceUrl={addAccount}
						title={"Add account"}
						handlePress={() => {
							router.push({
								pathname: "sign-in",
								params: { addAccount: "addAccount" },
							});
						}}
					/>
					<ForYouButtons
						sourceUrl={signout}
						title={"Use StreaMate sign out"}
						handlePress={handleSignOut}
					/>
					<ForYouButtons
						sourceUrl={accountSetting}
						title={"Manage account on this device"}
					/>
					{/* <MoreButton imageUrl={} title={} /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default AccountInfo;
