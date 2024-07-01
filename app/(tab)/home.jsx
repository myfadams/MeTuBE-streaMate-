import { View, Text , FlatList} from 'react-native'
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
const shortsPostion = Math.floor(Math.random() * fetchVideos().length);
const home = () => {
	console.log(shortsPostion)
	const [videos, setVideos] = useState()
	const [isLoading, setIsLoading]= useState(false)

	useEffect(()=>{
		setIsLoading(true)
		// const getVideos = async()=>{
		// 	return await fetchVideos()

		// }
		setVideos(fetchVideos())
		setTimeout(()=>{
			setIsLoading(false);
		},3000)

	},[])
	// console.log(fetchVideos())
	

	const { user, setUsrInfo, usrInfo } = getContext();
	if(!user  || user && !user.emailVerified)
		return <Redirect href="sign-in"/>
  return (
		<SafeAreaView style={{ backgroundColor: bgColor, height: "100%" }}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={fetchVideos()}
				renderItem={({item,index}) => {
					// console.log(Math.floor(Math.random() * fetchVideos().length));
					if (index === shortsPostion)
						return (
							<>
								<VideoView thumbnail={item.thumbnail} id={item.id} />
								<TrendingShorts type={"regular"}/>
							</>
						);
					return <VideoView thumbnail={item.thumbnail} id={item.id}/>;

				}}
				ListHeaderComponent={<HeaderApp />}
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
