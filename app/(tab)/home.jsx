import { View, Text , FlatList, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getContext } from '../../context/GlobalContext';
import { Redirect, SplashScreen } from 'expo-router';
import { bgColor } from '../../constants/colors';
import { fetchVideos, getUSerProfile } from '../../libs/firebase';
import HeaderApp from '../../components/HeaderApp';
import VideosLoading from '../../components/VideosLoading';
import NotFound from '../../components/NotFound';
import VideoView from '../../components/VideoView';
import TrendingShorts from '../../components/TrendingShorts';
import { shuffleArray } from '../../libs/sound';
const shortsPostion = Math.floor(Math.random() * fetchVideos().length);
const home = () => {
	// console.log(shortsPostion)
	const [videos, setVideos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const { setRefreshing, refereshing } = getContext();
	const [isRefreshing, setIsRefreshing] = useState(false)
	useEffect(() => {
		const fetchData = async () => {
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
	// console.log(videos); // Videos are now available here

	const { user, setUsrInfo, usrInfo } = getContext();
	if (!user || (user && !user?.emailVerified))
		return <Redirect href="sign-in" />;
	return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={videos}
				keyExtractor={(item)=>{
					return item.id
				}}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={()=>{
					setIsRefreshing(true)
					setTimeout(()=>{
						setRefreshing(!refereshing);
						setIsRefreshing(false)
					},3000)
				}}/>}
				renderItem={({ item, index }) => {
					if (index === 0)
						return (
							<>
								<TrendingShorts type={"regular"} />
								<VideoView videoInfo={item}/>
							</>
						);
					return <VideoView videoInfo={item} />;
				}}
				ListHeaderComponent={<HeaderApp type={"home"}/>}
				ListEmptyComponent={
					// mfnjefrjek
					<>
						{isLoading && (
							<>
								<VideosLoading />
								<VideosLoading />
							</>
						)}
						{!isLoading && <NotFound />}
					</>
				}
			/>
		</SafeAreaView>
	);
}

export default home
