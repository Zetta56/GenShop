import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import axios from "axios"

import reducers from "./reducers";
import App from "./containers/App";

let refreshCooldown = false;
window.setInterval(() => refreshCooldown = false, 180000);
const excludedActions = ["@@redux-form/REGISTER_FIELD", "@@redux-form/UPDATE_SYNC_ERRORS", "@@INIT", "LOGIN", "LOGOUT"];
const refresh = store => next => async (action) => {
	if(!refreshCooldown && !excludedActions.includes(action.type)) {
		refreshCooldown = true;
		await axios.post("/api/refresh");
	}
	next(action);
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, refresh)));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector("#root")
);