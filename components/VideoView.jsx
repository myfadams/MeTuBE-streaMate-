import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'
import { loadingColor } from '../constants/colors';
import * as Animatable from "react-native-animatable";
const VideoView = ({creator,thumbnail,title,url}) => {
    // console.log(thumbnail)
  return (
		<View>
				<View
					style={{
						width: "100%",
						marginTop: 30,
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
                        <Image source={{uri:thumbnail}} style={{width:"100%", height:"100%"}} resizeMode='contain'/>
                    </View>
					<View style={{ flexDirection: "row", width: "95%", margin: 8 }}>
						<View
							style={{
								width: 50,
								height: 50,
								borderRadius: "50%",
								borderColor: "#000",
								borderWidth: 1,
								margin: 3,
								// backgroundColor: loadingColor,
								opacity: 0.6,
							}}
						></View>
						<View style={{ width: "90%", justifyContent: "center" }}>
							<View
								style={{
									width: "95%",
									height: 16,
									backgroundColor: loadingColor,
									borderColor: "#000",
									borderWidth: 1,
									opacity: 0.6,
									marginTop: 5,
									marginBottom: 5,
								}}
							></View>
							<View
								style={{
									width: "95%",
									height: 16,
									backgroundColor: loadingColor,
									borderColor: "#000",
									borderWidth: 1,
									opacity: 0.6,
									marginBottom: 5,
								}}
							></View>
							<View
								style={{
									width: "95%",
									height: 16,
									backgroundColor: loadingColor,
									borderColor: "#000",
									borderWidth: 1,
									opacity: 0.6,
									marginBottom: 5,
								}}
							></View>
						</View>
					</View>
				</View>
		</View>
	);
}

export default VideoView;
