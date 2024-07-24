import {
	Client,
	Account,
	ID,
	Avatars,
	Databases,
	Storage,
	Query,
} from "react-native-appwrite";

export const appwriteConfig = {
	endpoint:   process.env.EXPO_PUBLIC_ENDPOINT, 
	Platform:   process.env.EXPO_PUBLIC_PLATFORM,
	projectId:   process.env.EXPO_PUBLIC_PROJECT_ID, 
	databaseId:   process.env.EXPO_PUBLIC_DATABASE_ID,
	userCollectionId:   process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
	videosCollectionId:  process.env.EXPO_PUBLIC_VIDEOS_COLLECTION_ID,
	storageId:  process.env.EXPO_PUBLIC_STORAGE_ID
};

const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
	.setProject(appwriteConfig.projectId) // Your project ID
	.setPlatform(appwriteConfig.Platform); // Your application ID or bundle ID.
const avatars = new Avatars(client);

export {avatars}