import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Alert,
} from "react-native";
import React, { useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
	bgColor,
	borderLight,
	buttonColor,
	fieldColor,
	loadingColor,
} from "../../constants/colors";
import {
	addImage,
	allowComment,
	audience,
	back,
	description,
	edit,
	globe,
	location,
	metube,
	playlist,
	search,
	shorts,
	sponsor,
} from "../../constants/icons";
import MoreButton from "../../components/MoreButton";
import { Video } from "expo-av";
import { getContext } from "../../context/GlobalContext";
import ForYouButtons from "../../components/ForYouButtons";
import UploadButtons from "../../components/uploadButton";
import OtherViewButtons from "../../components/OtherViewButtons";
import { addShortToDB, uploadFiles } from "../../libs/uploadFirebase";
import Toast from "react-native-root-toast";
const UploadShortsView = () => {
	const { user } = getContext();
	const videoUpload = useLocalSearchParams();
	// console.log(videoUpload)
	const [shortInfo, setShortInfo] = useState({
		title: "",
		videoUrl: videoUpload.thumbnail,
		thumbnailUrl: videoUpload.thumbnailURL,
	});
	async function openFilePicker(typeOfFile) {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,

			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			// console.log(result.assets[0]);
			if (typeOfFile === "image") {
				setShortInfo({ ...shortInfo, thumbnailUrl: result.assets[0].uri });
			}
		}
	}
	const uploadMetubeShorts = async () => {
		try {
			if (shortInfo.title !== "") {
				router.push("home");
				const videoUrl = await uploadFiles(
					"shorts",
					shortInfo.videoUrl,
					shortInfo.title.replaceAll(" ", "")
				);
				const thumbnailUrl = await uploadFiles(
					"shorts",
					shortInfo.thumbnailUrl,
					shortInfo.title.replaceAll(" ","")
				);
				await addShortToDB(shortInfo, thumbnailUrl, videoUrl, user.uid);
				let toast = Toast.show("video uploaded", {
					duration: Toast.durations.LONG,
				});
				setTimeout(function hideToast() {
					Toast.hide(toast);
				}, 3000);
				
				
			} else Alert.alert("Please give your video a title");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<View
				style={{
					justifyContent: "center",
					width: "100%",
					alignItems: "center",
					marginBottom: 15,
				}}
			>
				<View
					style={{
						width: "96%",
						zIndex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity
							style={{ margin: 3 }}
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
								fontFamily: "Montserrat_500Medium",
								fontSize: 21,

								marginLeft: 2,
							}}
						>
							Add Details
						</Text>
					</View>
					{/* <MoreButton title={"Next"} /> */}
				</View>
			</View>
			<ScrollView automaticallyAdjustKeyboardInsets>
				<View
					style={{
						flexDirection: "row",
						borderBottomWidth: 0.7,
						borderColor: borderLight,
					}}
				>
					<Image
						source={{ uri: shortInfo.thumbnailUrl }}
						style={{
							width: 110,
							height: 160,
							backgroundColor: "#000",
							borderRadius: 10,
							marginBottom: 15,
						}}
					/>
					{/* // */}

					<View
						style={{
							flexDirection: "row",
							height: 160,

							flex: 1,
							marginLeft: 20,
							marginRight: 20,

							alignItems: "center",
						}}
					>
						<TextInput
							multiline={true}
							onChangeText={(text) => {
								setShortInfo({ ...shortInfo, title: text });
							}}
							value={shortInfo.title}
							style={{
								height: "50%",
								color: "#fff",
								fontSize: 17,
								flexWrap: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
							placeholder="Caption your short"
							placeholderTextColor={"#C5C5C5"}
						/>
					</View>

					<TouchableOpacity
						onPress={() => {
							openFilePicker("image");
						}}
						style={{
							backgroundColor: fieldColor,
							width: 40,
							height: 40,
							borderRadius: "50%",
							justifyContent: "center",
							alignItems: "center",
							position: "absolute",
							opacity: 0.8,
							top: "2%",
							left: "2%",
						}}
					>
						<Image
							source={edit}
							resizeMode="contain"
							style={{ width: 25, height: 25 }}
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
				</View>
				<View style={{ alignItems: "center", backgroundColor: fieldColor }}>
					<View
						style={{
							width: "96%",
							flexDirection: "row",
							gap: 20,
							alignItems: "center",
							margin: 20,
						}}
					>
						<Image
							source={{ uri: user.photoURL }}
							style={{
								width: 60,
								height: 60,
								backgroundColor: "black",
								borderRadius: "50%",
							}}
							resizeMode="contain"
						/>
						<View>
							<Text
								style={{
									color: "#fff",
									fontFamily: "Montserrat_500Medium",
									fontSize: 18,
								}}
							>
								{user.displayName}
							</Text>
							<Text
								style={{
									color: "#fff",
									fontFamily: "Montserrat_500Medium",
									fontSize: 13,
								}}
							>
								@channel_name
							</Text>
						</View>
					</View>
				</View>

				<UploadButtons
					sourceUrl={globe}
					title={"Public"}
					subtitle={"Visibility"}
				/>
				<UploadButtons sourceUrl={location} title={"Location"} />
				<UploadButtons sourceUrl={audience} title={"Select audience"} />

				<View
					style={{
						marginTop: 15,
						alignItems: "center",
						justifyContent: "space-around",
						flex: 1,
					}}
				>
					<Text
						style={{
							width: "96%",
							alignItems: "center",
							margin: "2%",
							flexWrap: 1,
							color: "#fff",
						}}
					>
						Regardless of your location, you're legally required to comply with
						the Children's Online Privacy Protection Act (COPPA) and/or other
						laws. You're required to tell us whether your videos are made for
						kids.
						<Text style={{ color: buttonColor }}>
							{" "}
							What's content made for kids?
						</Text>
					</Text>
				</View>
				<UploadButtons sourceUrl={metube} title={"Related video"} />
				<UploadButtons
					sourceUrl={shorts}
					title={"Allow video and audio remixing"}
					subtitle={"Shorts remixing"}
				/>
				<UploadButtons
					sourceUrl={sponsor}
					title={"On"}
					subtitle={"Add paid promotion label"}
				/>
			</ScrollView>
			<MoreButton
				title={"Upload short"}
				height={45}
				color={buttonColor}
				handlePress={uploadMetubeShorts}
			/>
		</SafeAreaView>
	);
};

export default UploadShortsView;
