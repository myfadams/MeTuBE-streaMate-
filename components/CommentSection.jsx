// BottomSheetComponent.js

import React, { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, View, Text, Keyboard, Dimensions } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { bgColor, loadingColor } from "../constants/colors";
import { FlatList} from "react-native-gesture-handler";
import CommentsHeader from "./CommentsHeader";
import CommentFooter from "./CommentFooter";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContext } from "../context/GlobalContext";
const windowHeight = Dimensions.get("window").height;
const BottomSheetComponent = ({ isVisible, onClose,isActive }) => {
	const insets = useSafeAreaInsets();
	const commentHeight = ((windowHeight-250-insets.bottom)/windowHeight)*100
	const bottomSheetRef = useRef(null);
	const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(-1);
	const { user } = getContext();

	// Handle opening the bottom sheet when isVisible changes to true
	React.useEffect(() => {
		if (isVisible) {
			bottomSheetRef.current?.expand();
			if(isActive)
				isActive(true)
		}
	}, [isVisible]);

	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
		Keyboard.dismiss();
		onClose && onClose();
		if(isActive)
			isActive(false)
	}, [onClose]);

	const handleSheetChanges = useCallback(
		(index) => {
			setCurrentSnapPointIndex(index);

			if (index === 0) {
				bottomSheetRef.current?.close();
				Keyboard.dismiss()
				onClose && onClose();
				if(isActive)
					isActive(false);
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
				// data={[1, 2, 3, 4, 5, 6, 8, 9, 0]}
				showsVerticalScrollIndicator={false}
				renderItem={(item) => {
					return (
						<Text style={{ color: "white", fontSize: 18, marginBottom: 40 }}>
							comment number {item.item}
						</Text>
					);
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

			<CommentFooter profile={user?.photoURL} />
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
