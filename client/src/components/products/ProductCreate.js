import React from "react";
import {connect} from "react-redux";
import {createProduct} from "../../actions";
import UpsertForm from "./UpsertForm"

const ProductCreate = ({createProduct}) => {
	return <UpsertForm 
				onFormSubmit={formValues => createProduct(formValues)} 
				header="Create New Listing"
				buttonText="Create"
				cancelURL="/" />
};

export default connect(null, {createProduct})(ProductCreate);