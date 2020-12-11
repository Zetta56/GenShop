const userReducer = (state = {isLoggedIn: null}, action) => {
	switch(action.type) {
		case "LOGIN":
			return {...state, isLoggedIn: true, ...action.payload};
		case "LOGOUT":
			return {isLoggedIn: false};
		case "EDIT_CART":
		case "DELETE_CART":
		case "EDIT_WATCHLIST":
		case "DELETE_WATCHLIST":
			return {...state, ...action.payload};
		default:
			return state;
	};
};

export default userReducer;