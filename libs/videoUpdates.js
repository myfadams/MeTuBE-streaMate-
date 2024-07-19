// updateViews.js
import { get, onValue, ref, remove, runTransaction, set } from "firebase/database";
import { db, firestore } from "./config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { database } from "./firebase";
import { v4 as uuidv4 } from "uuid";
export const incrementVideoViews = (videoId, loc) => {
	// console.log(videoId)
	const videoRef = ref(db, `${loc}/${videoId}/views`);
	runTransaction(videoRef, (currentViews) => {
		if (currentViews === null) {
			return 1; // If views doesn't exist, initialize it to 1
		}
		return currentViews + 1; // Otherwise, increment by 1
	})
		.then(() => {
			// console.log('Views incremented successfully');
		})
		.catch((error) => {
			console.error("Error incrementing views: ", error);
		});
};
export function formatViews(numViews) {
	let formattedViews;
	let submessage = "views";
	if (numViews >= 1e9) {
		formattedViews = (numViews / 1e9).toFixed(1) + "B";
	} else if (numViews >= 1e6) {
		formattedViews = (numViews / 1e6).toFixed(1) + "M";
	} else if (numViews >= 1e3) {
		formattedViews = (numViews / 1e3).toFixed(1) + "K";
	} else if (numViews === 0) {
		return "No views";
	} else if (numViews === 1) {
		formattedViews = 1;
		submessage = "view";
	} else {
		formattedViews = numViews.toString();
	}

	return `${formattedViews} ${submessage}`;
}
export function formatSubs(numSubs) {
	if (numSubs >= 1e9) {
		return (numSubs / 1e9).toFixed(1) + "B";
	} else if (numSubs >= 1e6) {
		return (numSubs / 1e6).toFixed(1) + "M";
	} else if (numSubs >= 1e3) {
		return (numSubs / 1e3).toFixed(1) + "K";
	} else {
		return numSubs;
	}
}
export const addToHistory = async (type, video, videoId, userId) => {
	// console.log(video)
	// Reference to the history path for the user and videoId
	const historyRef = ref(db, `history/${type}/${userId}`);
	let date = new Date().toLocaleDateString("en-CA");

	let temp;
	let creator;
	if (type !== "shorts") {
		const vidRef = ref(db, `videosRef/${video.videoview}`);
		temp = await get(vidRef);
		const crRef = ref(db, `usersref/${temp.val().creator}`);  
		creator=(await get(crRef))
	}else{
		const vidRef = ref(db, `shortsRef/${video.id}`);
		temp = await get(vidRef);
		const crRef = ref(db, `usersref/${temp.val().creator}`);
		creator = (await get(crRef))
	}
	if (type !== "shorts")
		video = {
			...temp.val(),
			...creator.val(),
			videoview: video.videoview,
			email: "",
			date:date
		};
	else{
		video = {
			...temp.val(),
			...creator.val(),
			id: video.id,
			videoview: video.id,
			email: "",
			date: date,
		};
	}
	// console.log(video)

	// Run transaction to ensure latest addition appears first
	runTransaction(historyRef, (currentHistory) => {
		if (!currentHistory) {
			// If current history is null or does not exist, initialize with the new video data
			return [video];
		} else {
			if (type === "shorts") {
				// Check if videoId exists in current history
				const index = currentHistory.findIndex((item) => item.id === video.id);
				if (index === -1) {
					// If videoId does not exist, prepend the new video data
					currentHistory.unshift(video);
				} else if (index > 0) {
					// If videoId exists but is not the first item, move it to the first position
					let videoToMove = currentHistory.splice(index, 1)[0];
					videoToMove={...video,date:date}
					currentHistory.unshift(videoToMove);
				}
				return currentHistory;
			} else {
				// Check if videoId exists in current history
				const index = currentHistory.findIndex(
					(item) => item.videoview === video.videoview
				);
				if (index === -1) {
					// If videoId does not exist, prepend the new video data
					currentHistory.unshift(video);
				} else if (index > 0) {
					// If videoId exists but is not the first item, move it to the first position
					let videoToMove = currentHistory.splice(index, 1)[0];
					videoToMove = { ...video, date: date };
					currentHistory.unshift(videoToMove);
				}
				return currentHistory;
			}
		}
	})
		.then(() => {
			console.log("Added to history successfully.");
		})
		.catch((error) => {
			console.error("Error adding to history: ", error);
		});
};

