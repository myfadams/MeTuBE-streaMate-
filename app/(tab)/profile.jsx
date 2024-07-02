import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { bgColor, loadingColor } from "../../constants/colors";
import HeaderApp from "../../components/HeaderApp";
import { ScrollView } from "react-native-gesture-handler";
import ForYouButtons from "../../components/ForYouButtons";
import {
	back,
	clapper,
	download,
	getPremium,
	google,
	help,
	incoginito,
	lightbulb,
	switchAccount,
	watchtime,
	yourVideos,
} from "../../constants/icons";
import MoreButton from "../../components/MoreButton";
import History from "../../components/History";
import { getContext } from "../../context/GlobalContext";

const profile = () => {
	const [isActivated, setIsActivated] = useState(false)
	const {user}= getContext();
	const incognitoMode = ()=>{
		// console.log("hit")
		setIsActivated(!isActivated)
	}
	
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
				<HeaderApp screenName="you" disable={true} />
				<TouchableOpacity
					style={{ width: "100%", alignItems: "center", marginTop: 30 }}
				>
					<View
						style={{
							width: "97%",
							flexDirection: "row",
							alignItems: "center",
							gap: 20,
							marginBottom: 20,
						}}
					>
						<Image
							source={{ uri: user.photoURL }}
							resizeMode="contain"
							style={{
								width: 70,
								height: 70,
								backgroundColor: "#000",
								borderRadius: "50%",
							}}
						/>
						<View>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								{user.displayName}
							</Text>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									@channel_name {" . "}
								</Text>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
										alignItems: "center",
										justifyContent: "center",
										// flexDirection:"row"
									}}
								>
									view channel{" "}
									<Image
										source={back}
										style={{
											width: 14,
											height: 14,
											transform: [{ rotate: "180deg" }],
										}}
									/>
								</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<MoreButton imageUrl={switchAccount} title={"Switch Account"} />
					<MoreButton imageUrl={google} title={"Google Account"} />
					<MoreButton
						imageUrl={incoginito}
						title={`Turn ${isActivated ? "off" : "on"} incognito`}
						handlePress={incognitoMode}
					/>
				</ScrollView>
				<View style={{ marginBottom: 25 }}>
					<View style={{ marginTop: 25 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginLeft: "2%",
								marginRight: "2%",
								justifyContent: "space-between",
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									marginBottom: 8,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								History
							</Text>
							<MoreButton title={"View all"} />
						</View>
						<FlatList
							horizontal
							decelerationRate={"fast"}
							showsHorizontalScrollIndicator={false}
							data={[1, 2, 3, 4, 5, 6]}
							renderItem={({ item, index }) => {
								return <History />;
							}}
						/>
					</View>
					<View style={{ marginTop: 25 }}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginLeft: "2%",
								marginRight: "2%",
							}}
						>
							<Text
								numberOfLines={2}
								style={{
									color: "white",
									fontSize: 20,
									marginBottom: 8,
									fontFamily: "Montserrat_600SemiBold",
									flexWrap: "wrap",
									flexDirection: "row",
								}}
							>
								Playlist
							</Text>
							<MoreButton title={"View all"} />
						</View>
						<FlatList
							horizontal
							decelerationRate={"fast"}
							showsHorizontalScrollIndicator={false}
							data={[1, 2, 3, 4, 5, 6]}
							renderItem={({ item, index }) => {
								return <History />;
							}}
						/>
					</View>
				</View>
				<View style={{ borderColor: loadingColor, borderBottomWidth: 0.9 }}>
					<ForYouButtons sourceUrl={yourVideos} title={"Your videos"} />
					<ForYouButtons sourceUrl={download} title={"Downloads"} />
					<ForYouButtons sourceUrl={lightbulb} title={"Your courses"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
				<View style={{ borderColor: loadingColor, borderBottomWidth: 0.9 }}>
					<ForYouButtons sourceUrl={clapper} title={"Your movies"} />
					<ForYouButtons sourceUrl={getPremium} title={"Get MeTuBE premium"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
				<View style={{}}>
					<ForYouButtons sourceUrl={watchtime} title={"Time Watched"} />
					<ForYouButtons sourceUrl={help} title={"Help & feedback"} />
					<View style={{ marginBottom: 10 }}></View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default profile;
