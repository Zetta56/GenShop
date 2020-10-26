export default (state = {isLoggedIn: null, userId: null, isAdmin: null}, action) => {
	switch(action.type) {
		case "LOGIN":
			return {...state, isLoggedIn: true, userId: action.payload._id, isAdmin: action.payload.isAdmin};
		case "LOGOUT":
			return {...state, isLoggedIn: false, userId: null, isAdmin: null};
		default:
			return state;
	};
};