import {
	View,
	Text,
	// SafeAreaView,
	TouchableOpacity,
	
	Platform,
	Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
	back,
	camera,
	chromecast,
	copy,
	description,
	edit,
	options,
	search,
} from "../../constants/icons";
import {
	bgColor,
	borderLight,
	buttonColor,
	videoColor,
} from "../../constants/colors";
import { getContext } from "../../context/GlobalContext";
import { OpenImageView } from "../../libs/sound";
import { uploadProfileAndCover } from "../../libs/uploadFirebase";
import ModalEditor from "../../components/channel/ModalEditor";
import { router } from "expo-router";
import { authentication, db } from "../../libs/config";
import { onValue, ref } from "firebase/database";
import { changeUserDetails } from "../../libs/firebase";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const channelSettings = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [type, setType] = useState(false);

	function handleSwitch() {
		setIsEnabled(!isEnabled);
	}
	const ChannelEditButtons = ({ sourceUrl, title, handlePress, subtitle }) => {
		return (
			<TouchableOpacity
				onPress={handlePress}
				style={{
					// width: "92%",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-evenly",
					borderColor: borderLight,
					borderBottomWidth: 0.7,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						gap: 10,
						margin: "3%",
						alignItems: "center",
						width: "80%",
					}}
				>
					<View style={{ gap: 7 }}>
						<Text
							style={{
								color: "#fff",
								fontFamily: "Montserrat_500Medium",
								fontSize: 16,
							}}
						>
							{title}
						</Text>

						<Text
							numberOfLines={1}
							style={{
								color: "#C5C5C5",
								fontFamily: "Montserrat_500Medium",
								fontSize: 13,
								// width:
							}}
						>
							{subtitle}
						</Text>
					</View>
				</View>
				<Image
					source={sourceUrl}
					style={{ width: 23, height: 23 }}
					contentFit="contain"
					tintColor={"#fff"}
				/>
			</TouchableOpacity>
		);
	};
	const { user, refereshing, setRefreshing, setUser } = getContext();
	const [profileImg, setProfileImg] = useState();
	const [userDetails, setUserDetails] = useState({
		name: "",
		handle: "",
		descr: "",
	});
	const [cover, setCover] = useState();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		if (user) {
			const userRef = ref(db, `usersref/${user.uid}`);

			const unsubscribe = onValue(userRef, (snapshot) => {
				const data = snapshot.val();
				// console.log(data);
				setUserData(data);
			});

			// Clean up the listener on unmount
			return () => unsubscribe();
		}
	}, [refereshing]);
	// console.log(userData);
	useEffect(() => {
		setUserDetails({ ...userDetails, name: userData?.name, handle: (userData?.handle ?? "No handle") });
	}, [refereshing]);
	// console.log("new name"+user.);
	// console.log(userData?.handle);
	async function handleChangeProfile() {
		const data = await OpenImageView("profile");
		if (data) {
			let toast = Toast.show("Updating Profile photo", {
				duration: Toast.durations.LONG,
			});
			const profUrl = await uploadProfileAndCover(data, user.uid, "profile");
			changeUserDetails("photoURL", profUrl);
			setProfileImg(profUrl);
			toast = Toast.show("Profile updated successfuly", {
				duration: Toast.durations.LONG,
			});
			setRefreshing(!refereshing);
			setTimeout(function hideToast() {
				Toast.hide(toast);
			}, 3000);
		}
		// console.log(data.replace(/^.*?\./,   "cover."));
	}
	async function handleChangeCover() {
		const data = await OpenImageView("cover");
		if(data){
			let toast = Toast.show("Updating Cover photo", {
				duration: Toast.durations.LONG,
			});
			const coverPhotoUrl = await uploadProfileAndCover(data, user.uid, "cover");
			changeUserDetails("cover", coverPhotoUrl);
			setCover(coverPhotoUrl);
			setRefreshing(!refereshing);
			toast = Toast.show("Cover photo updated successfuly", {
				duration: Toast.durations.LONG,
			});
			setRefreshing(!refereshing);
			setTimeout(function hideToast() {
				Toast.hide(toast);
			}, 3000);
		}
	}
	return (
		<SafeAreaView style={{ backgroundColor: bgColor }}>
			<View style={{ height: "100%" }}>
				<View style={{ alignItems: "center", width: "100%" }}>
					<View
						style={{
							width: "97%",

							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<TouchableOpacity
								style={{ margin: 10 }}
								activeOpacity={0.7}
								onPress={() => {
									router.push("../");
								}}
							>
								<Image
									source={back}
									contentFit="contain"
									style={{ width: 30, height: 30 }}
								/>
							</TouchableOpacity>

							<Text
								style={{
									color: "#fff",
									fontFamily: "Montserrat_600SemiBold",
									fontSize: 17,
								}}
							>
								Channel Settings
							</Text>
						</View>

						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 30,
							}}
						>
							<TouchableOpacity>
								<Image
									source={chromecast}
									style={{ width: 21, height: 21 }}
									contentFit="contain"
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									router.push("/search/SearchPage");
								}}
							>
								<Image
									source={search}
									style={{ width: 21, height: 21 }}
									contentFit="contain"
								/>
							</TouchableOpacity>
							<TouchableOpacity>
								<Image
									source={options}
									style={{ width: 21, height: 21 }}
									contentFit="contain"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View>
					<View>
						<TouchableOpacity onPress={handleChangeCover}>
							<Image
								source={{uri:userData?.coverPhoto}}
								style={{
									backgroundColor: videoColor,
									width: "100%",
									height: 120,
									opacity: 0.6,
								}}
								contentFit="cover"
							/>
							<Image
								source={camera}
								style={{
									position: "absolute",
									width: 40,
									height: 40,
									right: 10,
									top: 10,
								}}
								tintColor={"white"}
								contentFit="contain"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderColor: borderLight,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								justifyContent: "center",
								alignItems: "center",
								position: "absolute",
								borderWidth: 0.7,
								top: "50%",
								left: "50%",
								transform: [
									{ translateX: -37.5 }, // Adjust based on your component size
									{ translateY: -37.5 }, // Adjust based on your component size
								],
							}}
							onPress={handleChangeProfile}
						>
							<Image
								source={{ uri: userData?.image }}
								style={{
									margin: 3,
									backgroundColor: "#000",
									borderWidth: 0.7,
									opacity: 0.6,
									width: 75,
									height: 75,
									borderRadius: Platform.OS === "ios" ? "50%" : 50,
								}}
								contentFit="cover"
							/>
							<Image
								source={camera}
								style={{ position: "absolute", width: 40, height: 40 }}
								tintColor={"white"}
								contentFit="contain"
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ justifyContent: "center" }}>
					<ChannelEditButtons
						sourceUrl={edit}
						title={"Name"}
						subtitle={user?.displayName}
						handlePress={() => {
							setIsModalVisible(!isModalVisible);
							setType("name");
							setUserDetails({ ...userDetails, name: userData?.name });
						}}
					/>
					<ChannelEditButtons
						sourceUrl={edit}
						title={"Handle"}
						subtitle={userData?.handle ?? "No handle"}
						handlePress={() => {
							setIsModalVisible(!isModalVisible);
							setType("handle");
							setUserDetails({ ...userDetails, handle: userData?.handle });
						}}
					/>
					<ChannelEditButtons
						sourceUrl={copy}
						title={"Channel URL"}
						subtitle={"www.StreaMate.com/channel_name"}
					/>
					<ChannelEditButtons
						handlePress={()=>{
							router.push({pathname:"userVideos/channelDescription",params:userData})
						}}
						sourceUrl={edit}
						title={"Description"}
						subtitle={
							userData?.description ?? "No channel description"
						}
					/>

					<View
						style={{
							flexDirection: "row",
							gap: 10,
							margin: "3%",
							alignItems: "center",
							width: "100%",
						}}
					>
						<View style={{ gap: 15 }}>
							<Text
								style={{
									color: "#fff",
									fontFamily: "Montserrat_500Medium",
									fontSize: 16,
								}}
							>
								Privacy
							</Text>

							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									width: "96%",
								}}
								onPress={handleSwitch}
							>
								<Text
									numberOfLines={1}
									style={{
										color: "#C5C5C5",
										fontFamily: "Montserrat_500Medium",
										fontSize: 13,
										// width:
									}}
								>
									Keep all my subscriptions private
								</Text>
								<View
									style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
								>
									<Switch
										trackColor={{ false: "#767577", true: buttonColor }}
										thumbColor={"#f4f3f4"}
										ios_backgroundColor="#3e3e3e"
										value={isEnabled}
										disabled={true}
									/>
								</View>
							</TouchableOpacity>
							<Text
								style={{
									color: "#C5C5C5",
									fontFamily: "Montserrat_500Medium",
									fontSize: 11,
									flexWrap: "wrap",
									flexShrink: 1,
									// width:
								}}
							>
								Changes made to your name and profile are visible only on StreaMate
								and not other Google services.
								<Text style={{ color: buttonColor }}> Learn more</Text>
							</Text>
						</View>
					</View>
				</View>
			</View>
			<ModalEditor
				modalVisible={isModalVisible}
				setModalVisible={setIsModalVisible}
				type={type}
				setVal={setUserDetails}
				val={userDetails}
				setRef={setRefreshing}
				refe={refereshing}
				// data={userData}
			/>
		</SafeAreaView>
	);
};

export default channelSettings;
