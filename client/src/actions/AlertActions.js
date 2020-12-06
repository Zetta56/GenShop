export const error = (err) => {
	return {
		type: "ERROR",
		payload: err
	};
};

export const confirm = (confirm) => {
	return {
		type: "CONFIRM",
		payload: confirm
	};
};

export const loading = () => {
	return {
		type: "LOADING"
	};
};

export const finishLoading  = () => {
	return {
		type: "FINISH_LOADING"
	};
};

export const resetAlerts = () => {
	return {
		type: "RESET_ALERTS"
	};
};