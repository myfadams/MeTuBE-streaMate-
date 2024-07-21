import { View, Text, TouchableOpacity,  ScrollView } from 'react-native'
import { Image } from "expo-image";
import React from 'react'
import { compass } from '../constants/icons';
import { buttonColor, fieldColor } from '../constants/colors';
import OtherViewButtons from './OtherViewButtons';

const HomeHeader = ({text}) => {
    function RenderButtons({buttons,pressedHandler}){
        return buttons.map((button,index)=>{
            return (
                <OtherViewButtons
				key={index}
				title={button}
				styles={{
					// width: 100,
					height: 35,
					backgroundColor:fieldColor,
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 8,
                    paddingLeft:6,
                    paddingRight:6
				}}
			/>
            )
        })
    }
  return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ marginTop: 14 }}
			decelerationRate={"fast"}
		>
			<View
				style={{
					flexDirection: "row",
					marginLeft: 7,
					marginRight: 7,

					gap: 10,
					marginBottom: 6,
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor: fieldColor,
						width: 45,
						height: 35,
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 6,
					}}
				>
					<Image
						source={compass}
						contentFit="contain"
						style={{ width: 25, height: 25 }}
						tintColor={"#fff"}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						backgroundColor: buttonColor,
						width: 45,
						height: 35,
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 6,
					}}
				>
					<Text style={{ color: "white" }}>All</Text>
				</TouchableOpacity>
				<RenderButtons buttons={text} />
			</View>
		</ScrollView>
	);
}

export default HomeHeader