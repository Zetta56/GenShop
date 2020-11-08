import React from "react";
import {connect} from "react-redux";
import {createProduct} from "../../actions";
import ProductForm from "./ProductForm"

const ProductCreate = ({handleSubmit, createProduct}) => {
	return <ProductForm 
				onFormSubmit={formValues => createProduct(formValues)} 
				header="Create New Listing"
				buttonText="Create" />
};

export default connect(null, {createProduct})(ProductCreate);