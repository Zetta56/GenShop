const alertReducer = (state = {error: null, confirm: null, loading: 0}, action) => {
	switch(action.type) {
		case "ERROR":
			return {...state, error: action.payload};
		case "CONFIRM":
			return {...state, confirm: action.payload};
		case "RESET_ALERTS":
			return {...state, error: null, confirm: null};
		case "LOADING":
			return {...state, loading: state.loading += 1};
		case "FINISH_LOADING":
			return {...state, loading: state.loading -= 1};
		default:
			return state;
	};
};

export default alertReducer;