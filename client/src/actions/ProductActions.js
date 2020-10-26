import axios from "axios";
import history from "../history";
import {error} from "./ErrorActions";

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