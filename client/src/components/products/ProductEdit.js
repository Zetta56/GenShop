import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import moment from "moment";
import {editProduct} from "../../actions";
import UpsertForm from "./UpsertForm";

const ProductEdit = ({editProduct, match, initialValues}) => {
	return (
		<UpsertForm 
			onFormSubmit={formValues => editProduct(formValues, match.params.productId)}
			initial={initialValues}
			match={match}
			header="Edit Product"
			buttonText="Update"
			cancelURL={`/products/${match.params.productId}`} />
	);
};

const mapStateToProps = (state, ownProps) => {
	const product = state.products[ownProps.match.params.productId];

	return {
		initialValues: {
			..._.omit(product, "image"),
			discountDate: moment(product.expireAt).format("YYYY-MM-DD")
		}, 
		products: Object.values(state.products)
	};
};

export default connect(mapStateToProps, {editProduct})(ProductEdit);