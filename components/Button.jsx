import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { bgColor, borderPrimary, buttonColor, otherColor } from '../constants/colors';


const Button = ({title,handlePress,isLoading}) => {
  return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={handlePress}
			disabled={isLoading}
			style={{
				width: "92%",
				height: 67,
				justifyContent: "center",
				borderRadius: 10,
				borderColor: borderPrimary,
				borderWidth: 1,
				alignItems: "center",
				backgroundColor: buttonColor,
				opacity: isLoading?0.7:1
				
			}}
		>
			<Text
				style={{
					color: "#fff",
					fontWeight: "700",
					fontSize: "21%",
					fontFamily: "Montserrat_600SemiBold",
				}}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

export default Button