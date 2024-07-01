import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { adjuster, close } from '../constants/icons';

const CommentsHeader = ({handleClose,text}) => {
  return (
		<View
			style={{
				flexDirection: "row",
				width: "100%",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={{ flexDirection: "row", width: "94%",justifyContent:"space-between" }}>
				<Text
					style={{
						color: "white",
						fontSize: 18,
						fontFamily: "Montserrat_700Bold",
					}}
				>
					{text}
				</Text>
				<View style={{ flexDirection: "row", gap: 15 }}>
					{text==="Comments"&&<TouchableOpacity>
						<Image style={{ width: 30, height: 30 }} source={adjuster} />
					</TouchableOpacity>}
					<TouchableOpacity onPress={handleClose}>
						<Image style={{ width: 30, height: 30 }} source={close} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default CommentsHeader