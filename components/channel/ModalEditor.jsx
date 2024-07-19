import { View, Text, Modal, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import ChatInput from '../ChatInput';
import { bgColor, buttonColor } from '../../constants/colors';
import MoreButton from '../MoreButton';
import { globe, info } from '../../constants/icons';
import { changeUserDetails } from '../../libs/firebase';
import { getContext } from '../../context/GlobalContext';
import Toast from 'react-native-root-toast';

const ModalEditor = ({ modalVisible, setModalVisible, type, setVal ,val,setRef,
refe}) => {
	// const {refereshing, setRefreshing} = getContext();
	function handleSave() {
        if(type==="name"){
            // console.log("name");
            changeUserDetails("displayName", val.name)
			setVal({...val,name:val.name})
        }else{
			changeUserDetails("handle", val.handle);
		}
		setModalVisible(!modalVisible);
		setRef(!refe)

	}
	return (
		<Modal
			animationType="slide"
			// style={{justifyContent:"center", alignItems:"center"}}
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				setModalVisible(!modalVisible);
			}}
		>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						setModalVisible(!modalVisible);

						let toast = Toast.show("Not saved", {
							duration: Toast.durations.LONG,
						});
						setTimeout(function hideToast() {
							Toast.hide(toast);
						}, 3000);
					}}
				>
					<View
						//weird change
						style={{ justifyContent: "center", width: "100%", height: "130%" }}
					>
						<View style={styles.modalView}>
							<View
								style={{
									justifyContent: "center",
									width: "100%",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: "#fff",
										fontFamily: "Montserrat_600SemiBold",
										fontSize: 20,
										marginVertical: 15,
										width: "92%",
									}}
								>
									{type === "name" ? "Name" : "Handle"}
								</Text>
							</View>
							<View
								style={{
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<ChatInput
									handleChange={(text) => {
										type === "name"
											? setVal({ ...val, name: text })
											: setVal({ ...val, handle: text });
									}}
									text={type === "name" ? val.name : val.handle}
									name={"name"}
								/>
							</View>
							<View
								style={{
									gap: 15,
									justifyContent: "center",
									alignItems: "center",
									marginVertical: 10,
								}}
							>
								<View
									style={{
										width: "92%",
										flexDirection: "row",
										gap: 4,
										// alignItems: "center",
									}}
								>
									<Image
										source={globe}
										style={{ width: 13, height: 13 }}
										resizeMode="contain"
										tintColor={"#fff"}
									/>
									{type === "name" ? (
										<Text
											style={{
												color: "#C5C5C5",
												fontFamily: "Montserrat_500Medium",
												fontSize: 14,
												flexWrap: "wrap",
												flexShrink: 1,
												// width:
											}}
										>
											Visible to anyone on StreaMate.
										</Text>
									) : (
										<Text
											style={{
												color: "#C5C5C5",
												fontFamily: "Montserrat_500Medium",
												fontSize: 14,
												flexWrap: "wrap",
												flexShrink: 1,
												// width:
											}}
										>
											Visible to all users on
											StreaMate. Remember to follow our{" "}
											<Text style={{ color: buttonColor }}>
												{" "}
												Community Guidelines
											</Text>
											and{" "}
											<Text style={{ color: buttonColor }}>
												{" "}
												best practices
											</Text>{" "}
										</Text>
									)}
								</View>
								<View
									style={{
										width: "92%",
										flexDirection: "row",
										gap: 4,
										// alignItems: "center",
									}}
								>
									<Image
										source={info}
										style={{ width: 13, height: 13 }}
										resizeMode="contain"
										tintColor={"#fff"}
									/>
									{type === "name" ? (
										<Text
											style={{
												color: "#C5C5C5",
												fontFamily: "Montserrat_500Medium",
												fontSize: 14,
												flexWrap: "wrap",
												flexShrink: 1,
												// width:
											}}
										>
											You can change your handle back within 14 days. This
											becomes your channel URL. Handles can be changed twice
											every 14 days.
											<Text style={{ color: buttonColor }}> Learn more</Text>
										</Text>
									) : (
										<Text
											style={{
												color: "#C5C5C5",
												fontFamily: "Montserrat_500Medium",
												fontSize: 12,
												flexWrap: "wrap",
												flexShrink: 1,
												// width:
											}}
										>
											Changes made to your name will be reflected on StreaMate. You
											can change your name twice in 14 days.
											<Text style={{ color: buttonColor }}> Learn more</Text>
										</Text>
									)}
								</View>
							</View>
							<View style={{ width: "100%", alignItems: "center" }}>
								<View
									style={{
										width: "97%",
										//
										justifyContent: "center",
									}}
								>
									<MoreButton
										color={buttonColor}
										title={"Save"}
										handlePress={handleSave}
									/>
								</View>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</Modal>
	);
};
const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
        // width:"92%",
		backgroundColor:bgColor,
		borderRadius: 10,
		padding: 10,
		// alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
export default ModalEditor