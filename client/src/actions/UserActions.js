import axios from "axios";
import history from "../history";
import {error, loading, finishLoading} from "./AlertActions";

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
				history.push("/");
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

export const alterCart = (adding, productId, formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.post(`/api/alter-cart/${productId}`, formValues);

			dispatch({
				type: "ALTER_CART",
				payload: response.data
			});
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