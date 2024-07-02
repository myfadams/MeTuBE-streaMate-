export function formatTime(seconds) {
	if (isNaN(seconds) || seconds < 0) {
		return "Invalid time";
	}

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.round(seconds % 60)

	let result = `${hours !== 0 ? hours + ":" : ""} ${minutes}:${
		remainingSeconds >= 10 ? remainingSeconds : "0" + remainingSeconds
	}`;
	

	return result;
}
