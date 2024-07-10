import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const OtherViewButtons = ({title, handlePress,styles,isActive,id}) => {
  return (
		<TouchableOpacity
			onPress={handlePress}
			style={styles}
		>
			<Text style={{ color:(isActive &&isActive===id) ?"#000": "#fff" }}>{title}</Text>
		</TouchableOpacity>
	);
}

export default OtherViewButtons