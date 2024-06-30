import { View, Text, TouchableOpacity, ScrollView,Image, Pressable } from "react-native"
import {
	clip,
	dislikOutline,
	download,
	flag,
	foward,
	likeOutline,
	save,
	shorts,
} from "../constants/icons";
import { fieldColor} from "../constants/colors";
import React from 'react'

const ScrollButtons = () => {
  return (
		<ScrollView
			horizontal
			contentContainerStyle={{
				width: "96%",
				gap: 5,
				margin: 6,
				justifyContent: "space-between",
			}}
		>
			<View
				style={{
					// gap: 5,
					height: 35,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					alignItems: "center",

					flexDirection: "row",
				}}
			>
				<Pressable
					onPress={() => {
						console.log("pressed");
					}}
					style={{
						flexDirection: "row",
						alignItems: "center",
						margin: 14,
						height: "70%",
					}}
				>
					<Image
						source={likeOutline}
						style={{ width: 22, height: 22 }}
						resizeMode="contain"
					/>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontFamily: "Montserrat_300Light",
						}}
					>
						{" "}
						53K
					</Text>
				</Pressable>
				<Text style={{ color: "#fff", fontSize: 18 }}>|</Text>
				<Pressable
					style={{
						flexDirection: "row",
						alignItems: "center",
						margin: 14,
						height: "70%",
					}}
				>
					<Image
						source={dislikOutline}
						style={{ width: 22, height: 22 }}
						resizeMode="contain"
					/>
				</Pressable>
			</View>

			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={foward}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					share
				</Text>
			</Pressable>
			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={shorts}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
					tintColor={"#fff"}
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					remix
				</Text>
			</Pressable>
			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={download}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					download
				</Text>
			</Pressable>
			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={clip}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					clip
				</Text>
			</Pressable>

			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={save}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					save
				</Text>
			</Pressable>
			<Pressable
				style={{
					height: 35,
					gap: 3,
					borderRadius: "50%",
					backgroundColor: fieldColor,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Image
					source={flag}
					style={{ width: 22, height: 22, marginLeft: 14 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "white",
						marginRight: 14,
						fontSize: 14,
						fontFamily: "Montserrat_300Light",
					}}
				>
					report
				</Text>
			</Pressable>
		</ScrollView>
	);
}

export default ScrollButtons