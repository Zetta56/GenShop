import React, {useState, useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import "./ProductForm.css";

const ProductForm = ({handleSubmit, onFormSubmit, loading, header, buttonText}) => {
	const [imageMissing, setImageMissing] = useState(null);
	const buttonContent = loading ? <div className="ui mini active inverted inline loader"></div> : buttonText;

	const onImageChange = (input, pics) => {
		input.onChange(pics[0]);
		setImageMissing(null);
	};

	const renderInput = useCallback(({input, label, inputType, meta}) => {
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
                onChange={pics => onImageChange(input, pics)}
                singleImage={true}
                imgExtension={[".jpg", ".gif", ".png"]}
                buttonText="Select Image"
                label="Upload a Product Image. Max File Size: 5mb"
                withPreview={true} />
		);
	}, []);

	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>{header}</h2>
				<form 
					className="ui form"
					onSubmit={handleSubmit(formValues => formValues.image ? onFormSubmit(formValues) : setImageMissing("Please submit an image"))} 
					encType="multipart/form-data"
				>
					<Field name="title" component={renderInput} label="Title" inputType="text" />
					<Field name="price" component={renderInput} label="Price" inputType="number" />
					<Field name="image" component={renderImageUpload} />
					{imageMissing && <div className="errorLabel">{imageMissing}</div>}
					<button className="ui blue button">{buttonContent}</button>
					<Link to="/products" className="ui button">Cancel</Link>
				</form>
			</div>
		</div>
	);
};

const formWrapped = reduxForm({
	form: "ProductForm"
})(ProductForm);

const mapStateToProps = (state, ownProps) => {
	return {initialValues: ownProps.initial, loading: state.alert.loading};
};

export default connect(mapStateToProps)(formWrapped);