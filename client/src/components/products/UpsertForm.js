import React, {useEffect, useCallback} from "react";
import {reduxForm, Field, formValueSelector} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import VariationsInput from "react-tagsinput";
import moment from "moment";
import {fetchProducts} from "../../actions";
import Input from "../Input";
import "react-tagsinput/react-tagsinput.css";
import "./UpsertForm.css";

const UpsertForm = ({handleSubmit, onFormSubmit, fetchProducts, formValues, initialValues, loading, header, buttonText}) => {
	const buttonContent = loading ? <div className="ui mini active inverted inline loader"></div> : buttonText;
	
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderError = (meta) => {
		if(meta.touched && meta.error) {
			return <div className="errorLabel">{meta.error}</div>
		};
	};

	const renderTextArea = useCallback(({input, meta, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<textarea {...input} placeholder={label} maxLength={2000} required>
					{formValues.description}
				</textarea>
				{renderError(meta)}
			</div>
		);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderVariationsInput = useCallback(({input, label}) => {
		return (
			<div className="options field">
				<label>{label}</label>
				<VariationsInput
					value={formValues.variations || initialValues.variations}
					onChange={option => input.onChange(option)}
					addOnBlur={true}
					addOnPaste={true}
					inputProps={{placeholder: "Add option..."}} />
            </div>
		);
	}, [formValues, initialValues]);

	const renderImageUpload = useCallback(({input, meta, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<ImageUpload
	                onChange={pics => input.onChange(pics[0])}
	                singleImage={true}
	                imgExtension={[".jpg", ".gif", ".png"]}
	                buttonText="Select Image"
	                label="Upload a Product Image. Max File Size: 5mb"
	                withPreview={true} />
	            {renderError(meta)}
            </div>
		);
	}, []);

	const renderDiscountDate = () => {
		if(formValues.discount) {
			return (
				<Field name="discountDate" component={Input} label={"Until (date)"} inputType="date" />
			)
		} else {
			return null;
		};
	};
	
	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>{header}</h2>
				<form 
					className="ui form"
					onSubmit={handleSubmit(formValues => onFormSubmit(formValues))} 
					encType="multipart/form-data"
				>
					<Field name="title" component={Input} label="Name" inputType="text" />
					<Field name="description" component={renderTextArea} label="Description" />
					<Field name="price" component={Input} label="Price" inputType="number" min={0} />
					<Field name="discount" component={Input} label="Discount % (Optional)" placeholder="Discount" inputType="number" min={1} max={100} step={1} required={false} />
					{renderDiscountDate()}
					<Field name="variations" component={renderVariationsInput} label="Variations (Optional)" />
					<Field name="image" component={renderImageUpload} label="Image" />
					<button className="ui blue button">{buttonContent}</button>
					<Link to="/products" className="ui button">Cancel</Link>
				</form>
			</div>
		</div>
	);
};

const validate = ({title, description, price, image, discount, discountDate}, {products, initialValues}) => {
	const err = {};

	if(!title) {
		err.title = "You must enter a name for your product."
	}
	
	if(products && products.filter(product => product.title === title && initialValues.title !== product.title).length > 0) {
		err.title = "That name is already taken.";
	}

	if(!description) {
		err.description = "You must enter a description."
	}

	if(!price) {
		err.price = "You must enter a price."
	}

	if(price < 0) {
		err.price = "Invalid price"
	}
	
	if(discount && !discountDate) {
		err.discountDate = "You must set an expiration date for your discount."
	}

	if(discountDate && moment(discountDate).utc()._d < moment(Date.now()).utc()._d) {
		err.discountDate = "Your discount's expiration date has already passed."
	}

	if(!image) {
		err.image = "You must select an image for your product."
	}

	return err;
};

const formWrapped = reduxForm({
	form: "UpsertProduct",
	validate: validate
})(UpsertForm);

const mapStateToProps = (state, ownProps) => {
	const selector = formValueSelector("UpsertProduct");

	return {
		initialValues: ownProps.initial || {title: null, variations: [], description: null, discount: null},
		formValues: selector(state, "variations", "discount", "description"),
		products: Object.values(state.products),
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProducts})(formWrapped);