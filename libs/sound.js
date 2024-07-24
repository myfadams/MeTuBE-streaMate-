import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
export const configureAudio = async () => {
	try {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true, // Ensure sound plays even in silent mode
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
		});
		console.log("Audio mode configured successfully");
	} catch (error) {
		console.error("Failed to set audio mode:", error);
	}
};

export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

 export  async function OpenImageView(type){
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: type !== "cover",
		aspect: type !== "cover" ? [1, 1] : [16, 9],
		quality: 1,
	});
		if (!result.canceled) {
			// console.log(result.assets[0]);
			return result.assets[0].uri;
		}
}

export const renameKey = (obj, oldKey, newKey) => {
	// Check if the oldKey exists in the object
	if (obj.hasOwnProperty(oldKey)) {
		obj[newKey] = obj[oldKey]; // Add the new key with the old value
		delete obj[oldKey]; // Delete the old key
	}
};

export function groupData(events){
	return events.reduce((acc, event) => {
		// Format the date to a string to use as a key (ignores time)
		const dateKey = event.date;

		// Check if the date key already exists in the accumulator
		if (!acc[dateKey]) {
			acc[dateKey] = [];
		}

		// Push the event into the appropriate date group
		acc[dateKey].push(event);

		return acc;
	}, {});

}


export function formatDate(dateString) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  // Check if the date is today
  if (inputDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Check if the date is yesterday
  if (inputDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Check if the date is within the current week
  if (inputDate >= startOfWeek && inputDate <= endOfWeek) {
    return daysOfWeek[inputDate.getDay()];
  }

  // Otherwise, return the month and day
  return `${months[inputDate.getMonth()]} ${inputDate.getDate()}`;
}
