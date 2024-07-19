import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { borderLight } from "../constants/colors";
import { commentOutline, dislikOutline, likeOutline, options } from "../constants/icons";
import TruncatedText from "./TextComment";

const CommentView = ({commentData}) => {
	// console.log(commentData.image)
	return (
		<TouchableOpacity
			style={{ flexDirection: "row", padding: 10 }}
			activeOpacity={0.7}
		>
			<Image
				source={{uri:commentData?.image}}
				style={{
					width: 30,
					height: 30,
					backgroundColor: "#000",
					borderRadius: Platform.OS === "ios" ? "50%" : 50,
				}}
				resizeMode="cover"
			/>

			<View
				style={{
					paddingHorizontal: 13,
					justifyContent: "center",
					width: "90%",
					gap: 10,
				}}
			>
				<Text
					style={{
						flexWrap: "wrap",
						// flexShrink: 1,
						fontSize: 12,
						color: borderLight,
						fontFamily: "Montserrat_400Regular",
					}}
				>
					{commentData?.handle ?? commentData.name}
				</Text>
				{/* <Text
					// numberOfLines={2}
					style={{
						color: "#fff",
						fontFamily: "Montserrat_500Medium",
						fontSize: 15,
						flexWrap: 1,
					}}
				>
					VirtualizedList: You have a large list that is slow to update - make
					sure your renderItem function renders components that follow React
					performance
				</Text> */}
                <TruncatedText numberOfLines={3}>
                    {commentData?.text}
                </TruncatedText>
				<View style={{ flexDirection: "row", gap: 30, marginTop: 10 }}>
					<TouchableOpacity style={{flexDirection:"row",gap:6}}>
						<Image
							source={likeOutline}
							style={{
								width: 16,
								height: 16,
							}}
							resizeMode="contain"
							tintColor={"#fff"}
						/>
						<Text
							style={{
								flexWrap: "wrap",
								// flexShrink: 1,
								fontSize: 12,
								color: borderLight,
								fontFamily: "Montserrat_400Regular",
							}}
						>
							{commentData?.likes}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={dislikOutline}
							style={{
								width: 16,
								height: 16,
							}}
							resizeMode="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={commentOutline}
							style={{
								width: 16,
								height: 16,
							}}
							resizeMode="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity>
				<Image
					source={options}
					style={{
						width: 16,
						height: 16,
					}}
					resizeMode="contain"
					tintColor={"#fff"}
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default CommentView;
