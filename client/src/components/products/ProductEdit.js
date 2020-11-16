import React, {useEffect, useCallback} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {editProduct} from "../../actions";
import UpsertForm from "./UpsertForm";

const ProductEdit = ({handleSubmit, editProduct, match, products, initialValues}) => {
	return (
		<UpsertForm 
			onFormSubmit={formValues => editProduct(formValues, match.params.productId)}
			initial={initialValues}
			match={match}
			header="Edit Product"
			buttonText="Update" />
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: _.omit(state.products[ownProps.match.params.productId], "image"), 
		products: Object.values(state.products)
	};
};

export default connect(mapStateToProps, {editProduct})(ProductEdit);