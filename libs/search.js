// searchHelper.js
import { ref, get } from "firebase/database";
import { db } from "./config";

export const searchEntries = async (searchTerm, collection,searchKey) => {
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


