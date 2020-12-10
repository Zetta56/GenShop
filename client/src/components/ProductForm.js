import React, {useEffect, useCallback, useRef} from "react";
import {reduxForm, Field, formValueSelector} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import VariationsInput from "react-tagsinput";
import moment from "moment";
import Input from "./Input";
import TextArea from "./TextArea";
import "react-tagsinput/react-tagsinput.css";
import "./ProductForm.css";

const UpsertForm = ({handleSubmit, onFormSubmit, formValues, initialValues, loading, header, buttonText, cancelURL}) => {
	const buttonContent = loading ? <div className="ui mini active inverted inline loader"></div> : buttonText;
	const variationsRef = useRef(null);

	//Re-focuses variations input on re-render(ex. when Enter key is pressed)
	useEffect(() => {
		if(variationsRef.current) {
			variationsRef.current.focus();
		}
	}, [formValues.variations]);

	const renderError = (meta) => {
		if(meta.touched && meta.error) {
			return <div className="errorLabel">{meta.error}</div>
		};
	};

	const renderVariationsInput = useCallback(({input, label}) => {
		return (
			<div className="options field">
				<label>{label}</label>
				<VariationsInput
					value={formValues.variations || initialValues.variations}
					onChange={option => input.onChange(option)}
					addOnBlur={true}
					addOnPaste={true}
					inputProps={{placeholder: "Add option...", ref: variationsRef}} />
            </div>
		);
	}, [formValues, initialValues]);

	const renderImageUpload = useCallback(({input, meta, label}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<ImageUpload
	                onChange={files => input.onChange(files[0])}
	                singleImage={true}
	                imgExtension={[".jpg", ".gif", ".png"]}
	                buttonText="Select Image"
	                label="Upload a Product Image. Max File Size: 5mb"
	                withPreview={true} />
	            {renderError(meta)}
            </div>
		);
	}, []);
	
	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>{header}</h2>
				<form 
					className="ui form"
					onSubmit={handleSubmit(formValues => onFormSubmit(formValues))} 
				>
					<Field name="title" component={Input} label="Name" inputType="text" />
					<Field name="description" component={TextArea} label="Description" placeholder="Description" maxLength={200} />
					<Field name="price" component={Input} label="Price" inputType="number" min={0} />
					<Field name="discount" component={Input} label="Discount % (Optional)" placeholder="Discount" inputType="number" min={1} max={100} step={1} required={false} />
					{formValues.discount && 
						<Field name="discountDate" component={Input} label={"Until (date)"} inputType="date" />
					}
					<Field name="variations" component={renderVariationsInput} label="Variations (Optional)" />
					<Field name="image" component={renderImageUpload} label="Image" />
					<button className="ui blue button">{buttonContent}</button>
					<Link to={cancelURL} className="ui button">Cancel</Link>
				</form>
			</div>
		</div>
	);
};

const validate = ({title, description, price, image, discount, discountDate}) => {
	const err = {};

	if(!title) {
		err.title = "You must enter a name for your product."
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
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps)(formWrapped);