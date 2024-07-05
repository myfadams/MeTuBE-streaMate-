// updateViews.js
import { ref, runTransaction } from "firebase/database";
import { db } from "./config";
// import { database } from "./firebase";

export 
const incrementVideoViews = (videoId,loc) => {
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
    console.error('Error incrementing views: ', error);
  });
};
export function formatViews(numViews) {
	let formattedViews;
    let submessage="views"
	if (numViews >= 1e9) {
		formattedViews = (numViews / 1e9).toFixed(1) + "B";
	} else if (numViews >= 1e6) {
		formattedViews = (numViews / 1e6).toFixed(1) + "M";
	} else if (numViews >= 1e3) {
		formattedViews = (numViews / 1e3).toFixed(1) + "K";
	} else if(numViews===0){
        return "No views"
    }else if(numViews===1){
        formattedViews=1
        submessage="view"
    }
    else {
		formattedViews = numViews.toString();
	}

	return `${formattedViews} ${submessage}`;
}
// Usage example:
// incrementVideoViews("videosRef", "1000e829-2e26-4ebb-9969-0c93d7edad66"); // Replace 'vid' with the actual video ID
