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
	endpoint: "https://cloud.appwrite.io/v1",
	Platform: "com.jsm.learnReact",
	projectId: "666ec1c80026ad9445c9",
	databaseId: "666ec490003202b8490e",
	userCollectionId: "666ec4d2003732e5c7f2",
	videosCollectionId: "666ec50b002a86e2112b",
	storageId: "666ecb92003dd5320fb8",
};

const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
	.setProject(appwriteConfig.projectId) // Your project ID
	.setPlatform(appwriteConfig.Platform); // Your application ID or bundle ID.
const avatars = new Avatars(client);

export {avatars}