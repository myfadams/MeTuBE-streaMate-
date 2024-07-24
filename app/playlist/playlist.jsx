import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getContext } from "../../context/GlobalContext";
import { get, ref } from "firebase/database";
import { db } from "../../libs/config";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OtherChannelVideo from "../../components/OtherChannelVideo";
import { bgColor } from "../../constants/colors";
import PlayListHeader from "../../components/PlayListHeader";
import { back, options, search } from "../../constants/icons";
import { Image } from "expo-image";
const playlist = () => {
	const { user } = getContext();
	const { type } = useLocalSearchParams();
	// console.log(user)
  
  const [textLayout, setTextLayout] = useState(null);
	const [isTextVisible, setIsTextVisible] = useState(true);
	const flatListRef = useRef(null);

	const onHeaderTextLayout = (event) => {
		const { x, y, width, height } = event.nativeEvent.layout;
		setTextLayout({ x, y, width, height });
	};

  const onScroll = (event) => {
		const { contentOffset, layoutMeasurement } = event.nativeEvent;
		if (textLayout) {
			const { y, height } = textLayout;
			const viewportHeight = layoutMeasurement.height;

			// Check if the text is within the visible viewport
			const isVisible =
				y + height > contentOffset.y && y < contentOffset.y + viewportHeight;
			setIsTextVisible(isVisible);
		}
	};
  // console.log("Video Visible: "+isTextVisible)
  const [videos, setvideos] = useState([])
  async function fetchVideo(type,id){
    const tRef = ref(db, `${type}/${id}`);
     const vidRes = await get(tRef);
     let t = vidRes.val();
     return {id:id,...t};
  }
	useEffect(() => {
		const playlistRef = ref(db, `playlist/${user?.uid}/${type}`);
		async function getPlayList() {
			try {
				const res = await get(playlistRef);
				const plist = res.val();

				// Use map to create an array of promises
				const fetchPromises = plist?.map(async (vidId) => {
					if (type === "likedShorts") {
						return fetchVideo("shortsRef", vidId);
					} else if (type === "likedVideos") {
						return fetchVideo("videosRef", vidId);
					} else {
            async function tempFunc(){
               const t =await fetchVideo("shortsRef", vidId);
               const items = Object.keys(t).length;
               if(items<=1){
                return fetchVideo("videosRef", vidId);
               }else{
                 return fetchVideo("shortsRef", vidId);
               }
               
            }
            
						return tempFunc();
					}
				});

				// Wait for all promises to resolve
				const temp = await Promise.all(fetchPromises);
        temp.reverse()
				// console.log(temp);
				setvideos([...temp]);
			} catch (error) {
				console.error("Error fetching playlist or videos:", error);
			}
		}

		getPlayList();

	}, []);
  // console.log(videos)
  const insets = useSafeAreaInsets();
	return (
		<View style={{ height: "100%", backgroundColor: bgColor, width:"100%"}}>
			<View
				style={{
					paddingTop: insets.top,
					flexDirection: "row",
          paddingBottom:6,
					justifyContent: "space-between",
					alignItems: "center",
          position:"absolute",
          width:"100%",
          zIndex:1,
          paddingHorizontal:"3%",
          backgroundColor:isTextVisible?null:bgColor
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						style={{}}
						activeOpacity={0.7}
						onPress={() => {
							router.push("../");
						}}
					>
						<Image
							source={back}
							contentFit="contain"
							style={{ width: 30, height: 30 }}
						/>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 30,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							router.push("/search/SearchPage");
						}}
					>
						<Image
							source={search}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
							tintColor={"#fff"}
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<Image
							source={options}
							style={{ width: 21, height: 21 }}
							contentFit="contain"
						/>
					</TouchableOpacity>
				</View>
			</View>
			<FlatList
				data={videos}
        ref={flatListRef}
				renderItem={({ item, index }) => {
					if (type === "likedShorts")
						return <OtherChannelVideo video={item} type={"short"} />;
					return <OtherChannelVideo video={item} />;
				}}
				keyExtractor={(item) => {
					return item.id;
				}}
				ListHeaderComponent={<PlayListHeader firstVideo={videos[0]} title={type} noVideos={videos?.length} onLayout={onHeaderTextLayout}/>}
				contentInset={{ bottom: insets.bottom }}
        onScroll={onScroll}
			/>
		</View>
	);
};

export default playlist;
