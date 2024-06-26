import { View, Text, FlatList,Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { bgColor } from '../../constants/colors';
import ShortsView from '../../components/ShortsView';
import WrapperComponent from "../../components/CommentSection";

const windowHeight = Dimensions.get("window").height;


const shorts = () => {
  return (
		<View style={{ backgroundColor: bgColor, height: "100%", flex: 1 }}>
			<FlatList
				data={[1, 2, 3, 4, 5]}
				// contentContainerStyle={{flexGrow:1}}
				pagingEnabled
				snapToAlignment="start"
				decelerationRate="fast"
        showsVerticalScrollIndicator={false}
				renderItem={(item) => {
					return (
	
						<View style={{ height: (windowHeight-80), borderTopWidth: 0.7, borderBottomWidth: 0.7 }}>
							<ShortsView sourceUrl={require("../../tempVid/small.mp4")}/>
						</View>
					);
				}}
			/>
		</View>
	);
}

export default shorts