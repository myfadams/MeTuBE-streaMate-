import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
const getFileExtensionFromUrl = (url) => {
	// Extract the path from the URL
	const path = url.split("?")[0];
	// Find the file extension using regex
	const match = path.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
	return match ? match[1] : "";
};
// export const startDownload = async (video, setProgress) => {
// 	const videoUri = video?.video;
// 	const thumbnailUri = video?.thumbnail;
// 	// console.log(thumbnailUri)
// 	const VidfileName =
// 		video?.videoview + "." + getFileExtensionFromUrl(videoUri)?.toLowerCase();
// 	const imgfileName =
// 		video?.videoview + "." + getFileExtensionFromUrl(thumbnailUri)?.toLowerCase()
// 	const localVidUri = FileSystem.documentDirectory + VidfileName;
// 	const localImgUri = FileSystem.documentDirectory + imgfileName;
// 	const fileInfo = await FileSystem.getInfoAsync(localVidUri);

// 	if (fileInfo.exists) {
// 		console.log("File already exists at:", localVidUri);
// 		return; // Exit the function to avoid re-downloading the file
// 	}
// 	try {
//         const { uri: imgUri } = await FileSystem.downloadAsync(thumbnailUri,localImgUri);
// 		const { uri:vidURi } = await FileSystem.downloadAsync(
// 			videoUri,
// 			localVidUri,
// 			{
// 				onProgress: (progress) => {
// 					const progressPercent =
// 						progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
// 					setProgress((prev) => ({ ...prev, [VidfileName]: progressPercent }));
// 				},
// 				onError: (error) => {
// 					console.error("Error downloading file:", error);
// 					// Handle download error (e.g., show an alert)
// 				},
// 			}
// 		);
// 		saveDownloadMetadata(video?.title,vidURi,imgUri, video?.creator,video.videoview)
// 		// Update the downloads state
// 		// setDownloads((prev) => [...prev, { fileName, uri: downloadedUri }]);
// 	} catch (error) {
// 		console.error("Error downloading file:", error);
// 	}
// };

export const startDownload = async (video, setProgress) => {
	const videoUri = video?.video;
	const thumbnailUri = video?.thumbnail;
	const VidfileName =
		video?.title.substring(0, 5).trim() +
		"." +
		getFileExtensionFromUrl(videoUri)?.toLowerCase();
	const imgfileName =
		video?.title.substring(0, 5).trim() +
		"." +
		getFileExtensionFromUrl(thumbnailUri)?.toLowerCase();
	const localVidUri = FileSystem.documentDirectory + VidfileName;
	const localImgUri = FileSystem.documentDirectory + imgfileName;

	const fileInfo = await FileSystem.getInfoAsync(localVidUri);

	if (fileInfo.exists) {
		console.log("File already exists at:", localVidUri);
		return; // Exit the function to avoid re-downloading the file
	}

	try {
		const downloadThumbnailResumable = FileSystem.createDownloadResumable(
			thumbnailUri,
			localImgUri,
			{},
			(downloadProgress) => {
				const progressPercent =
					downloadProgress.totalBytesWritten /
					downloadProgress.totalBytesExpectedToWrite;
				setProgress((prev) => ({ ...prev, [imgfileName]: progressPercent }));
			}
		);

		const downloadVideoResumable = FileSystem.createDownloadResumable(
			videoUri,
			localVidUri,
			{},
			(downloadProgress) => {
				const progressPercent =
					downloadProgress.totalBytesWritten /
					downloadProgress.totalBytesExpectedToWrite;
				setProgress((prev) => ({ ...prev, [VidfileName]: progressPercent }));
			}
		);
		console.log(downloadVideoResumable.fileUri)
		// Start the download processes
		await downloadVideoResumable.downloadAsync();
		await downloadThumbnailResumable.downloadAsync();

		// Save metadata after both downloads complete
		saveDownloadMetadata(
			video?.title,
			localVidUri,
			localImgUri,
			video?.creator,
			video.videoview
		);
	} catch (error) {
		console.error("Error downloading file:", error);
	}
};

const saveDownloadMetadata = async (title, vidURL, imgURL, creatorId, id) => {
	try {
		// Retrieve existing downloads from AsyncStorage
		const existingDownloads =
			JSON.parse(await AsyncStorage.getItem("downloads")) || [];

		// Check if the download with the given ID already exists
		const downloadExists = existingDownloads.some(
			(download) => download.id === id
		);

		if (downloadExists) {
			console.log("Download with this ID already exists.");
			return; // Exit the function if the download already exists
		}

		// If the download does not exist, create a new download entry
		const newDownload = { title, vidURL, imgURL, creatorId, id };
		const updatedDownloads = [...existingDownloads, newDownload];

		// Save the updated list of downloads back to AsyncStorage
		await AsyncStorage.setItem("downloads", JSON.stringify(updatedDownloads));
		console.log("Download metadata saved successfully.");
	} catch (error) {
		console.error("Error saving download metadata:", error);
	}
};
export const fetchDownloadedFiles = async () => {
	try {
		const downloadedFiles =
			JSON.parse(await AsyncStorage.getItem("downloads")) || [];
		return downloadedFiles;
	} catch (error) {
		console.error("Error fetching downloaded files:", error);
		return [];
	}
};


export const deleteFileAndMetadata = async (fileUri,imgUri, fileId) => {
	try {
		// Delete the file from the local file system
		const fileInfo = await FileSystem.getInfoAsync(fileUri);
		if (fileInfo.exists) {
			await FileSystem.deleteAsync(fileUri, { idempotent: true });
			await FileSystem.deleteAsync(imgUri, { idempotent: true });
			console.log("File deleted successfully");
		} else {
			console.log("File does not exist");
		}

		// Remove the file's metadata from AsyncStorage
		const existingDownloads =
			JSON.parse(await AsyncStorage.getItem("downloads")) || [];
		const updatedDownloads = existingDownloads.filter(
			(download) => download.id !== fileId
		);
		await AsyncStorage.setItem("downloads", JSON.stringify(updatedDownloads));
		console.log("Metadata removed from AsyncStorage");
	} catch (error) {
		console.error("Error deleting file or metadata:", error);
	}
};

// AsyncStorage.removeItem("downloads").then()

const generateThumbnail = async (url) => {
	try {
		const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
			time: 1000,
		});
		setThumbnail(uri);
		console.log(uri)
		return uri;
	} catch (e) {
		console.warn(e);
	}
};