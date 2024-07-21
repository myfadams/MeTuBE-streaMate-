import { View, Text, TouchableOpacity,  TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
// import { SafeAreaView } from "react-native";
import { bgColor, buttonColor } from "../../constants/colors";
import { back } from "../../constants/icons";
import MoreButton from "../../components/MoreButton";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-root-toast";
import { changeUserDetails } from "../../libs/firebase";
import { getContext } from "../../context/GlobalContext";
import { SafeAreaView } from "react-native-safe-area-context";

const channelDescription = () => {
    const data= useLocalSearchParams()
    const {chDescription, setChDescription}=getContext()
	const [text, setText] = useState();
	const inputRef = useRef(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
        setText(data?.description??"")
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
								router.push("../");
								let toast = Toast.show("Not Saved", {
									duration: Toast.durations.LONG,
								});
								setTimeout(function hideToast() {
									Toast.hide(toast);
								}, 3000);
							}}
						>
							<Image
								source={back}
								contentFit="contain"
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
							Description
						</Text>
					</View>
					<View>
						<MoreButton color={buttonColor} height={40} title={"save"} handlePress={
                            ()=>{
                                changeUserDetails("desc", text);
                                router.back()
                            }
                        } />
					</View>
				</View>
			</View>
			<View style={{ width: "96%" }}>
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
		</SafeAreaView>
	);
};

export default channelDescription;
