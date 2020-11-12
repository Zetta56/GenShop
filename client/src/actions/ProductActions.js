import axios from "axios";
import history from "../history";
import {error, loading, finishLoading} from "./AlertActions";

export const fetchProducts = (search) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.get("/api/products", {params: {user: search}});

			dispatch({
				type: "FETCH_PRODUCTS",
				payload: response.data
			});
			dispatch(finishLoading());
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
			dispatch(loading());
			const fd = new FormData();
			for(const key in formValues) {
				fd.append(key, formValues[key]);
			};
			const response = await axios.post("/api/products", fd, {headers: {"Content-Type": "multipart/form-data"}});

			dispatch({
				type: "CREATE_PRODUCT",
				payload: response.data
			});
			dispatch(finishLoading());

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
			dispatch(loading());
			const fd = new FormData();
			for(const key in formValues) {
				fd.append(key, formValues[key]);
			};

			const response = await axios.put(`/api/products/${productId}`, fd, {headers: {"Content-Type": "multipart/form-data"}});

			dispatch({
				type: "EDIT_PRODUCT",
				payload: response.data
			});
			dispatch(finishLoading());

			history.push(`/products/${productId}`);
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	};
};

export const deleteProduct = (productId) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.delete(`/api/products/${productId}`);
			
			dispatch({
				type: "DELETE_PRODUCT",
				payload: response.data
			});
			dispatch(finishLoading());

			history.push("/products");
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	};
};