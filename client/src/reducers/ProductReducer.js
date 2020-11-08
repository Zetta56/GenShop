import _ from "lodash";

const productReducer = (state = {}, action) => {
	switch(action.type) {
		case "FETCH_PRODUCTS":
			return {...state, ..._.mapKeys(action.payload, "_id")};
		case "FETCH_PRODUCT":
		case "CREATE_PRODUCT":
		case "EDIT_PRODUCT":
			return {...state, [action.payload._id]: action.payload};
		case "DELETE_PRODUCT":
			return {..._.omit(state, action.payload)};
		default:
			return state;
	};
};

export default productReducer;