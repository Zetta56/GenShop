import React, {useState, useCallback, useRef} from "react";
import {reduxForm, Field} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import "./ProductForm.css";

const ProductForm = ({handleSubmit, onFormSubmit, loading, header, buttonText, initial}) => {
	const [imageMissing, setImageMissing] = useState(null);
	const buttonContent = loading ? <div className="ui mini active inverted inline loader"></div> : buttonText;
	let descriptionRef = useRef("");
	if(initial && initial.description) {
		descriptionRef = initial.description;
	};

	const onImageChange = (input, pics) => {
		input.onChange(pics[0]);
		setImageMissing(null);
	};

	const renderInput = useCallback(({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input {...input} type={inputType} placeholder={label} step="any" required />
			</div>
		);
	}, []);

	const renderTextArea = useCallback(({input, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<textarea {...input} placeholder={label} maxLength={2000} required>{descriptionRef.current}</textarea>
			</div>
		);
	}, [descriptionRef]);

	const renderImageUpload = useCallback(({input, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<ImageUpload
	                onChange={pics => onImageChange(input, pics)}
	                singleImage={true}
	                imgExtension={[".jpg", ".gif", ".png"]}
	                buttonText="Select Image"
	                label="Upload a Product Image. Max File Size: 5mb"
	                withPreview={true} />
            </div>
		);
	}, []);

	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>{header}</h2>
				<form 
					className="ui form"
					onSubmit={handleSubmit(formValues => formValues.image ? onFormSubmit(formValues) : setImageMissing("*Please choose an image"))} 
					encType="multipart/form-data"
				>
					<Field name="title" component={renderInput} label="Name" inputType="text" />
					<Field name="description" component={renderTextArea} label="Description" />
					<Field name="price" component={renderInput} label="Price" inputType="number" />
					<Field name="image" component={renderImageUpload} label="Image" />
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