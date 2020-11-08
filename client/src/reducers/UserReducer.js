const userReducer = (state = {isLoggedIn: null}, action) => {
	switch(action.type) {
		case "LOGIN":
			return {...state, isLoggedIn: true, ...action.payload};
		case "LOGOUT":
			return {isLoggedIn: false};
		case "ADD_TO_CART":
			return {...state, ...action.payload};
		case "RESET_CART":
			return {...state, ...action.payload};
		default:
			return state;
	};
};

export default userReducer;