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
	return async (dispatch, getState) => {
		try {
			//Stop duplicate login requests
			if(!getState().user.isLoggedIn) {
				const response = await axios.post("/api/login", formValues);
				
				dispatch({
					type: "LOGIN",
					payload: response.data
				});
				
				if(!initial) {
					history.push("/");
				}
			};
		} catch(err) {
			await history.push("/login");
			await dispatch(error(err.response.data.message));
		};
	};
};

export const logout = () => {
	return async (dispatch) => {
		await axios.get("/api/logout");
		
		dispatch({
			type: "LOGOUT",
		});
	};
};

export const editCart = (productId, formValues) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.put(`/api/user/cart/${productId}`, formValues);

			dispatch({
				type: "EDIT_CART",
				payload: response.data
			});
			dispatch(finishLoading());
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	}
};

export const deleteCart = () => {
	return async (dispatch) => {
		try {
			const response = await axios.delete("/api/user/cart");
			
			dispatch({
				type: "DELETE_CART",
				payload: response.data
			});
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	};
};

export const editWatchlist = (productId) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			const response = await axios.put(`/api/user/watchlist/${productId}`);

			dispatch({
				type: "EDIT_WATCHLIST",
				payload: response.data
			});
			dispatch(finishLoading());
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	}
};

export const deleteWatchlist = () => {
	return async (dispatch) => {
		try {
			const response = await axios.delete("/api/user/watchlist");
			
			dispatch({
				type: "DELETE_WATCHLIST",
				payload: response.data
			});
		} catch(err) {
			await dispatch(error(err.response.data.message));
		}
	};
};