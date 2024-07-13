import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Image,
	Platform,
    Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
	back,
	camera,
	chromecast,
	copy,
	edit,
	options,
	search,
} from "../../constants/icons";
import { bgColor, borderLight, buttonColor, videoColor } from "../../constants/colors";
import { getContext } from "../../context/GlobalContext";
import { OpenImageView } from "../../libs/sound";
import { uploadProfileAndCover } from "../../libs/uploadFirebase";
import ModalEditor from "../../components/channel/ModalEditor";
import { router } from "expo-router";
import { authentication, db } from "../../libs/config";
import { onValue, ref } from "firebase/database";
import { changeUserDetails } from "../../libs/firebase";
import Toast from "react-native-root-toast";

const channelSettings = () => {
    const [isEnabled, setIsEnabled] = useState(false)
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [type, setType] = useState(false)

    function handleSwitch(){
        setIsEnabled(!isEnabled)
        

    }
	const ChannelEditButtons = ({ sourceUrl, title, handlePress, subtitle, }) => {
		return (
			<TouchableOpacity
				onPress={handlePress}
				style={{
					// width: "92%",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-evenly",
					borderColor: borderLight,
					borderBottomWidth: 0.7 
				}}
			>
				<View
					style={{
						flexDirection: "row",
						gap: 10,
						margin: "3%",
						alignItems: "center",
                        width:"80%"
                        
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
					resizeMode="contain"
					tintColor={"#fff"}
				/>
			</TouchableOpacity>
		);
	};
	const { user, refereshing, setRefreshing,setUser } = getContext();
	const [profileImg, setProfileImg] = useState();
    const [userDetails, setUserDetails] = useState({name:"",handle:"",descr:""});
	const [cover, setCover] = useState();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		if (user) {
			const userRef = ref(db, `usersref/${user.uid}`);

			const unsubscribe = onValue(userRef, (snapshot) => {
				const data = snapshot.val();
				setUserData(data);
			});

			// Clean up the listener on unmount
			return () => unsubscribe();
		}
	}, [refereshing]);
    useEffect(()=>{
        setUserDetails({...userDetails,name:userData?.name})
    },[refereshing])
	// console.log("new name"+user.);
	async function handleChangeProfile() {
		let toast = Toast.show("Updating Profile photp", {
			duration: Toast.durations.LONG,
		});
		const data = await OpenImageView();
		const profUrl = await uploadProfileAndCover(data, user.uid, "profile");
		changeUserDetails("photoURL", profUrl);
		setProfileImg(profUrl);
		toast = Toast.show("Profile updated successfuly", {
			duration: Toast.durations.LONG,
		});
        setRefreshing(!refereshing)
		setTimeout(function hideToast() {
			Toast.hide(toast);
		}, 3000);
		// console.log(data.replace(/^.*?\./,   "cover."));
	}
	async function handleChangeCover() {
		const data = await OpenImageView();
		const profUrl = await uploadProfileAndCover(data, user.uid, "cover");
		setCover(profUrl);
        setRefreshing(!refereshing);
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
									resizeMode="contain"
									style={{ width: 35, height: 35 }}
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
									resizeMode="contain"
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
									resizeMode="contain"
								/>
							</TouchableOpacity>
							<TouchableOpacity>
								<Image
									source={options}
									style={{ width: 21, height: 21 }}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View>
					<View>
						<TouchableOpacity onPress={handleChangeCover}>
							<Image
								style={{
									backgroundColor: videoColor,
									width: "100%",
									height: 120,
									opacity: 0.6,
								}}
								resizeMode="cover"
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
								resizeMode="contain"
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
								source={{ uri: (userData?.image) }}
								style={{
									margin: 3,
									backgroundColor: "white",
									borderWidth: 0.7,
									opacity: 0.6,
									width: 75,
									height: 75,
									borderRadius: Platform.OS === "ios" ? "50%" : 50,
								}}
								resizeMode="cover"
							/>
							<Image
								source={camera}
								style={{ position: "absolute", width: 40, height: 40 }}
								tintColor={"white"}
								resizeMode="contain"
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
                            setUserDetails({...userDetails,name:userData?.name})
						}}
					/>
					<ChannelEditButtons
						sourceUrl={edit}
						title={"Handle"}
						subtitle={"@channel_name"}
						handlePress={() => {
							setIsModalVisible(!isModalVisible);
							setType("handle");
						}}
					/>
					<ChannelEditButtons
						sourceUrl={copy}
						title={"Channel URL"}
						subtitle={"www.metube.com/channel_name"}
					/>
					<ChannelEditButtons
						sourceUrl={edit}
						title={"Description"}
						subtitle={
							"channel_name this the temp channel description for now berebe saa i will see"
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
										trackColor={{ false: "#767577", true: "#81b0ff" }}
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
								Changes made to your name and profile are visible only on MeTube
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
			/>
		</SafeAreaView>
	);
};

export default channelSettings;
