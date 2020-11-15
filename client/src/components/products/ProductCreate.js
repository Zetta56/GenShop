import React from "react";
import {connect} from "react-redux";
import {createProduct} from "../../actions";
import ProductUpsertForm from "./ProductUpsertForm"

const ProductCreate = ({handleSubmit, createProduct}) => {
	return <ProductUpsertForm 
				onFormSubmit={formValues => createProduct(formValues)} 
				header="Create New Listing"
				buttonText="Create" />
};

export default connect(null, {createProduct})(ProductCreate);