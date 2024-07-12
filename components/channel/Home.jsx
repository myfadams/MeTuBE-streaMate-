import { View, Text, FlatList } from 'react-native'
import React from 'react'

const Home = () => {
  return (
		<FlatList
			data={[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]}
			renderItem={({ item, index }) => {
				return (
					<Text style={{ fontSize: 20, color: "white", margin: 20 }}>
						Vde uploadFeatures
					</Text>
				);
			}}
		/>
		// {/* <Text style={{fontSize:20, color:"white"}}>Vde uploadFeatures</Text> */}
	);
}

export default Home