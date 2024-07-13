import { View, Text, Modal, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native'
import React from 'react'
import ChatInput from '../ChatInput';
import { bgColor, buttonColor } from '../../constants/colors';
import MoreButton from '../MoreButton';
import { globe, info } from '../../constants/icons';
import { changeUserDetails } from '../../libs/firebase';
import { getContext } from '../../context/GlobalContext';

const ModalEditor = ({ modalVisible, setModalVisible, type, setVal ,val,setRef,
refe}) => {
	// const {refereshing, setRefreshing} = getContext();
	function handleSave() {
        if(type==="name"){
            // console.log("name");
            changeUserDetails("displayName", val.name)
			setVal({...val,name:val.name})
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
				<View
					//weird change
					style={{ justifyContent: "center", width: "100%", height: "150%" }}
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
									color: "#000",
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
							<ChatInput  handleChange={(text)=>{type === "name"
								? setVal({ ...val, name: text })
								: setVal({ ...val, handle: text }); }} text ={type==="name"?val.name:val.handle} name={"name"}/>
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
									gap: 2,
									// alignItems: "center",
								}}
							>
								<Image
									source={globe}
									style={{ width: 13, height: 13 }}
									resizeMode="contain"
									tintColor={"#000"}
								/>
								<Text
									style={{
										color: "#C5C5C5",
										fontFamily: "Montserrat_500Medium",
										fontSize: 13,
										flexWrap: "wrap",
										flexShrink: 1,
										// width:
									}}
								>
									Visible to anyone on MeTuBE
								</Text>
							</View>
							<View
								style={{
									width: "92%",
									flexDirection: "row",
									gap: 2,
									// alignItems: "center",
								}}
							>
								<Image
									source={info}
									style={{ width: 13, height: 13 }}
									resizeMode="contain"
									tintColor={"#000"}
								/>
								<Text
									style={{
										color: "#C5C5C5",
										fontFamily: "Montserrat_500Medium",
										fontSize: 11,
										flexWrap: "wrap",
										flexShrink: 1,
										// width:
									}}
								>
									Changes made to your name will be reflected on MeTube. You can
									change your name twice in 14 days.
									<Text style={{ color: buttonColor }}> Learn more</Text>
								</Text>
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
		backgroundColor: "white",
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