export const removeFromHistory = (type, video, videoId, userId) => {
	const historyRef = ref(db, `history/${type}/${userId}/${videoId}`);
	get(historyRef).then((snapshot) => {
		if (snapshot.exists()) {
			return remove(historyRef);
		} else {
			console.log("Reference does not exist.");
		}
	});
};

export const subscribeToChannel = (channelID, userID) => {
	const channelSubRef = ref(db, `subs/channel/${channelID}/subscribers`);
	const userSubRef = ref(db, `subs/users/${userID}/subscriptions`);
	runTransaction(channelSubRef, (subscribers) => {
		if (subscribers === null) {
			return [userID]; // If views doesn't exist, initialize it to 1
		} else {
			if (subscribers.includes(userID)) {
				console.log("lost a sub");
				// setSubStatus(false);
				return subscribers.filter((us) => {
					return us !== userID;
				});
			} else {
				console.log("got new sub");
				// setSubStatus(true);
				subscribers.push(userID);
				return subscribers;
			}
		}
	})
		.then(() => {
			console.log("Subscribed");
		})
		.catch((error) => {
			console.error("Error incrementing subscribe: ", error);
		});
	// setSubStatus(true);
	runTransaction(userSubRef, (subscriptions) => {
		if (subscriptions === null) {
			console.log("created new sub and subbed");
			return [channelID]; // If views doesn't exist, initialize it to 1
		} else {
			if (subscriptions?.includes(channelID)) {
				console.log("unsubbed");
				// setSubStatus(false);
				return subscriptions?.filter((ch) => {
					return ch !== channelID;
				});
			} else {
				console.log("existing sub and subbed");
				// setSubStatus(true);
				subscriptions?.push(channelID);
				return subscriptions;
			}
		}
	});
};
export function getSubsriptions(userId, setStatus, creatorId) {
	// console.log("c: " + creatorId, "u: " + userId);
	const userSubRef = ref(db, `subs/users/${userId}/subscriptions`);

	let subbs = [];
	onValue(
		userSubRef,
		(snapshot) => {
			const value = snapshot.val();
			//   console.log('Snapshot value:', value);

			try {
				if (snapshot.exists()) {
					if (Array.isArray(value)) {
						// Value is an array, check if it includes the creatorId
						if (value.includes(creatorId)) {
							setStatus(true);
						} else {
							setStatus(false);
						}
					} else if (typeof value === "object" && value !== null) {
						// Value is an object, check if any of its values include the creatorId
						const ids = Object.values(value);
						if (ids.includes(creatorId)) {
							setStatus(true);
						} else {
							setStatus(false);
						}
					} else {
						// Handle other types if necessary
						setStatus(false);
					}
				} else {
					setStatus(false);
				}
			} catch (error) {
				console.log("Error checking subscriptions:", error);
				setStatus(false);
			}
		},
		(error) => {
			console.log("Error reading subscriptions:", error);
			setStatus(false); // Handle potential errors
		}
	);

	// console.log(subbs)
}
export function getNumberSubs(channelID, setSubNumber) {
	const chSubsRef = ref(db, `subs/channel/${channelID}/subscribers`);
	// getSubsriptions(user.uid, setsubscribed, vidinfo.creator);
	const unsubscribe = onValue(chSubsRef, (snapshot) => {
		if (snapshot.exists()) {
			const data = snapshot.val().length;
			setSubNumber(data);
		} else {
			setSubNumber(0);
		}
	});

	// Cleanup listener on unmount
	return () => unsubscribe();
}

