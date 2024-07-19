// BottomSheetComponent.js

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Text, Keyboard, Dimensions } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { bgColor, loadingColor } from "../constants/colors";
import { FlatList} from "react-native-gesture-handler";
import CommentsHeader from "./CommentsHeader";
import CommentFooter from "./CommentFooter";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContext } from "../context/GlobalContext";
import CommentView from "./CommentView";
import { db } from "../libs/config";
import { get, onValue, ref } from "firebase/database";
const windowHeight = Dimensions.get("window").height;
const BottomSheetComponent = ({
	isVisible,
	onClose,
	isActive,
	videoID,
	creatorID,
}) => {
	// console.log(videoID)
	const insets = useSafeAreaInsets();
	const commentHeight =
		((windowHeight - 250 - insets.bottom) / windowHeight) * 100;
	const bottomSheetRef = useRef(null);
	const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(-1);
	const { user } = getContext();
	const [comments,setComments]=useState([])
	// Handle opening the bottom sheet when isVisible changes to true
	React.useEffect(() => {
		if (isVisible) {
			bottomSheetRef.current?.expand();
			if (isActive) isActive(true);
		}
	}, [isVisible]);
	useEffect(()=>{
		const videoCommentRef = ref(db, `commentsRef/${videoID}`);
		const unsubscribe = onValue(videoCommentRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// console.log(snapshot.val())
				const commentsWithInfo=[];
				data.forEach(async(comment)=>{
					const commenterRef = ref(db, `usersref/${comment?.commenterID}`);
					const commenterInfo= await (await get(commenterRef)).val()
					// console.log(commenterInfo)
					commentsWithInfo.push({...comment,name:commenterInfo.name,handle:commenterInfo?.handle,image:commenterInfo?.image})
					setComments([...commentsWithInfo]);
					
				})
			}
		});
		
		
		// Cleanup listener on unmountjj
		return () => unsubscribe();
	},[user?.uid])

	// console.log(comments);
	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
		Keyboard.dismiss();
		onClose && onClose();
		if (isActive) isActive(false);
	}, [onClose]);

	const handleSheetChanges = useCallback(
		(index) => {
			setCurrentSnapPointIndex(index);

			if (index === 0) {
				bottomSheetRef.current?.close();
				Keyboard.dismiss();
				onClose && onClose();
				if (isActive) isActive(false);
			}

			// Perform other actions based on snap point index if needed
		},
		[onClose]
	);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={isVisible ? 0 : -1} // Start at snap point 0 when visible
			// 60%"
			snapPoints={["2%", `${commentHeight}%`]}
			enablePanDownToClose={false}
			onChange={handleSheetChanges}
			backgroundStyle={{ backgroundColor: bgColor }}
		>
			<CommentsHeader handleClose={handleClosePress} text={"Comments"} />

			<FlatList
				data={comments}
				showsVerticalScrollIndicator={false}
				renderItem={({item,index}) => {
					return <CommentView commentData={item}/>;
				}}
				keyExtractor={(item)=>{
					return item?.commentId;
				}}
				ListEmptyComponent={() => {
					return (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							<Text style={{ color: "white", fontSize: 18 }}>No comments</Text>
						</View>
					);
				}}
			/>

			<CommentFooter
				profile={user?.photoURL}
				videoID={videoID}
				creatorID={creatorID}
			/>
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default BottomSheetComponent;
