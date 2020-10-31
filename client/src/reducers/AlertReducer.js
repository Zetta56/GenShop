export default (state = {error: null, confirm: null}, action) => {
	switch(action.type) {
		case "ERROR":
			return {...state, error: action.payload};
		case "CONFIRM":
			return {...state, confirm: action.payload}
		case "RESET_ALERTS":
			return {...state, error: null, confirm: null}
		default:
			return state;
	};
};