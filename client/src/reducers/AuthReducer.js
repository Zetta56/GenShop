export default (state = {isLoggedIn: null, userId: null}, action) => {
	switch(action.type) {
		case "LOGIN":
			return {...state, isLoggedIn: true, userId: action.payload};
		case "LOGOUT":
			return {...state, isLoggedIn: false, userId: null};
		default:
			return state;
	};
};