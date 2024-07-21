import React from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	Text,
	StyleSheet,
	Dimensions,
} from "react-native";
import { bgColor, borderLight, loadingColor } from "../../constants/colors";

const HorizontalHeaderScrollView = ({
	pages,
	activePage,
	setActivePage,
}) => {
	return (
		<View
			style={{
				backgroundColor: bgColor,
				borderColor: borderLight,
				borderBottomWidth: 0.5,
			}}
		>
			<ScrollView
				contentContainerStyle={styles.headerContainer}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{pages.map((page, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => {
							this.scrollView.scrollTo({
								x: index * Dimensions.get("window").width,
								animated: true,
							});
							setActivePage(index);
						}}
					>
						<Text
							style={[
								styles.headerText,
								activePage === index && styles.activeHeaderText,
							]}
						>
							{page.title}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		// height:70,
		paddingHorizontal:Dimensions.get("screen").width * 0.06,
		// borderColor: borderLight,
		// borderBottomWidth: 0.5,
		// backgroundColor: "#ccc",
	},
	headerText: {
		marginVertical: 10,
		fontSize: 16,
		fontFamily: "Montserrat_500Medium",
		padding: 10,
		color: loadingColor,
	},
	activeHeaderText: {
		color: "white",
		fontFamily: "Montserrat_600SemiBold",
	},
	page: {
		width: Dimensions.get("window").width,
		height: "100%",
		// justifyContent: "center",
		alignItems: "center",
	},
});
export default HorizontalHeaderScrollView