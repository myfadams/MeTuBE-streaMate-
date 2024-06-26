import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TouchableHighlight,
	StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { buttonColor, loadingColor } from "../constants/colors";
import { comment, dislike, like, share } from "../constants/icons";

const ShortsView = ({ sourceUrl, title }) => {
	const [likeClicked, setLikeClicked] = useState(false);
	const [dislikeClicked, setDisLikeClicked] = useState(false);
	function addLike() {
		if (!likeClicked) {
			setLikeClicked(true);
			setDisLikeClicked(false);
		} else setLikeClicked(false);
	}
	function addDislike() {
		if (!dislikeClicked) {
            console.log("dislike")
			setLikeClicked(false);
			setDisLikeClicked(true);
		} else setDisLikeClicked(false);
	}
	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				backgroundColor: loadingColor,
			}}
		>
			<Video resizeMode={ResizeMode.COVER} shouldPlay={true} />
			<View
				style={{
					position: "absolute",
					right: 15,
					top: "40%",
					gap: 30,
					justifyContent: "center",
				}}
			>
				<TouchableOpacity onPress={addLike}>
					<Image
						source={like}
						style={styles.button}
						tintColor={likeClicked ? buttonColor : "#fff"}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={addDislike}>
					<Image
						source={dislike}
						style={styles.button}
						tintColor={dislikeClicked ? buttonColor : "#fff"}
					/>
				</TouchableOpacity>
				<TouchableOpacity>
					<Image source={comment} style={styles.button} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Image source={share} style={styles.button} tintColor={"#fff"} />
				</TouchableOpacity>
				{/* <TouchableOpacity></TouchableOpacity> */}
			</View>
			<View style={{ position: "absolute", bottom:20, left:10 }}>
				<View
					style={{
						flexDirection: "row",
						// justifyContent: "space-between",
                        alignItems:"center",
                        gap:20,
						width: "70%",
					}}
				>
					<Image style={{ width: 45, height: 45,  backgroundColor:"#000", borderRadius:"50%"}} />
					<TouchableOpacity
						style={{ width: 100, height: 30, backgroundColor: buttonColor,justifyContent:"center",alignItems:"center",borderRadius:3,  }}
					>
						<Text style={{color:"#fff"}}>Subscribe</Text>
					</TouchableOpacity>
				</View>
				<Text style={{fontSize:18, margin:8,color:"#fff"}} numberOfLines={1}>Shorts discription for now</Text>
			</View>
			<Text>ShortsView</Text>
		</View>
	);
};

export default ShortsView;

const styles = StyleSheet.create({
	button: {
		width: 43,
		height: 43,
	},
});
