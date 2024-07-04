// BottomSheetComponent.js

import React, { useCallback, useRef, useState } from "react";
import {
	Button,
	StyleSheet,
	View,
	Text,
	Keyboard,
	Dimensions,
	ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { bgColor, fieldColor, loadingColor } from "../constants/colors";
import { FlatList } from "react-native-gesture-handler";
import CommentsHeader from "./CommentsHeader";
import CommentFooter from "./CommentFooter";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const windowHeight = Dimensions.get("window").height;
const AboutVideo = ({ isVisible, onClose, isActive,info }) => {
	const insets = useSafeAreaInsets();
	const commentHeight =
		((windowHeight - 250 - insets.bottom) / windowHeight) * 100;
	const bottomSheetRef = useRef(null);
	const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(-1);

	// Handle opening the bottom sheet when isVisible changes to true
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

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isVisible ? 0 : -1} // Start at snap point 0 when visible
			// 60%"
			snapPoints={["2%", `${commentHeight}%`]}
			enablePanDownToClose={false}
			onChange={handleSheetChanges}
			backgroundStyle={{ backgroundColor: bgColor }}
		>
			<CommentsHeader handleClose={handleClosePress} text={"Description"} />
			<ScrollView
				contentContainerStyle={{
					width: "100%",
					height: "100%",
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
						style={{ justifyContent: "center", gap: 5, alignItems: "center" }}
					>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontFamily: "Montserrat_500Medium",
								// flex:1
							}}
						>
							3,678
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
						style={{ justifyContent: "center", gap: 5, alignItems: "center" }}
					>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontFamily: "Montserrat_500Medium",
								// flex:1
							}}
						>
							22,454
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
						style={{ justifyContent: "center", gap: 5, alignItems: "center" }}
					>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontFamily: "Montserrat_500Medium",
								// flex:1
							}}
						>
							1h
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
					<Text
						style={{
							color: "white",
							fontSize: 15,
							fontFamily: "Montserrat_400Regular",
							flexWrap: "wrap",
							flexDirection: "row",
						}}
					>
						{info?.description !== ""
							? info?.description
							: "This video has no description"}
					</Text>
				</View>

				<TouchableOpacity
					style={{
						width: "50%",
						flexDirection: "row",
						marginTop: 30,
						alignItems: "center",
						gap: 10,
					}}
				>
					<Image
						source={{uri:info?.image}}
						style={{
							borderRadius: "50%",
							width: 45,
							height: 45,
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
							4.7M Subscribers
						</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>
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
