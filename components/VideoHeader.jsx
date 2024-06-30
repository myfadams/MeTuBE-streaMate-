import { View, Text, TouchableOpacity,Image} from "react-native";
import React, { useState } from "react";
import { buttonColor, fieldColor, loadingColor } from "../constants/colors";
import OtherViewButtons from "./OtherViewButtons";
import BottomSheetComponent from "./CommentSection";

const VidHeader = ({comment}) => {
	

	return (
		<View
			style={{
				width: "100%",
				alignItems: "center",
			}}
		>
			<TouchableOpacity
				activeOpacity={0.8}
				style={{
					width: "96%",
					marginTop: 15,
					borderRadius: "5%",
				}}
			>
				<Text
					numberOfLines={2}
					style={{
						color: "white",
						fontSize: 20,
						fontFamily: "Montserrat_600SemiBold",
					}}
				>
					This is the ttile
				</Text>
				<View
					style={{
						marginTop: 15,
						flexDirection: "row",
						width: "100%",
						gap: 15,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						53K views
					</Text>

					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						1 day ago
					</Text>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						...more
					</Text>
				</View>
			</TouchableOpacity>
			<View
				style={{
					width: "96%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					margin: 15,
				}}
			>
				<TouchableOpacity
					style={{
						width: "50%",
						flexDirection: "row",
						alignItems: "center",
						gap: 10,
					}}
				>
					<Image
						style={{
							borderRadius: "50%",
							width: 45,
							height: 45,
							backgroundColor: "#000",
						}}
					/>
					<View style={{ flexDirection: "row", gap: 10 }}>
						<Text
							style={{
								color: "white",
								fontSize: 14,
								fontFamily: "Montserrat_600SemiBold",
							}}
						>
							Channel name
						</Text>

						<Text
							style={{
								color: "white",
								fontSize: 14,
								fontFamily: "Montserrat_300Light",
							}}
						>
							4.7M
						</Text>
					</View>
				</TouchableOpacity>
				<View>
					<OtherViewButtons
						title={"Subscribe"}
						styles={{
							width: 100,
							height: 30,
							backgroundColor: buttonColor,
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 3,
						}}
					/>
				</View>
			</View>
			<TouchableOpacity
				onPress={comment}
				activeOpacity={0.6}
				style={{
					width: "96%",
					// height: 80,

					backgroundColor: fieldColor,
					marginTop: 10,
					borderRadius: "10%",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 10,
						margin: 10,
						marginBottom: 0,
					}}
				>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 16,
							fontFamily: "Montserrat_600SemiBold",
						}}
					>
						Comments
					</Text>
					<Text
						numberOfLines={1}
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_400Regular",
						}}
					>
						989
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 3,
						width: "100%",
						margin: 10,
					}}
				>
					<Image
						resizeMode="contain"
						style={{
							width: 40,
							height: 40,
							backgroundColor: "#000",

							borderRadius: "50%",
						}}
					/>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						style={{
							color: "white",
							fontSize: 14.5,
							fontFamily: "Montserrat_400Regular",
							// flexShrink: 1
							flex: 1,
						}}
					>
						This is a comment, are you 😂😂 just test ande wwill see
					</Text>
				</View>
			</TouchableOpacity>
			
		</View>
	);
};

export default VidHeader;
