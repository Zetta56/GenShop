import React, {useEffect, useCallback} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {fetchProduct, editProduct} from "../../actions";
import ProductUpsertForm from "./ProductUpsertForm";

const ProductEdit = ({handleSubmit, fetchProduct, editProduct, match, product, initialValues}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	if(!product) {
		return <div className="ui active centered inline loader"></div>
	};

	return (
		<ProductUpsertForm 
			onFormSubmit={formValues => editProduct(formValues, product._id)}
			initial={initialValues}
			header={`Edit '${product.title}'`}
			buttonText="Update" />
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: _.omit(state.products[ownProps.match.params.productId], "image"), 
		product: state.products[ownProps.match.params.productId]
	};
};

export default connect(mapStateToProps, {fetchProduct, editProduct})(ProductEdit);