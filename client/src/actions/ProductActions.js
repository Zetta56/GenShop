import axios from "axios";
import history from "../history";
import {error, loading, finishLoading} from "./AlertActions";

export const fetchProducts = (user, key) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.get("/api/products", {params: {user, key}});

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
			await history.push("/");
			dispatch(error(err.response.data.message));
		}
	};
};

export const createProduct = (formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			//Converts image into data url and returns result synchronously
			const imageData = await new Promise(resolve => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(formValues.image);
			});
			const response = await axios.post("/api/products", {...formValues, image: imageData});

			dispatch({
				type: "CREATE_PRODUCT",
				payload: response.data
			});
			dispatch(finishLoading());

			history.push("/");
		} catch(err) {
			console.log(err)
			await history.push("/");
			dispatch(error(err.response.data.message));
		}
	};
};

export const editProduct = (formValues, productId) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const imageData = await new Promise(resolve => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(formValues.image);
			});
			const response = await axios.put(`/api/products/${productId}`, {...formValues, image: imageData});

			dispatch({
				type: "EDIT_PRODUCT",
				payload: response.data
			});
			dispatch(finishLoading());

			history.push(`/products/${productId}`);
		} catch(err) {
			await history.push("/");
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

			history.push("/");
		} catch(err) {
			await history.push("/");
			dispatch(error(err.response.data.message));
		}
	};
};