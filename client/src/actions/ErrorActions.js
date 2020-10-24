export const error = (err) => {
	return {
		type: "ERROR",
		payload: err
	};
};

export const resetError = () => {
	return {
		type: "RESET_ERROR"
	};
};