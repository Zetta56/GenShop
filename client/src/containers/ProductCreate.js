import React from "react";
import {connect} from "react-redux";
import {createProduct} from "../actions";
import ProductFormContainer from "./ProductFormContainer";

const ProductCreate = ({createProduct}) => {
	return <ProductFormContainer 
				onFormSubmit={formValues => createProduct(formValues)} 
				header="Create New Listing"
				buttonText="Create"
				cancelURL="/" />
};

export default connect(null, {createProduct})(ProductCreate);