import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { logo } from '../constants/images';
import { chromecast, gear, message, search, sub } from '../constants/icons';
import { router } from 'expo-router';
import HomeHeader from './HomeHeader';

const HeaderApp = ({ screenName, disable,type }) => {
	// console.log(screenName)
	return (
		<>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginLeft: 6,
						// alignSelf: "flex-start",
					}}
				>
					<Image
						source={logo}
						style={{ width: 35, height: 35 }}
						resizeMode="contain"
					/>
					<Text
						style={{
							color: "#fff",
							fontFamily: "Montserrat_900Black",
							fontSize: 17,
							marginLeft: 2,
						}}
					>
						MeTuBE
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginLeft: 7,
						flex: 0.55,
						justifyContent: "space-between",
						// borderWidth:1,
						marginRight: 7,
						// borderColor:"#000"
					}}
				>
					{screenName !== "you" && (
						<TouchableOpacity>
							<Image
								source={message}
								style={{ width: 21, height: 21 }}
								resizeMode="contain"
							/>
							<View
								style={{
									height: 7,
									width: 7,
									borderRadius: "50%",
									position: "absolute",
									backgroundColor: "red",
									right: 0,
								}}
							></View>
						</TouchableOpacity>
					)}
					<TouchableOpacity>
						<Image
							source={chromecast}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={sub}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
						<View
							style={{
								height: 7,
								width: 7,
								borderRadius: "50%",
								position: "absolute",
								backgroundColor: "red",
								right: 0,
							}}
						></View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							router.push("/search/SearchPage");
						}}
					>
						<Image
							source={search}
							style={{ width: 21, height: 21 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					{screenName === "you" && (
						<TouchableOpacity onPress={()=>{
							router.push("settings");
						}}>
							<Image
								source={gear}
								style={{ width: 21, height: 21 }}
								resizeMode="contain"
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			{type==="home"&&<HomeHeader text={["Gaming","Football","Call of Duty: Mobile","Music","Combat sports"]} />}
		</>
	);
};

export default HeaderApp