export const likeUpadate = (videoId, type, loc, userId) => {
	// console.log(videoId)
	const likesReff = ref(db, `${loc}/${videoId}/likes`);
	const dislikesReff = ref(db, `${loc}/${videoId}/dislikes`);
	runTransaction(likesReff, (currentLikes) => {
		if (!Array.isArray(currentLikes)) {
			return [];
		}
	});
	if (type === "like") {
		runTransaction(likesReff, (currentLikes) => {
			if (currentLikes === null) {
				return [userId];
			} else {
				if (currentLikes?.includes(userId)) {
					return currentLikes?.filter((l) => {
						return l !== userId;
					});
				} else {
					currentLikes.push(userId);
					return currentLikes;
				}
			}
		}).then(() => {
			// console.log("Likes incremented successfully");
		});
		runTransaction(dislikesReff, (currentDislikes) => {
			if (currentDislikes === null) {
				return [];
			} else {
				if (currentDislikes?.includes(userId)) {
					return currentDislikes?.filter((l) => {
						return l !== userId;
					});
				}
			}
		}).then(() => {
			// console.log("Likes incremented successfully");
		});
	} else {
		runTransaction(dislikesReff, (currentDislikes) => {
			if (currentDislikes === null) {
				return [userId];
			} else {
				if (currentDislikes.includes(userId)) {
					return currentDislikes?.filter((l) => {
						return l !== userId;
					});
				} else {
					currentDislikes.push(userId);
					return currentDislikes;
				}
			}
		}).then(() => {
			// console.log("Likes incremented successfully");
		});
		runTransaction(likesReff, (currenlikes) => {
			if (currenlikes === null) {
				return [];
			} else {
				if (currenlikes.includes(userId)) {
					return currenlikes?.filter((l) => {
						return l !== userId;
					});
				}
			}
		}).then(() => {
			console.log("Likes incremented successfully");
		});
	}
};

export const getLikes = (videoId, setlikes, loc) => {
	const videoLikeRef = ref(db, `${loc}/${videoId}/likes`);
	const unsubscribe = onValue(videoLikeRef, (snapshot) => {
		const data = snapshot.val();
		if (Array.isArray(snapshot.val())) setlikes(data.length);
		else setlikes(0);
	});

	// Cleanup listener on unmount
	return () => unsubscribe();
};

export const setLikeStatus = (videoId, setStatus, userId, loc) => {
	const videoLikeRef = ref(db, `${loc}/${videoId}/likes`);
	const unsubscribe = onValue(videoLikeRef, (snapshot) => {
		const likesArr = snapshot.val();
		try {
			if (snapshot.exists()) {
				if (Array.isArray(likesArr)) {
					// likesArr is an array, check if it includes the creatorId
					if (likesArr.includes(userId)) {
						setStatus(true);
					} else {
						setStatus(false);
					}
				} else if (typeof likesArr === "object" && likesArr !== null) {
					// Value is an object, check if any of its values include the creatorId
					const ids = Object.values(likesArr);
					if (ids.includes(userId)) {
						setStatus(true);
					} else {
						setStatus(false);
					}
				} else {
					// Handle other types if necessary
					setStatus(false);
				}
			} else {
				setStatus(false);
			}
		} catch (error) {
			console.log("Error checking likes:", error);
			setStatus(false);
		}
	});

	// Cleanup listener on unmount
	return () => unsubscribe();
};

export const setDisLikeStatus = (videoId, setStatus, userId, loc) => {
	const videoLikeRef = ref(db, `${loc}/${videoId}/dislikes`);
	const unsubscribe = onValue(videoLikeRef, (snapshot) => {
		const dislikesArr = snapshot.val();
		try {
			if (snapshot.exists()) {
				if (Array.isArray(dislikesArr)) {
					// likesArr is an array, check if it includes the creatorId
					if (dislikesArr.includes(userId)) {
						setStatus(true);
					} else {
						setStatus(false);
					}
				} else if (typeof dislikesArr === "object" && dislikesArr !== null) {
					// Value is an object, check if any of its values include the creatorId
					const ids = Object.values(dislikesArr);
					if (ids.includes(userId)) {
						setStatus(true);
					} else {
						setStatus(false);
					}
				} else {
					// Handle other types if necessary
					setStatus(false);
				}
			} else {
				setStatus(false);
			}
		} catch (error) {
			console.log("Error checking likes:", error);
			setStatus(false);
		}
	});

	// Cleanup listener on unmount
	return () => unsubscribe();
};

