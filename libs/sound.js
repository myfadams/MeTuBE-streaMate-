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

 export  async function OpenImageView(){
	const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,

			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			// console.log(result.assets[0]);
			return result.assets[0].uri;
		}
}