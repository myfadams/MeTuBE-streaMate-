import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import React from "react";
import { borderLight, loadingColor } from "../constants/colors";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import { options } from "../constants/icons";
const VideoView = ({videoInfo,type}) => {
	// thumbnail={item.thumbnail} id={item.id} 
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if(!type)
					router.push({pathname:"video/" + videoInfo.id,params:videoInfo});
				else
					router.replace({ pathname: "video/" + videoInfo.id, params: videoInfo });
				
			}}
		>
			<View>
				<View
					style={{
						width: "100%",
						marginTop: 20,
					}}
				>
					<View
						style={{
							width: "100%",
							height: 220,
							// backgroundColor: loadingColor,
							// opacity: 0.6,
						}}
					>
						<Image
							source={{ uri: videoInfo?.thumbnail }}
							style={{
								width: "100%",
								height: "100%",
								backgroundColor: "#1A1818",
							}}
							resizeMode="contain"
						/>
					</View>
					<View style={{ flexDirection: "row", width: "100%", margin: 8, justifyContent:"center" }}>
						<Image
							style={{
								width: 50,
								height: 50,
								borderRadius: "50%",
								borderColor: "#000",
								borderWidth: 1,
								margin: 3,
								backgroundColor: "#fff",
							}}
						/>
						<View style={{ flex:1, justifyContent: "center" ,flexDirection:"row"}}>
							<View
								style={{
									width: "85%",
									gap:9
								}}
							>
								<Text
									numberOfLines={2}
									style={{
										color: "#fff",
										fontFamily: "Montserrat_500Medium",
										fontSize: 16,
									}}
								>
									{videoInfo?.title?videoInfo?.title:"This is the videos Title for now and still now"}
								</Text>
								<Text
									style={{
										
										
										flexWrap: 1,
										fontSize:12,
										color:borderLight,
									}}
								>Channel_name . 491k views . 1 day ago </Text>
							</View>
							<TouchableOpacity>
								
							<Image source={options} style={{width:15,height:15}} resizeMode="contain"/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default VideoView;
