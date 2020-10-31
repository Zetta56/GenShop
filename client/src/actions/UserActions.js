import axios from "axios";
import history from "../history";
import {error, confirm} from "./AlertActions";

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

export const login = (formValues) => {
	//Accessed when reloaded or first load
	if(formValues && !formValues.password && !formValues.googleToken) {
		return {
			type: "LOGIN",
			payload: formValues
		}
	};

	//Accessed from login form
	return async (dispatch) => {
		try {
			const response = await axios.post("/api/login", formValues);
			
			dispatch({
				type: "LOGIN",
				payload: response.data
			});
			
			history.push("/products");
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

export const addToCart = (productId, newItem) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(`/api/add-to-cart/${productId}`);
			const message = newItem ? "added to" : "removed from";

			dispatch({
				type: "ADD_TO_CART",
				payload: response.data
			});

			dispatch(confirm(`Product successfully ${message} cart.`));
		} catch(err) {
			await history.push("/products");
			dispatch(error(err.response.data.message));
		}
	}
};