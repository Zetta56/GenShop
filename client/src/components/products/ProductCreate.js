import React, {useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {createProduct} from "../../actions";
import "./ProductForm.css";

const ProductCreate = ({handleSubmit, createProduct}) => {
	const renderInput = useCallback(({input, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input type="text" {...input} placeholder={label} required />
			</div>
		);
	}, []);

	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>Create New Listing</h2>
				<form className="ui form" onSubmit={handleSubmit(formValues => createProduct(formValues))}>
					<Field name="title" component={renderInput} label="Title" />
					<button className="ui blue button">Create</button>
				</form>
			</div>
		</div>
	);
};

const reduxWrapped = reduxForm({
	form: "CreateProduct"
})(ProductCreate);

export default connect(null, {createProduct})(reduxWrapped);