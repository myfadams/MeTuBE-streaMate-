// storageHelper.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authentication } from "./config";


export const getArray = async () => {
	const STORAGE_KEY = "searchHistory/"+authentication?.currentUser?.uid;
	try {
		const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
		return jsonValue != null ? JSON.parse(jsonValue).reverse() : [];
	} catch (e) {
		console.error("Error reading value", e);
	}
};

export const saveArray = async (value) => {
	const STORAGE_KEY = "searchHistory/" + authentication?.currentUser?.uid;
	// console.log(value);
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
	} catch (e) {
		console.error("Error saving value", e);
	}
};
AsyncStorage.getAllKeys().then((dta)=>{
	console.log(dta)
})
// AsyncStorage.removeItem("searchHistory/ZYVTFArpv7dMSdgDBfgSz3x2r2p2");


export function combineAndGroupByDate(shorts, videos) {
	const resultMap = new Map();

	// Helper function to add videos to the map
	function addToMap(arr, type) {
		arr.forEach((group) => {
			group.forEach((item) => {
				const date = item.date.split("T")[0];
				if (!resultMap.has(date)) {
					resultMap.set(date, { shorts: [], videos: [] });
				}
				resultMap.get(date)[type].push(item);
			});
		});
	}

	// Add shorts and videos to the map
	addToMap(shorts, "shorts");
	addToMap(videos, "videos");

	// Convert the map to the required format
	const resultArray = Array.from(resultMap, ([date, { shorts, videos }]) => {
		return [shorts, videos];
	});

	// Sort the result array by date in descending order
	resultArray.sort(
		(a, b) =>
			new Date(b[0]?.[0]?.date || b[1]?.[0]?.date) -
			new Date(a[0]?.[0]?.date || a[1]?.[0]?.date)
	);

	return resultArray;
}


const deepEqual = (obj1, obj2) => {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const areArraysEqual = (arr1, arr2) => {
	return (
		arr1.find((item1) => arr2.find((item2) => deepEqual(item1, item2))) !==
		undefined
	);
};