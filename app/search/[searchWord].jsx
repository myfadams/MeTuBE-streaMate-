import {
	View,
	Text,
	// SafeAreaView,
	FlatList,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import { Image } from "expo-image";
import React, { memo, useEffect, useState } from "react";
import { bgColor, fieldColor, loadingColor } from "../../constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import SearchFields from "../../components/SearchField";
import { arrow, search, shortLogo, timeMachine } from "../../constants/icons";
import { getArray, saveArray } from "../../libs/otherFunctions";
import { fetchVideoTitles, searchEntries, sortBySearchResults, sortBySearchTerm } from "../../libs/search";
import VideoView from "../../components/VideoView";
import TrendingShorts from "../../components/TrendingShorts";
import ShortComponent from "../../components/ShortComponent";
import ChannelComponent from "../../components/channel/ChannelComponent";
import { getContext } from "../../context/GlobalContext";
import { get, ref } from "firebase/database";
import { db, usersRef } from "../../libs/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const searchView = () => {
	const { searchWord: pageName } = useLocalSearchParams();
	const { user } = getContext();
	const [isActive, setIsActive] = useState(false);

	const SearchResHeader = ({ shorts, channels }) => {
		return (
			<View style={{ gap: 20, marginTop: 10, marginBottom: 20 }}>
				{channels?.map((channel, id) => {
					if (channel?.id !== user?.uid)
						return <ChannelComponent channel={channel} key={id} />;
				})}
				{shorts?.length > 0 && (
					<>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Image
								source={shortLogo}
								style={{ width: 40, height: 40 }}
								contentFit="contain"
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
						<FlatList
							horizontal
							data={shorts}
							keyExtractor={(item) => item.id}
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
					</>
				)}
			</View>
		);
	};

	
	const [items, setItems] = useState([]);
	const [searchResultVideos, setSearchResultVideos] = useState([]);
	const [searchResultShorts, setSearchResultShorts] = useState([]);
	const [searchResultChannel, setSearchResultChannels] = useState([]);
	const [searchHistory, setSearchHistory] = useState({
		searchTerm: "",
		imageClicked: "",
	});
	const [suggestions, setSuggestions] = useState();
	const [dbSuggestions, setDbSuggestions] = useState([]);
	useEffect(() => {
		const loadItems = async () => {
			const storedItems = await getArray();
			setItems(storedItems);
			setSuggestions(storedItems);
		};
		loadItems();
		fetchVideoTitles().then((res) => {
			setDbSuggestions(res);
		});
		console.log("pagename: " + pageName);
		if (pageName !== "SearchPage") {
			setSearchHistory({ ...searchHistory, searchTerm: pageName });

			searchEntries(pageName, "videosRef", "title").then((res) => {
				return searchEntries(pageName, "usersref", "name").then((r) => {
					const userVideoPromises = r.map((ch) =>
						searchEntries(ch.id, "videosRef", "creator")
					);

					return Promise.all(userVideoPromises).then((results) => {
						let combinedResults = [];

						results.forEach((c) => {
							const otherVids = c.filter(
								(vid) =>
									!res.some((v) => JSON.stringify(v) === JSON.stringify(vid))
							);
							combinedResults = [...combinedResults, ...otherVids];
						});

						setSearchResultVideos(
							sortBySearchResults(
								[...res, ...combinedResults],
								pageName,
								"title"
							)
						);
					});
				});
			});

			searchEntries(pageName, "shortsRef", "caption").then((res) => {
				return searchEntries(pageName, "usersref", "name").then((r) => {
					const userShortsPromises = r.map((ch) =>
						searchEntries(ch.id, "shortsRef", "creator")
					);

					return Promise.all(userShortsPromises).then((results) => {
						let combinedResults = [];

						results.forEach((c) => {
							const otherVids = c.filter(
								(vid) =>
									!res.some((v) => JSON.stringify(v) === JSON.stringify(vid))
							);
							combinedResults = [...combinedResults, ...otherVids];
						});

						setSearchResultShorts(
							sortBySearchResults(
								[...res, ...combinedResults],
								pageName,
								"caption"
							)
						);
					});
				});
			});

			searchEntries(pageName, "usersref", "name").then((res) => {
				setSearchResultChannels(sortBySearchResults(res,pageName,"name"));
			});
		}
	}, [pageName]);

	const addToSearchHistory = async (type="") => {
		// const updatedItems = [...items, searchHistory];
		if(type===""){
			const updatedItems = items.filter((it) => {
				return it.searchTerm !== searchHistory.searchTerm;
			});
			updatedItems.push(searchHistory);
			setItems(updatedItems);
			await saveArray(updatedItems);
		}else{
			const updatedItems = items.filter((it) => {
				return it.searchTerm !==type;
			});
			updatedItems.push({"imageClicked": "", "searchTerm": type});
			setItems(updatedItems);
			await saveArray(updatedItems);
		}
	};

	const handleTextChange = (text) => {
		setSearchHistory({ ...searchHistory, searchTerm: text });
		let tempText= text.trimStart().trimEnd()
		// console.log(dbSuggestions[0])
		if (tempText!== "") {
			setSuggestions(
				sortBySearchTerm(
					[
						...items.filter((it) => {
							return it.searchTerm
								.toLocaleLowerCase()
								.includes(tempText.toLocaleLowerCase());
						}),
						...dbSuggestions.filter((dbS) => {
							return dbS?.searchTerm
								?.toLocaleLowerCase()
								.includes(tempText.toLocaleLowerCase());
						}),
					],
					text
				)
			);
		}
		if (text.trim() === "") {
			setSuggestions(items);
		}
	};

	async function handleSubmit() {
		if (searchHistory.searchTerm.trim() !== "") {
			router.replace("search/" + searchHistory.searchTerm);
			await addToSearchHistory();
			setSuggestions([]);
		}
	}

	const SearchViewItem = ({ text, image, type }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					// console.log("this: "+text);
					router.replace("search/" + text);
					setSearchHistory({ ...searchHistory, searchTerm: text });
					addToSearchHistory(text).then(console.log("done"));
				}}
				activeOpacity={0.7}
				style={{
					flexDirection: "row",
					gap: 15,
					justifyContent: "center",
					backgroundColor: fieldColor,
					marginBottom: 10,
					paddingVertical: 20,
					alignItems: "center",
					borderRadius: 19,
					marginHorizontal: 13,
					paddingHorizontal: 15,
				}}
			>
				<Image
					source={type ? search : timeMachine}
					style={{ width: 20, height: 20 }}
					tintColor={"#fff"}
				/>
				<Text
					numberOfLines={2}
					style={{
						color: "#fff",
						fontSize: 17,
						fontFamily: "Montserrat_400Regular",
						flex: 1,
					}}
				>
					{text}
				</Text>
				{image !== "" && image && (
					<Image
						style={{
							backgroundColor: "#000",
							width: 50,
							height: 30,
							borderRadius: 6,
						}}
						source={{ uri: image }}
						contentFit="fill"
					/>
				)}
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						setSearchHistory({ ...searchHistory, searchTerm: text });
						
					}}
				>
					<Image
						source={arrow}
						style={{ width: 20, height: 20 }}
						tintColor={"#fff"}
						contentFit="contain"
					/>
				</TouchableOpacity>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
			<View style={{ flex: 1, width: "100%" }}>
				<SearchFields
					name={pageName.SearchWord}
					placeholderText={"Search StreaMate"}
					value={searchHistory.searchTerm}
					handleChange={handleTextChange}
					handleSubmit={handleSubmit}
					setActive={setIsActive}
				/>
				<View style={{ marginTop: 10, width: "100%", flex: 1 }}>
					{(pageName === "SearchPage" || isActive) && (
						<KeyboardAwareFlatList
							style={{ marginTop: 20 }}
							data={suggestions}
							renderItem={({ item, index }) => {
								return (
									<SearchViewItem
										text={item.searchTerm}
										image={item.imageClicked}
										type={item.type}
									/>
								);
							}}
							keyExtractor={(item, index) => {
								return index.toString();
							}}
						/>
					)}
					{(searchResultVideos?.length > 0 ||
						searchResultShorts?.length > 0 ||
						searchResultChannel?.length > 0) &&
						!isActive && (
							<FlatList
								showsVerticalScrollIndicator={false}
								data={searchResultVideos}
								style={{ paddingHorizontal: 10 }}
								keyExtractor={(item, id) => item.id}
								renderItem={({ item, index }) => {
									return <VideoView videoInfo={item} />;
								}}
								ListHeaderComponent={
									<SearchResHeader
										shorts={searchResultShorts}
										channels={searchResultChannel}
									/>
								}
							/>
						)}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default memo(searchView);
