import React, {useEffect, useCallback} from "react";
import {connect} from "react-redux";
import {fetchProduct, editProduct} from "../../actions";
import ProductForm from "./ProductForm";

const ProductEdit = ({handleSubmit, fetchProduct, editProduct, match, product}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	if(!product) {
		return null;
	};

	return (
		<ProductForm 
			onFormSubmit={formValues => editProduct(formValues, product._id)}
			initial={product}
			header={`Edit '${product.title}'`}
			buttonText="Update" />
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.products[ownProps.match.params.productId], 
		product: state.products[ownProps.match.params.productId]
	};
};

export default connect(mapStateToProps, {fetchProduct, editProduct})(ProductEdit);