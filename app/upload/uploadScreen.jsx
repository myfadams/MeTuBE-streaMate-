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
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, fieldColor, loadingColor } from "../../constants/colors";
import {
	addImage,
	allowComment,
	back,
	description,
	globe,
	location,
	playlist,
	search,
	shorts,
} from "../../constants/icons";
import * as ImagePicker from "expo-image-picker";
import MoreButton from "../../components/MoreButton";
import { Video } from "expo-av";
import { getContext } from "../../context/GlobalContext";
import ForYouButtons from "../../components/ForYouButtons";
import UploadButtons from "../../components/uploadButton";
const UploadView = () => {
	const { user } = getContext();
	const videoUpload = useLocalSearchParams();
	const { vidDescription } = getContext();
	// console.log(vidDescription)
	const [videoInfo, setVideoInfo] = useState({
		title: "",
		videoUrl: videoUpload.thumbnail,
		description: vidDescription,
		thumbnailUrl: videoUpload.thumbnailURL,
	});
	// console.log(videoInfo.description)
	async function openFilePicker(typeOfFile) {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,

			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			console.log(result.assets[0]);
			if (typeOfFile === "image") {
				setVideoInfo({ ...videoInfo, thumbnailUrl: result.assets[0].uri });
			}
		}
	}

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
								// setVideoInfo(...videoInfo)
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
					<MoreButton
						title={"Next"}
						handlePress={() => {
							// console.log(videoInfo)
							if (videoInfo.title != "") router.push({
								pathname: "upload/audience",
								params: videoInfo,
							});
							else Alert.alert("Please give your video a title");
						}}
					/>
				</View>
			</View>
			<ScrollView automaticallyAdjustKeyboardInsets>
				<View>
					<Image
						source={{ uri: videoInfo.thumbnailUrl }}
						style={{ width: "100%", height: 250, backgroundColor: "#000" }}
						resizeMode="contain"
					/>
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
							top: "5%",
							left: "5%",
						}}
					>
						<Image
							source={addImage}
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
							source={{ uri: user?.photoURL }}
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
								{user?.displayName}
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
				<View
					style={{
						alignItems: "center",
						backgroundColor: fieldColor,
						justifyContent: "center",
					}}
				>
					<View
						style={{
							width: "96%",
							flexDirection: "row",
							height: 83,
							gap: 20,
							borderTopWidth: 0.9,
							borderBottomWidth: 0.9,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TextInput
							onChangeText={(text) => {
								setVideoInfo({ ...videoInfo, title: text });
							}}
							value={videoInfo.title}
							style={{
								width: "100%",
								color: "#fff",
								fontSize: 17,
								justifyContent: "center",
								alignItems: "center",
								fontFamily: "Montserrat_400Regular",
							}}
							placeholder="Create a title (type @ to mention a channel)"
							placeholderTextColor={"#C5C5C5"}
						/>
					</View>
					<View style={{ marginTop: 30 }} />
				</View>
				<UploadButtons
					sourceUrl={description}
					title={"Add Description"}
					handlePress={() => {
						router.push("upload/description");
					}}
					subValue={vidDescription}
				/>
				<UploadButtons
					sourceUrl={globe}
					title={"Public"}
					subtitle={"Visibility"}
				/>
				<UploadButtons sourceUrl={location} title={"Location"} />

				<UploadButtons
					sourceUrl={playlist}
					title={"Add to playlists"}
					type={"playlist"}
				/>
				<UploadButtons
					sourceUrl={shorts}
					title={"Allow video and audio remixing"}
					subtitle={"Shorts remixing"}
				/>
				<UploadButtons
					sourceUrl={allowComment}
					title={"On"}
					subtitle={"Comments"}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default UploadView;
