import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { borderLight, loadingColor } from "../constants/colors";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import { dot, options } from "../constants/icons";
import { getCreatorInfo } from "../libs/firebase";
import { db } from "../libs/config";
import { formatViews } from "../libs/videoUpdates";
import { getContext } from "../context/GlobalContext";
const VideoView = ({videoInfo,type,menu}) => {
	// console.log(videoInfo)
	const [creator, setCreator] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	const [error,setError]=useState()
	// thumbnail={item.thumbnail} id={item.id} 
	const { setRefreshing, refereshing } = getContext();
	useEffect(()=>{
		const fetchCreator = async () => {
			try {
				const users = await getCreatorInfo(videoInfo?.creator);
				setCreator([...users]);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCreator();
	},[refereshing])
	const [views, setViews] = useState(0);
	// console.log(creator)
	useEffect(() => {
		const videoRef = ref(db, `videosRef/${videoInfo?.id}/views`);

		const unsubscribe = onValue(videoRef, (snapshot) => {
			const data = snapshot.val();
			setViews(data || 0);
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [videoInfo?.videoview]);
	// console.log(creator)
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (!type)
					router.push({
						pathname: "video/" + videoInfo?.id,
						params: { ...videoInfo, ...creator[0] },
					});
				else
					router.replace({
						pathname: "video/" + videoInfo?.id,
						params: { ...videoInfo, ...creator[0] },
					});
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
					<View
						style={{
							flexDirection: "row",
							width: "100%",
							margin: 8,
							justifyContent: "center",
						}}
					>
						<TouchableOpacity onPress={
							()=>{
								router.push({
									pathname: "userVideos/aboutVids",
									params: {
										uid: creator[0]?.id,
										photoURL: creator[0]?.image,
										displayName: creator[0]?.name,
										otherChannel: "OtherChannel",
									},
								});
							}
						}>

						<Image
							source={{ uri: creator[0]?.image }}
							style={{
								width: 50,
								height: 50,
								borderRadius: Platform.OS === "ios" ? "50%" : 50,
								borderColor: borderLight,
								borderWidth: 1,
								margin: 3,
								backgroundColor: "#fff",
							}}
						/>
						</TouchableOpacity>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								flexDirection: "row",
							}}
						>
							<View
								style={{
									width: "85%",
									gap: 9,
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
									{videoInfo?.title
										? videoInfo?.title
										: "This is the videos Title for now and still now"}
								</Text>
								<Text
									style={{
										flexWrap: "wrap",
										fontSize: 12,
										color: borderLight,
									}}
								>
									{creator[0]?.name}{" "}
									<View
										style={{
											justifyContent: "center",
											height: 9,
											alignItems: "center",
										}}
									>
										<Image
											source={dot}
											style={{ width: 3, height: 3 }}
											resizeMode="contain"
										/>
									</View>{" "}
									{formatViews(views)}{" "}
									<View
										style={{
											justifyContent: "center",
											height: 9,
											alignItems: "center",
										}}
									>
										<Image
											source={dot}
											style={{ width: 3, height: 3 }}
											resizeMode="contain"
										/>
									</View>{" "}
									1 day ago
								</Text>
							</View>
							<TouchableOpacity onPress={menu}>
								<Image
									source={options}
									style={{ width: 15, height: 15 }}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default VideoView;