export const playList = (videoId, loc, userId) => {
	// console.log(videoId)
	const playlistReff = ref(db, `playlist/${userId}/${loc}`);

	runTransaction(playlistReff, (currentPlaylist) => {
		if (currentPlaylist === null) {
			return [videoId];
		} else {
			if (loc !== "watchLater") {
				if (currentPlaylist?.includes(videoId)) {
					return currentPlaylist?.filter((l) => {
						return l !== videoId;
					});
				} else {
					currentPlaylist.push(videoId);
					return currentPlaylist;
				}
			} else {
				if (currentPlaylist?.includes(videoId)) {
					const temp = currentPlaylist?.filter((l) => {
						return l !== videoId;
					});
					temp.push(videoId)
					currentPlaylist=temp
					// return temp;
				}else{
					currentPlaylist.push(videoId)
				}
				return currentPlaylist;

			}
		}
	}).then(() => {
		// console.log("Likes incremented successfully");
	});
};

// export async function getUploadTimestamp(fileName, type) {
// 	try {
		
// 		const docRef = doc(firestore, type, `/${fileName}`);
// 		const time = (await getDoc(docRef));
// 		console.log(time.data().uploadedAt.toDate());
// 		// console.log(docRef.type)
		
// 	} catch (error) {
// 		console.error("Error retrieving timestamp:", error);
// 	}
// }
function getFilenameFromUrl(url) {
		let temp = url?.split("/");
		let lastitem = temp[temp?.length - 1];
		let filename = lastitem?.split("?")[0].replace("shorts%2F", "");
		filename = filename?.replace("videos%2F", "");
		return filename;
	}
export async function getUploadTimestamp(url, type) {
	// console.log(url)
	const fileName = decodeURIComponent(getFilenameFromUrl(url));
	// console.log(decodeURIComponent(fileName));
	try {
		const docRef = doc(
			firestore,
			type,
			fileName
		);
		const docSnap =await getDoc(docRef);
		// console.log(docSnap.data())

		if (docSnap.exists()) {
			const uploadedAt = docSnap.data().uploadedAt.toDate();
			// console.log(uploadedAt)
			return uploadedAt;
		} else {
			throw new Error("No such document!");
		}
	} catch (error) {
		console.error("Error retrieving timestamp:", error);
	}
}


export function calculateTimePassed(uploadedAt) {
	const now = new Date();
	const secondsPassed = Math.floor((now - uploadedAt) / 1000); // Time passed in seconds
	return formatTimePassed(secondsPassed);
}

function formatTimePassed(seconds) {
	const years = Math.floor(seconds / (3600 * 24 * 365));
	const months = Math.floor(seconds / (3600 * 24 * 30));
	const days = Math.floor(seconds / (3600 * 24));
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	if (years > 0) {
		return `${years} ${years===1? "year": "years"}`;
	} else if (months > 0) {
		return `${months} ${months === 1 ? "month" : "months"}`;
	} else if (days > 0) {
		return `${days} ${days === 1 ? "day" : "days"}`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? "hour" : "hours"}`;
	} else if (minutes > 0) {
		return `${minutes}  ${minutes === 1 ? "minute" : "minutes"}`;
	} else {
		return `${remainingSeconds}  ${remainingSeconds === 1 ? "second" : "seconds"}`;
	}
}


export async function addComment(videoId,userId,commentText,creatorID){
	const comment={
		text:commentText,
		commenterID:userId,
		commentId:uuidv4(),
		date:new Date().toLocaleDateString(),
		likes:0,
		replies:[],
		creatorID:creatorID
	}
	const commentsRef=ref(db,`commentsRef/${videoId}`)

	// const commentsarray = await get(commentsRef, {...comment,commenterId:userId});
	runTransaction(commentsRef,(commentsArray)=>{

		try {
			if(!commentsArray)
				return [comment]
			else{
				return [...commentsArray, comment];
			}
			
		} catch (error) {
			
		}
	})

}