import { View, Text, Platform } from "react-native";
import React from "react";
import { loadingColor } from "../constants/colors";
import * as Animatable from "react-native-animatable";
const VidScreenLoad = () => {
    const customAnimation = {
			0: {
				opacity: 0.4,
			},
			0.5: {
				opacity: 8,
			},
			1: {
				opacity: 0.4,
			},
		};
	return (
		<Animatable.View
			animation={customAnimation}
			duration={3200}
			iterationCount="infinite"
		>
			<View
				style={{
					width: "100%",
					// height: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						width: "96%",
						flexDirection: "row",
						justifyContent: "space-between",
						margin: 10,
					}}
				>
					<View
						style={{
							width: "50%",
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
						}}
					>
						<View
							style={{
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								width: 45,
								height: 45,
								backgroundColor: loadingColor,
							}}
						></View>
						<View
							style={{
								borderRadius: 2,
								width: "70%",
								height: 13,
								backgroundColor: loadingColor,
							}}
						></View>
					</View>
					<View
						style={{
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							// alignSelf: "flex-end",
							width: "35%",
							height: 45,
							backgroundColor: loadingColor,
						}}
					></View>
				</View>
				<View
					style={{
						width: "96%",
						flexDirection: "row",
						margin: 6,
						justifyContent: "space-between",
					}}
				>
					<View
						style={{
							width: "37%",
							height: 35,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							backgroundColor: loadingColor,
						}}
					></View>

					<View
						style={{
							width: "20%",
							height: 35,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							backgroundColor: loadingColor,
						}}
					></View>
					<View
						style={{
							width: "20%",
							height: 35,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							backgroundColor: loadingColor,
						}}
					></View>
					<View
						style={{
							width: "20%",
							height: 35,
							borderRadius: Platform.OS === "ios" ? "50%" : 50,
							backgroundColor: loadingColor,
						}}
					></View>
				</View>
				<View
					style={{
						width: "96%",
						height: 80,

						backgroundColor: loadingColor,
						marginTop: 10,
						borderRadius: Platform.OS === "ios" ? "25%" : 25,
					}}
				></View>
				<View
					style={{
						width: "100%",
						height: 200,
						backgroundColor: loadingColor,
						marginTop: 15,
					}}
				></View>
			</View>
		</Animatable.View>
	);
};

export default VidScreenLoad;
