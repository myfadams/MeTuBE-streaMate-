import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React from 'react'
import ShortComponent from './ShortComponent';
import { shortLogo } from '../constants/icons';
import { FlatList } from 'react-native-gesture-handler';

const TrendingShorts = ({type}) => {
	
  return (
		<View style={{ gap: 20 }}>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
				<Image
					source={shortLogo}
					style={{ width: 46, height: 46 }}
					resizeMode="contain"
				/>
				<Text
					style={{
						color: "#fff",
						fontFamily: "Montserrat_700Bold",
						fontSize: 20,
						marginLeft: 2,
					}}
				>
					Shorts
				</Text>
			</View>
			{type==="regular"&&<>
				<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
					<ShortComponent title={"This is the ttile 1"} />
					<ShortComponent title={"This is the ttile 2"} />
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
					<ShortComponent title={"This is the ttile 3"} />
					<ShortComponent title={"This is the ttile 4"} />
				</View>
			</>}
			{
				type==="suggested"&&
				<FlatList 
				horizontal
				data={[1,2,3,4,5,6]}
				showsHorizontalScrollIndicator={false}
				decelerationRate={"fast"}
				renderItem={({item,index})=>{
					return <ShortComponent title={"Suggested shorts "+index} marginVid={8}/>
				}}/>
			}
		</View>
	);
}

export default TrendingShorts