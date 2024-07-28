import { View, Text , FlatList, RefreshControl, Platform} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getContext } from '../../context/GlobalContext';
import { Redirect, SplashScreen, useFocusEffect } from 'expo-router';
import { bgColor } from '../../constants/colors';
import { fetchVideos, getUSerProfile } from '../../libs/firebase';
import HeaderApp from '../../components/HeaderApp';
import VideosLoading from '../../components/VideosLoading';
import NotFound from '../../components/NotFound';
import VideoView from '../../components/VideoView';
import TrendingShorts from '../../components/TrendingShorts';
import { shuffleArray } from '../../libs/sound';
import Menu from '../../components/Menu';
import { getUploadTimestamp } from '../../libs/videoUpdates';
import { StatusBar } from "expo-status-bar";
import { sendNotifications } from '../../libs/notifications';
const shortsPostion = Math.floor(Math.random() * fetchVideos().length);
const home = () => {
	// console.log(shortsPostion)
	const { user, isConnected } = getContext();
	const [videos, setVideos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const { setRefreshing, refereshing } = getContext();
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [menuVisiblity,setMenuVisiblity]= useState(false)

	const [isMenuVisible, setIsMenuVisible] = useState(false);
	useFocusEffect(useCallback(()=>{
		setMenuVisiblity(true);
		return () => {
			// This will be called when the screen is unfocused
			// console.log("Screen is unfocused");
			setMenuVisiblity(false);
		};
	}, []))
	const handleCloseMenu = () => {
		setIsMenuVisible(false);
	};
	const [videId, setVideId] = useState("")
	const handleToggleMenu = (id) => {
		setIsMenuVisible(!isMenuVisible);
		setVideId(id)
	};
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const videoData = await fetchVideos();
				const tempdata = shuffleArray(videoData?.slice());
				// console.log(videoData)
				setVideos([...tempdata]);
				
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [refereshing]);
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const videoData = await fetchVideos();
				const tempdata = shuffleArray(videoData?.slice());
				// console.log(videoData)
				setVideos([...tempdata]);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		if(isConnected)
			fetchData();
	}, [isConnected]);
	
	// console.log(videos); // Videos are now available here

	
	// console.log(user)
	const insets = useSafeAreaInsets();
	if (!user || (user && !user?.emailVerified))
		return <Redirect href="sign-in" />;
	return (
		<View style={{ backgroundColor: bgColor, height: "100%", paddingTop:insets.top}}>
			<FlatList
		
				scrollEnabled={
					(isConnected && videos.length !== 0) || videos.length !== 0
				}
				style={{paddingHorizontal:10}}
				showsVerticalScrollIndicator={false}
				data={videos}
				keyExtractor={(item) => {
					return item.id;
				}}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						colors={Platform.OS === "android" && ["#fff"]}
						tintColor={Platform.OS === "ios" && "#fff"}
						onRefresh={() => {
							setIsRefreshing(true);
							setTimeout(() => {
								setRefreshing(!refereshing);
								setIsRefreshing(false);
							}, 1500);
						}}
					/>
				}
				renderItem={({ item, index }) => {
					if (index === 0)
						return (
							<>
								<TrendingShorts type={"regular"} />
								<VideoView
									videoInfo={item}
									menu={() => {
										handleToggleMenu(item.id);
									}}
								/>
							</>
						);
					return (
						<VideoView
							videoInfo={item}
							menu={() => {
								handleToggleMenu(item.id);
							}}
						/>
					);
				}}
				ListHeaderComponent={<HeaderApp type={"home"} />}
				ListEmptyComponent={
					// mfnjefrjek
					<>
						{isLoading && !isConnected && (
							<>
								<VideosLoading />
								<VideosLoading />
							</>
						)}
						{!isLoading && !isConnected && (
							<>
								<VideosLoading />
								<VideosLoading />
							</>
						)}

						{!isLoading && isConnected && <NotFound channelInfoID={user?.uid}/>}
					</>
				}
			/>
			{menuVisiblity && (
				<Menu
					isVisible={isMenuVisible}
					onClose={handleCloseMenu}
					vidId={videId}
					userId={user.uid}
				/>
			)}
			<StatusBar style="light" />
		</View>
	);
}

export default home
