import axios from "axios";
import history from "../history";
import {error} from "./AlertActions";

export const fetchProducts = () => {
	return async (dispatch) => {
		try {
			const response = await axios.get("/api/products");

			dispatch({
				type: "FETCH_PRODUCTS",
				payload: response.data
			});
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};

export const fetchProduct = (productId) => {
	return async (dispatch) => {
		try {
			const response = await axios.get(`/api/products/${productId}`);

			dispatch({
				type: "FETCH_PRODUCT",
				payload: response.data
			});
		} catch(err) {
			dispatch(error(err.response.data.message));
		}
	};
};

export const createProduct = (formValues) => {
	return async (dispatch) => {
		try {
			const response = await axios.post("/api/products", formValues);
			
			dispatch({
				type: "CREATE_PRODUCT",
				payload: response.data
			});

			history.push("/products");
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	};
};

export const editProduct = (formValues, productId) => {
	return async (dispatch) => {
		try {
			const response = await axios.put(`/api/products/${productId}`, formValues);
			
			dispatch({
				type: "EDIT_PRODUCT",
				payload: response.data
			});

			history.push("/products");
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	};
};

export const deleteProduct = (productId) => {
	return async (dispatch) => {
		try {
			const response = await axios.delete(`/api/products/${productId}`);
			
			dispatch({
				type: "DELETE_PRODUCT",
				payload: response.data
			});

			history.push("/products");
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	};
};