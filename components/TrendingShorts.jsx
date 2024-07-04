import {
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import ShortComponent from "./ShortComponent";
import { shortLogo, shorts } from "../constants/icons";
import { FlatList } from "react-native-gesture-handler";
import { fetchShorts } from "../libs/firebase";

const ShortView = ({shorts}) => {
	return shorts.map((value,index) => {
		if(index<=3)
			return <ShortComponent title={value?.caption} short={value} key={value.id}/>;
		
	});
};
const TrendingShorts = ({ type }) => {
	const [shorts, setShorts] = useState([]);
	const [error, setError] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const shortsData = await fetchShorts();
				// console.log(shortsData);
				setShorts([...shortsData]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);
	if (shorts.length > 0)
		return (
			<View style={{ gap: 20, marginTop: 25, marginBottom: 20 }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
					<Image
						source={shortLogo}
						style={{ width: 40, height: 40 }}
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
				{type === "regular" && (
					<>
						<View
							style={{
								flexDirection: "row",
								
								gap:10,
								flexWrap: 1,
							}}
						>
							<ShortView shorts={shorts}/>
						</View>
					
						
					</>
				)}
				{type === "suggested" && (
					<FlatList
						horizontal
						data={shorts}
						showsHorizontalScrollIndicator={false}
						decelerationRate={"fast"}
						renderItem={({ item, index }) => {
							return (
								<ShortComponent
									title={item?.caption}
									marginVid={8}
									short={item}
								/>
							);
						}}
					/>
				)}
			</View>
		);
};

export default TrendingShorts;
