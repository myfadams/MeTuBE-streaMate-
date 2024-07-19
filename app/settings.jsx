import {
	View,
	Platform,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	// SafeAreaView,
} from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { bgColor, borderLight } from "../constants/colors";
import { close } from "../constants/icons";
import ForYouButtons from "../components/ForYouButtons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Modal() {
	// If the page was reloaded or navigated to directly, then the modal should be presented as
	// a full screen page. You may need to change the UI to account for this.
	const textButtons = [
		"Purchases and memberships",
		"Account",
		"General",
		"Autoplay",
		"Try experimental new features",
		"Video quality prefrences",
		"Notification",
		"Connected apps",
		"Manage all history",
		"Your data in StreaMate",
		"Privacy",
		"Offline",
		"Uploads",
		"Live chat",
		"About",
	];
	function SettingButton({ title, handlePress }) {
		return (
			<TouchableOpacity
                onPress={handlePress}
				style={{
					width: "100%",
					alignItems: "center",
					marginTop: 5,
					marginBottom: 5,
					marginLeft: 10,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						width: "97%",
						gap: 10,
						margin: "3%",
						// alignItems: "center",
						justifyContent: "start",
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_500Medium",
							fontSize: 16,
						}}
					>
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
	return (
		<SafeAreaView
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
					borderBottomWidth: 0.7,
					borderColor: borderLight,
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
					Settings
				</Text>
			</View>
			<ScrollView>
				{/* <SettingButton title={"Purchases and memberships"}/> */}
				{textButtons.map((buttonTxt,index) => {
                    if(buttonTxt.toLocaleLowerCase()==="account")
                        return <SettingButton title={buttonTxt} key={index} handlePress={()=>{router.push("/account")}}/>
					return <SettingButton title={buttonTxt} key={index}/>;
				})}
			</ScrollView>
		</SafeAreaView>
	);
}
