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
import { shuffleArray } from "../libs/sound";
import { getContext } from "../context/GlobalContext";

const ShortView = ({shorts}) => {
	return shorts.map((value,index) => {
		if(index<=3)
			return <ShortComponent title={value?.caption} short={value} key={value.id}/>;
		
	});
};
const TrendingShorts = ({ type,data,subs }) => {
	const { refereshing } = getContext();
	const [shorts, setShorts] = useState([]);
	const [error, setError] = useState();
	// console.log(refereshing);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const shortsData = await fetchShorts();
				const tempdata = shuffleArray(shortsData?.slice());
				// console.log(tempdata);
				// setShorts([...shortsData]);
				setShorts([...tempdata]);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, [refereshing]);
	// console.log(subs)
	const subsShorts = shorts.filter((sh)=>{
		return subs?.includes(sh.creator)
	})

	// console.log(subsShorts)
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
								flexWrap: "wrap",
							}}
						>
							<ShortView shorts={shorts}/>
						</View>
					
						
					</>
				)}
				{type === "suggested" && (
					<FlatList
						horizontal
						data={data ? subsShorts :shorts}
						keyExtractor={(item)=>(item.id)}
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
