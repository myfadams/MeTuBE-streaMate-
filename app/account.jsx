import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { accountSetting, addAccount, close, signout } from "../constants/icons";
import { bgColor, borderLight, buttonColor } from "../constants/colors";
import { getContext } from "../context/GlobalContext";
import MoreButton from "../components/MoreButton";
import ForYouButtons from "../components/ForYouButtons";
import { signOut } from "firebase/auth";
import { authentication } from "../libs/config";

const AccountInfo = () => {
	const { user } = getContext();
	const handleSignOut = () => {
    signOut(authentication)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out successfully.');
		router.replace("sign-in")
        // Perform any additional actions like navigating to the login screen
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
	}
	return (
		<View
			style={{
				flex: 1,
				// alignItems: "center",
				// justifyContent: "center",
				backgroundColor: bgColor,
			}}
		>
			<View
				style={{
					flexDirection: "row",

					alignItems: "center",
					width: "100%",
					gap: 10,
				}}
			>
				<TouchableOpacity
					style={{ justifyContent: "center", marginLeft: 15 }}
					onPress={() => {
						router.push("../");
					}}
				>
					<Image
						source={close}
						resizeMode="contain"
						style={{ width: 25, height: 25 }}
					/>
				</TouchableOpacity>
				<Text
					style={{
						color: "#fff",
						fontFamily: "Montserrat_500Medium",
						fontSize: 22,
						marginBottom: 20,

						marginTop: 14,
						marginLeft: 2,
					}}
				>
					Account
				</Text>
			</View>
			<ScrollView>
				<View
					style={{ borderColor: borderLight, borderBottomWidth: 0.3, gap: 8 }}
				>
					<Text
						style={{
							color: "white",
							fontSize: 15.5,
							marginTop: 12,
							marginLeft: "3%",
							fontFamily: "Montserrat_500Medium",
							alignItems: "center",
							fontWeight: "500",
							justifyContent: "center",
							// flexDirection:"row"
						}}
					>
						{user?.displayName}
					</Text>
					<Text
						style={{
							color: borderLight,
							fontSize: 14,
							marginBottom: 12,
							fontFamily: "Montserrat_400Regular",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "3%",
							// flexDirection:"row"
						}}
					>
						{user?.email}
					</Text>
				</View>
				<TouchableOpacity
					style={{ width: "100%", alignItems: "center", marginTop: 30 }}
				>
					<View
						style={{
							width: "97%",
							flexDirection: "row",
							// alignItems: "center",
							gap: 20,
							marginBottom: 20,
						}}
					>
						<Image
							source={{ uri: user?.photoURL }}
							resizeMode="contain"
							style={{
								width: 60,
								height: 60,
								backgroundColor: "#000",
								borderColor: borderLight,
								borderWidth: 1,
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
									marginBottom: 5,
									flexDirection: "row",
								}}
							>
								{user?.displayName}
							</Text>
							<View style={{ gap: 5 }}>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									{/* {user.email} */}@channel_name
								</Text>
								<Text
									style={{
										color: "white",
										fontSize: 14,
										fontFamily: "Montserrat_300Light",
									}}
								>
									77 subscribers
								</Text>
							</View>
							<TouchableOpacity
								activeOpacity={0.7}
								style={{ marginTop: 20, marginBottom: "20" }}
							>
								<Text
									style={{
										color: buttonColor,
										fontSize: 14,
										fontFamily: "Montserrat_400Regular",
									}}
								>
									Edit channel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableOpacity>
				<View
					style={{
						width: "100%",
						height: 6,
						backgroundColor: borderLight,
						opacity: 0.3,
					}}
				></View>
				<View>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_500Medium",
							fontSize: 18,
							marginBottom: 20,

							marginTop: 14,
							marginLeft: "3%",
						}}
					>
						Other accounts
					</Text>
					<Text
						style={{
							color: borderLight,
							fontSize: 14,
							marginBottom: 12,
							// fontWeight:"600",
							fontFamily: "Montserrat_400Regular",
							alignItems: "center",
							justifyContent: "center",
							marginLeft: "3%",
							// flexDirection:"row"
						}}
					>
						username@email.com
					</Text>
					<TouchableOpacity
						style={{
							width: "100%",
							alignItems: "center",
							marginTop: 15,
							borderBottomWidth: 0.3,
							borderColor: borderLight,
						}}
					>
						<View
							style={{
								width: "97%",
								flexDirection: "row",
								// alignItems: "center",
								gap: 20,
								marginBottom: 20,
							}}
						>
							<Image
								// source={{ uri: user.photoURL }}
								resizeMode="contain"
								style={{
									width: 50,
									height: 50,
									backgroundColor: "#000",
									borderColor: borderLight,
									borderWidth: 1,
									borderRadius: "50%",
								}}
							/>
							<View style={{ gap: 8 }}>
								<Text
									numberOfLines={2}
									style={{
										color: "white",
										fontSize: 20,
										fontFamily: "Montserrat_500Medium",
										flexWrap: "wrap",
										marginBottom: 5,
										flexDirection: "row",
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
									77 subscribers
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 7, paddingLeft: "2%", paddingRight: "2%" }}>
					<ForYouButtons sourceUrl={addAccount} title={"Add account"} />
					<ForYouButtons sourceUrl={signout} title={"Use MeTuBE sign out"} handlePress={handleSignOut}/>
					<ForYouButtons
						sourceUrl={accountSetting}
						title={"Manage account on this device"}
					/>
					{/* <MoreButton imageUrl={} title={} /> */}
				</View>
			</ScrollView>
		</View>
	);
};

export default AccountInfo;
