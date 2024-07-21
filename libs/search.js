// searchHelper.js
import { ref, get } from "firebase/database";
import { db } from "./config";

export const searchEntries = async (searchTerm, collection, searchKey) => {
	try {
		const dbRef = ref(db, collection);
		const snapshot = await get(dbRef);
		const data = snapshot.val();
		// console.log(data)
		const results = [];
		for (const key in data) {
			if (
				data[key][searchKey] &&
				data[key][searchKey].toLowerCase().includes(searchTerm.toLowerCase())
			) {
				results.push({ id: key, ...data[key] });
			}
		}
		// console.log(results)
		return results;
	} catch (error) {
		console.error("Error searching entries:", error);
		return [];
	}
};

function simpleFetch(snapshot, type) {
	if (snapshot.exists()) {
		// Access the data
		const videoObjects = snapshot.val();

		// Extract video titles
		const videoTitles = Object.keys(videoObjects).map((key) => ({
			type: "suggestion",
			searchTerm: videoObjects[key][type],
		}));

		// console.log(videoTitles);
		return videoTitles;
	} else {
		console.log("No data available");
		return [];
	}
}
export const fetchVideoTitles = async () => {
	try {
		const shortRef = ref(db, "shortsRef");
		const vidRef = ref(db, "videosRef");
		const usersRef = ref(db, "usersref");
		const snapshotShorts = await get(shortRef);
		const snapshotVids = await get(vidRef);
		const snapshotUsers = await get(usersRef);
		simpleFetch(snapshotShorts, "caption");
		simpleFetch(snapshotVids, "title");
		simpleFetch(snapshotUsers, "name");
		return [
			...simpleFetch(snapshotShorts, "caption"),
			...simpleFetch(snapshotVids, "title"),
			...simpleFetch(snapshotUsers, "name"),
		];
	} catch (error) {
		console.error("Error fetching video titles:", error);
		return []
	}
};

export const sortBySearchTerm = (array, searchTerm) => {
	const lowerSearchTerm = searchTerm.toLowerCase();

	return array.sort((a, b) => {
		const aName = a.searchTerm.toLowerCase();
		const bName = b.searchTerm.toLowerCase();

		const scoreA = getMatchScore(aName, lowerSearchTerm);
		const scoreB = getMatchScore(bName, lowerSearchTerm);

		// Sort primarily by score, then alphabetically if scores are equal
		return scoreB - scoreA || aName.localeCompare(bName);
	});
};

const getMatchScore = (word, term) => {
	// Score based on position of term in the word
	const position = word.indexOf(term);

	// Higher score if the term is at the beginning
	// Lower score if term is further in the word
	// Use a large negative number if term is not found
	return position === 0 ? 1000 : position > 0 ? 1000 - position : 0;
};


export const sortBySearchResults = (array, searchTerm,type) => {
	const lowerSearchTerm = searchTerm.toLowerCase();

	return array.sort((a, b) => {
		const aName = a[type].toLowerCase();
		const bName = b[type].toLowerCase();

		const scoreA = getMatchScore(aName, lowerSearchTerm);
		const scoreB = getMatchScore(bName, lowerSearchTerm);

		// Sort primarily by score, then alphabetically if scores are equal
		return scoreB - scoreA || aName.localeCompare(bName);
	});
};

