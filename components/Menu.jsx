// BottomSheetComponent.js

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Button,
	StyleSheet,
	View,
	Text,
	Keyboard,
	Dimensions,
	ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { bgColor, borderLight } from "../constants/colors";
import ForYouButtons from "../components/ForYouButtons";
import { clock, dontRecommend, download, flag, forbidden, save, share, yourVideos } from "../constants/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { playList } from "../libs/videoUpdates";
import Toast from "react-native-root-toast";
const windowHeight = Dimensions.get("window").height;
const Menu = ({ isVisible, onClose,vidId,userId}) => {
	const insets = useSafeAreaInsets();
	const commentHeight =
		((windowHeight - 250 - insets.bottom) / windowHeight) * 100;
	const bottomSheetRef = useRef(null);
	const [currentSnapPointIndex, setCurrentSnapPointIndex] = useState(-1);
	// Handle opening the bottom sheet when isVisible changes to true
	React.useEffect(() => {
		if (isVisible) {
			bottomSheetRef.current?.expand();
			
		}
	}, [isVisible]);

	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
		Keyboard.dismiss();
		onClose && onClose();
		
	}, [onClose]);
	const handleSheetChanges = useCallback(
		(index) => {
			setCurrentSnapPointIndex(index);

			if (index === 0) {
				bottomSheetRef.current?.close();
				Keyboard.dismiss();
				onClose && onClose();
				
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
			snapPoints={["2%", "58%"]}
			enablePanDownToClose={false}
			onChange={handleSheetChanges}
			backgroundStyle={{ backgroundColor: bgColor, borderColor:borderLight,borderWidth:0.2 }}
		>
			<View style={{ margin: 15 }}>
				<ForYouButtons sourceUrl={yourVideos} title={"Play next in queue"} />
				<ForYouButtons sourceUrl={clock} title={"Save to watch later"} handlePress={()=>{
					playList(vidId, "watchLater", userId);
					handleClosePress();
					let toast = Toast.show("Saved to watch later", {
						duration: Toast.durations.LONG,
					});
					setTimeout(function hideToast() {
						Toast.hide(toast);
					}, 3000);
				}}/>
				<ForYouButtons sourceUrl={save} title={"Save to playlist"} />
				<ForYouButtons sourceUrl={download} title={"Download video"} />
				<ForYouButtons sourceUrl={share} title={"Share"} />
				<ForYouButtons sourceUrl={forbidden} title={"Not Intrested"} />
				<ForYouButtons sourceUrl={dontRecommend} title={"Don't recommend channel"} />
				<ForYouButtons sourceUrl={flag} title={"Report"} />
			</View>
		</BottomSheet>
	);
};

export default Menu;
