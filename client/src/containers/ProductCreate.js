import React from "react";
import {connect} from "react-redux";
import {createProduct} from "../actions";
import ProductForm from "../components/ProductForm"

const ProductCreate = ({createProduct}) => {
	return <ProductForm 
				onFormSubmit={formValues => createProduct(formValues)} 
				header="Create New Listing"
				buttonText="Create"
				cancelURL="/" />
};

export default connect(null, {createProduct})(ProductCreate);