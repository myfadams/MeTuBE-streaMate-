import {
	View,
	Text,
	// SafeAreaView,
	TouchableOpacity,
	Image,
	TextInput,
    ScrollView,
	Alert,
} from "react-native";
import Toast from "react-native-root-toast";
import React, { useEffect, useRef, useState } from "react";
import { bgColor, borderLight, buttonColor } from "../../constants/colors";
import { back } from "../../constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import { getContext } from "../../context/GlobalContext";
import RadioButtonRN from "radio-buttons-react-native";
import MoreButton from "../../components/MoreButton";
import { addVideoToDB, uploadFiles } from "../../libs/uploadFirebase";
import { SafeAreaView } from "react-native-safe-area-context";
const UploadFeatures = () => {
	const { uploadFeatures: type } = useLocalSearchParams();
	const { user} = getContext();
	const { vidDescription, setVidDescription } = getContext();
	const [text, setText] = useState(vidDescription);
	let videoInfo
	if(type==="audience")
	{	videoInfo=useLocalSearchParams();
		videoInfo.description = vidDescription
	}
	
	// console.log(videoInfo)
	const uploadStreaMateVideo = async () => {
		try {
				router.push("home");
				const videoUrl = await uploadFiles(
					"videos",
					videoInfo.videoUrl,
					videoInfo.title.replaceAll(" ", "")
				);
				const thumbnailUrl = await uploadFiles(
					"videos",
					videoInfo.thumbnailUrl,
					videoInfo.title.replaceAll(" ","")
				);
				await addVideoToDB(videoInfo, thumbnailUrl, videoUrl, user?.uid, videoInfo.duration);
				// Alert.alert("Video Uploaded");
				
				let toast = Toast.show("video uploaded", {
					duration: Toast.durations.LONG,
				});
				setTimeout(function hideToast() {
					Toast.hide(toast);
				}, 3000);
		} catch (error) {
			console.log(error);
		}
	};
    const [isVisible, setIsVisible] = useState(false)
    const [heading, setHeading] = useState("Is this video made for kids?");
    const [isDisabled, setIsDisabled] = useState(false);

	
	const inputRef = useRef(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);
	
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<View
				style={{
					// justifyContent: "center",
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
								// console.log(text);
								setVidDescription(text);
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
							{type === "description" && "Add Description"}
							{type === "audience" && "Select audience"}
						</Text>
					</View>
				</View>
				{type === "description" && (
					<View style={{ width: "96%",height:"100%" }}>
						<TextInput
							multiline={true}
							ref={inputRef}
							onChangeText={(text) => {
								setText(text);
							}}
							value={text}
							style={{
								width: "100%",
								height: "50%",
								color: "#fff",
								fontSize: 17,
								justifyContent: "center",
								alignItems: "center",
								fontFamily: "Montserrat_400Regular",
							}}
						/>
					</View>
				)}
				{type === "audience" && (
					<ScrollView style={{ width: "96%", marginTop: 40 }}>
						<Text
							style={{
								width: "96%",
								alignItems: "center",
								margin: "2%",
								//change
								flexWrap: "wrap",
								fontSize: 18,
								fontWeight: "500",
								color: "#fff",
							}}
						>
							{heading}
						</Text>
						<Text
							style={{
								width: "96%",
								alignItems: "center",
								margin: "2%",
								flexWrap: "wrap",
								color: "#fff",
							}}
						>
							Regardless of your location, you're legally required to comply
							with the Children's Online Privacy Protection Act (COPPA) and/or
							other laws. You're required to tell us whether your videos are
							made for kids.
							<Text style={{ color: buttonColor }}>
								{" "}
								What's content made for kids?
							</Text>
						</Text>
						<View style={{ marginTop: 20, marginBottom: 25 }}>
							<RadioButtonRN
								data={[
									{
										label: "Yes, it is made for kids",
										type: "yes",
									},
									{
										label: "No, it is not made for kids",
										type: "no",
									},
								]}
								selectedBtn={(e) => {
									if (e.type === "yes") {
										setHeading("This video is set to made for kids");
										setIsDisabled(true);
									} else {
										setHeading("This video is set not to made for kids");
										setIsDisabled(false);
									}
								}}
								box={false}
								activeColor={"#fff"}
								textStyle={{
									width: "96%",
									alignItems: "center",
									margin: "2%",
									// marginBottom:10.
									flexWrap: "wrap",
									fontSize: 16,
									fontWeight: "500",
									color: "#fff",
								}}
							/>
						</View>
						<TouchableOpacity
							onPress={() => {
								setIsVisible(!isVisible);
							}}
							style={{
								width: "100%",
								borderTopWidth: 0.7,
								borderBottomWidth: !isVisible ? 0.7 : 0,
								borderColor: borderLight,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View
								style={{
									justifyContent: "space-between",
									flexDirection: "row",
									width: "96%",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										width: "96%",
										alignItems: "center",
										// margin: "2%",
										marginTop: 20,
										marginBottom: 20,
										flexWrap: "wrap",
										fontSize: 18,
										// fontWeight: "500",
										color: "#fff",
									}}
								>
									Age restriction (advanced)
								</Text>
								<Image
									source={back}
									style={{
										width: 27,
										height: 27,
										transform: [{ rotate: isVisible ? "90deg" : "-90deg" }],
									}}
									resizeMode="contain"
									tintColor={"#fff"}
								/>
							</View>
						</TouchableOpacity>
						{isVisible && (
							<View
								style={{
									width: "100%",
									// borderTopWidth: 0.7,
									// borderBottomWidth:0.7,
									borderColor: borderLight,
									justifyContent: "center",
									// alignItems: "center",
								}}
							>
								<View>
									<Text
										style={{
											width: "96%",
											alignItems: "center",
											// margin: "2%",
											marginTop: 20,
											marginBottom: 20,
											flexWrap: "wrap",
											fontSize: 18,
											// fontWeight: "500",
											color: "#fff",
										}}
									>
										Do you want to restrict your video to an adult audience
									</Text>
									<Text
										style={{
											width: "96%",
											alignItems: "center",
											margin: "2%",
											flexWrap: "wrap",
											color: borderLight,
										}}
									>
										Age-restricted videos are not shown in certain areas of
										YouTube. These videos may have limited or no ads
										monetization.
									</Text>
								</View>
								<View
									style={{
										marginTop: 20,
										marginBottom: 25,
										opacity: isDisabled ? 0.5 : 1,
									}}
								>
									<RadioButtonRN
										data={[
											{
												label: "Yes, restrict my video to viewers over 18",
												type: "yes",
											},
											{
												label: "No, dont restrict my video to viewers over 18",
												type: "no",
											},
										]}
										// selectedBtn={(e) => {
										//
										// }}
										box={false}
										activeColor={"#fff"}
										textStyle={{
											width: "96%",
											alignItems: "center",
											margin: "2%",
											// marginBottom:10.
											flexWrap: "wrap",
											fontSize: 16,
											fontWeight: "500",
											color: "#fff",
										}}
									/>
								</View>
							</View>
						)}
					</ScrollView>
				)}
			</View>

			{type === "audience" && (
				<View
					style={{
						alignSelf: "baseline",
						width: "100%",
						position: "absolute",
						bottom: "3%",
					}}
				>
					<MoreButton
						title={"Upload video"}
						height={45}
						color={buttonColor}
						handlePress={uploadStreaMateVideo}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

export default UploadFeatures;
