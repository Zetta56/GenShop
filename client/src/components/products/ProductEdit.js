import React, {useEffect, useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {fetchProduct, editProduct} from "../../actions";
import "./ProductForm.css";

const ProductEdit = ({handleSubmit, fetchProduct, editProduct, match, product}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	const renderInput = useCallback(({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input type={inputType} {...input} placeholder={label} step="any" required />
			</div>
		);
	}, []);

	if(!product) {
		return null;
	};

	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>Edit '{product.title}'</h2>
				<form className="ui form" onSubmit={handleSubmit(formValues => editProduct(formValues, match.params.productId))}>
					<Field name="title" component={renderInput} label="Title" inputType="text" />
					<Field name="price" component={renderInput} label="Price" inputType="number" />
					<button className="ui blue button">Update</button>
				</form>
			</div>
		</div>
	);
};

const formWrapped = reduxForm({
	form: "EditProduct"
})(ProductEdit);

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.products[ownProps.match.params.productId], 
		product: state.products[ownProps.match.params.productId]
	};
};

export default connect(mapStateToProps, {fetchProduct, editProduct})(formWrapped);