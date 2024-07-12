import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../libs/config";
import { getAuthToken } from "../libs/firebase";
import NetInfo from "@react-native-community/netinfo";
const MyContext = createContext();
const getContext = () => {
	return useContext(MyContext);
};
const GlobalContext = ({ children }) => {
	const [user, setUser] = useState(null);
	const [name, setName] = useState(null);
	const [usrInfo, setUsrInfo] = useState("");
	const [refereshing, setRefreshing] = useState(false);
	const [vidDescription, setVidDescription] = useState(null);
	const [isIcognito, setIsIncognito] = useState(false);
	const [isConnected, setIsConnected] = useState(true);

	useEffect(() => {
		// Check initial connectivity state
		const fetchInitialState = async () => {
			const state = await NetInfo.fetch();
			setIsConnected(state.isConnected);
		};
		fetchInitialState();

		// Subscribe to network state updates
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsConnected(state.isConnected);
		});

		// Unsubscribe on cleanup
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
			setUser(currentUser);
		});
		if (!user) {
			setUser(getAuthToken);
		}
		return () => unsubscribe();
	}, []);
	console.log("connnection: "+isConnected)
	return (
		<MyContext.Provider
			value={{
				isConnected,
				isIcognito,
				setIsIncognito,
				user,
				setUser,
				name,
				setName,
				setUsrInfo,
				usrInfo,
				vidDescription,
				setVidDescription,
				setRefreshing,
				refereshing,
			}}
		>
			{children}
		</MyContext.Provider>
	);
};

export { GlobalContext, getContext };
