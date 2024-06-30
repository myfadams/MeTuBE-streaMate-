import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const OtherViewButtons = ({title, handlePress,styles}) => {
  return (
		<TouchableOpacity
			style={styles}
		>
			<Text style={{ color: "#fff" }}>{title}</Text>
		</TouchableOpacity>
	);
}

export default OtherViewButtons