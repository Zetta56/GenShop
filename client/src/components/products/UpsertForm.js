import React, {useState, useEffect, useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import ImageUpload from "react-images-upload";
import VariationsInput from "react-tagsinput";
import {fetchProducts} from "../../actions";
import Input from "../Input";
import "react-tagsinput/react-tagsinput.css";
import "./UpsertForm.css";

const UpsertForm = ({handleSubmit, onFormSubmit, fetchProducts, ownProduct, loading, header, buttonText, initial}) => {
	const [variations, setVariations] = useState(ownProduct.variations || []);
	const buttonContent = loading ? <div className="ui mini active inverted inline loader"></div> : buttonText;

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const onOptionChange = (input, option) => {
		setVariations(option);
		input.onChange(option);
	};

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
					{ownProduct.description}
				</textarea>
				{renderError(meta)}
			</div>
		);
	}, [ownProduct]);

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

	const renderVariationsInput = useCallback(({input, label}) => {
		return (
			<div className="options field">
				<label>{label}</label>
				<VariationsInput
					value={variations}
					onChange={option => onOptionChange(input, option)}
					addOnBlur={true}
					addOnPaste={true}
					inputProps={{placeholder: "Add option..."}} />
            </div>
		);
	}, [variations]);

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
					<Field name="variations" component={renderVariationsInput} label="Variations (Optional)" />
					<Field name="image" component={renderImageUpload} label="Image" />
					<button className="ui blue button">{buttonContent}</button>
					<Link to="/products" className="ui button">Cancel</Link>
				</form>
			</div>
		</div>
	);
};

const validate = ({title, description, price, image}, {products, ownProduct}) => {
	const err = {};

	if(!title) {
		err.title = "You must enter a name for your product."
	}

	if(products && products.filter(product => product.title === title && ownProduct.title !== product.title).length > 0) {
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
	const ownProduct = ownProps.match
		? Object.values(state.products).find(product => product._id === ownProps.match.params.productId)
		: {title: null, variations: [], description: null}

	return {
		initialValues: ownProps.initial,
		products: Object.values(state.products),
		ownProduct: ownProduct,
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProducts})(formWrapped);