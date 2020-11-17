const reviewReducer = (state = [], action) => {
	switch(action.type) {
		case "FETCH_REVIEWS":
			return [...action.payload];
		case "CREATE_REVIEW":
			return [...state, action.payload];
		case "EDIT_REVIEW":
			return [...state.map(review => review._id === action.payload._id ? action.payload: review)]
		case "DELETE_REVIEW":
			return [...state.filter(review => review._id !== action.payload)];
		default:
			return state;
	}
};

export default reviewReducer;