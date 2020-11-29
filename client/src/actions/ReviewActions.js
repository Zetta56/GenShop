import axios from "axios";
import {error, loading, finishLoading} from "./AlertActions";
import history from "../history";

export const fetchReviews = (productId) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.get(`/api/products/${productId}/reviews`);

			dispatch({
				type: "FETCH_REVIEWS",
				payload: response.data
			});
			dispatch(finishLoading());
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};

export const createReview = (productId, formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.post(`/api/products/${productId}/reviews`, formValues);

			dispatch({
				type: "CREATE_REVIEW",
				payload: response.data
			});
			dispatch(finishLoading());
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};

export const editReview = (productId, reviewId, formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.put(`/api/products/${productId}/reviews/${reviewId}`, formValues);
			
			dispatch({
				type: "EDIT_REVIEW",
				payload: response.data
			});
			dispatch(finishLoading());
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};

export const deleteReview = (productId, reviewId) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.delete(`/api/products/${productId}/reviews/${reviewId}`);
			
			dispatch({
				type: "DELETE_REVIEW",
				payload: response.data
			});
			dispatch(finishLoading());
			history.push(`/products/${productId}`);
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};