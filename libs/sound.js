import { Audio } from "expo-av";

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
