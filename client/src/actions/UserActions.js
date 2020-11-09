import axios from "axios";
import history from "../history";
import {error, confirm, loading, finishLoading} from "./AlertActions";

export const createUser = (formValues) => {
	return async (dispatch) => {
		try {
			await axios.post("/api/register", formValues);
			dispatch(login({email: formValues.email, username: formValues.username, password: formValues.password}));
		} catch(err) {
			await history.push("/register");
			await dispatch(error(err.response.data.message));
		};
	};
};

export const login = (formValues, initial) => {
	return async (dispatch) => {
		try {
			const response = await axios.post("/api/login", formValues);
			
			dispatch({
				type: "LOGIN",
				payload: response.data
			});
			
			if(!initial) {
				history.push("/products");
			}
		} catch(err) {
			await history.push("/login");
			await dispatch(error(err.response.data.message));
		};
	};
};

export const logout = (initial) => {
	return async (dispatch) => {
		await axios.get("/api/logout");
		
		dispatch({
			type: "LOGOUT",
		});
	};
};

export const addToCart = (adding, productId, formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.post(`/api/add-to-cart/${productId}`, formValues);
			const message = adding ? "added to" : "removed from";

			dispatch({
				type: "ADD_TO_CART",
				payload: response.data
			});
			dispatch(confirm(`Product successfully ${message} cart.`));
			dispatch(finishLoading());
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	}
};

export const resetCart = () => {
	return async (dispatch) => {
		try {
			const response = await axios.post("/api/reset-cart");
			
			dispatch({
				type: "RESET_CART",
				payload: response.data
			});
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	};
};