import React, {useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import {createProduct} from "../../actions";
import "./ProductForm.css";

const ProductCreate = ({handleSubmit, createProduct}) => {
	const renderInput = useCallback(({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input {...input} type={inputType} placeholder={label} step="any" required />
			</div>
		);
	}, []);

	const renderImageUpload = useCallback(({input}) => {
		return (
			<ImageUpload
                onChange={pics => input.onChange(pics[0])}
                singleImage={true}
                imgExtension={[".jpg", ".gif", ".png"]}
                buttonText="Upload Image"
                label="Choose a Product Image. Max File Size: 5mb" />
		);
	}, []);

	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>Create New Listing</h2>
				<form className="ui form" onSubmit={handleSubmit(formValues => createProduct(formValues))} encType="multipart/form-data">
					<Field name="title" component={renderInput} label="Title" inputType="text" />
					<Field name="price" component={renderInput} label="Price" inputType="number" />
					<Field name="image" component={renderImageUpload} />
					<button className="ui blue button">Create</button>
				</form>
			</div>
		</div>
	);
};

const formWrapped = reduxForm({
	form: "CreateProduct"
})(ProductCreate);

export default connect(null, {createProduct})(formWrapped);