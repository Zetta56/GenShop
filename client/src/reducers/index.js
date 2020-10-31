import {combineReducers} from "redux";
import {reducer as FormReducer} from "redux-form";
import alertReducer from "./AlertReducer";
import userReducer from "./UserReducer";
import ProductReducer from "./ProductReducer";

export default combineReducers({
	form: FormReducer,
	alert: alertReducer,
	user: userReducer,
	products: ProductReducer
});