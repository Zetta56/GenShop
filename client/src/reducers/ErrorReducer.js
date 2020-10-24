export default (state = {message: null}, action) => {
	switch(action.type) {
		case "ERROR":
			return {...state, message: action.payload}
		case "RESET_ERROR":
			return {...state, message: null}
		default:
			return state;
	};
};