import React, { useEffect, useRef, useCallback, useState } from "react";
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	PanResponder,
	Animated,
	Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import ForYouButtons from "../components/ForYouButtons";
import {
	clock,
	dontRecommend,
	download,
	flag,
	forbidden,
	save,
	share,
	yourVideos,
} from "../constants/icons";
import { playList } from "../libs/videoUpdates";
import { fieldColor } from "../constants/colors";

const windowHeight = Dimensions.get("window").height;

const Menu = ({ isVisible, onClose, vidId, userId }) => {
	const insets = useSafeAreaInsets();
	const translateY = useRef(new Animated.Value(windowHeight)).current;
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					translateY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > windowHeight * 0.2) {
					Animated.timing(translateY, {
						toValue: windowHeight,
						duration: 300,
						useNativeDriver: true,
					}).start(onClose);
				} else {
					Animated.spring(translateY, {
						toValue: 0,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	useEffect(() => {
		if (isVisible) {
			Animated.spring(translateY, {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);

	const handleClosePress = useCallback(() => {
		Animated.timing(translateY, {
			toValue: windowHeight,
			duration: 300,
			useNativeDriver: true,
		}).start(onClose);
		Keyboard.dismiss();
	}, [translateY, onClose]);

	return (
		<Modal
			transparent={true}
			visible={isVisible}
			animationType="slide"
			onRequestClose={handleClosePress}
		>
			<TouchableOpacity
				style={styles.modalBackground}
				activeOpacity={1}
				onPress={handleClosePress}
			>
				<Animated.View
					style={[styles.modalContent, { transform: [{ translateY }] }]}
					{...panResponder.panHandlers}
				>
					<View style={{ margin: 10 }}>
						<ForYouButtons
							sourceUrl={yourVideos}
							title={"Play next in queue"}
						/>
						<ForYouButtons
							sourceUrl={clock}
							title={"Save to watch later"}
							handlePress={() => {
								playList(vidId, "watchLater", userId);
								handleClosePress();
								let toast = Toast.show("Saved to watch later", {
									duration: Toast.durations.LONG,
								});
								setTimeout(function hideToast() {
									Toast.hide(toast);
								}, 3000);
							}}
						/>
						<ForYouButtons sourceUrl={save} title={"Save to playlist"} />
						<ForYouButtons sourceUrl={download} title={"Download video"} />
						<ForYouButtons sourceUrl={share} title={"Share"} />
						<ForYouButtons sourceUrl={forbidden} title={"Not Interested"} />
						<ForYouButtons
							sourceUrl={dontRecommend}
							title={"Don't recommend channel"}
						/>
						<ForYouButtons sourceUrl={flag} title={"Report"} />
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		// backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: fieldColor,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 10,
		maxHeight: "50%",
		marginHorizontal:7
	},
});

export default Menu;
