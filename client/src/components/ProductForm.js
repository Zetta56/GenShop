import React, {useCallback} from "react";
import {Field} from "redux-form";
import {Link} from "react-router-dom";
import ImageUpload from "react-images-upload";
import VariationsInput from "react-tagsinput";
import Input from "./Input";
import TextArea from "./TextArea";
import "react-tagsinput/react-tagsinput.css";
import "./ProductForm.css";

//Props: handleSubmit, onFormSubmit, cancelUrl, buttonContent, header
const ProductForm = ({formValues, initialValues, variationsRef, ...props}) => {
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
	}, [formValues, initialValues, variationsRef]);

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
                {meta.touched && meta.error &&
                    <div className="errorLabel">{meta.error}</div>
                }
            </div>
		);
	}, []);
	
	return (
		<div className="ui one column stackable grid" id="productForm">
			<div className="column">
				<h2>{props.header}</h2>
				<form 
					className="ui form"
					onSubmit={props.handleSubmit(formValues => props.onFormSubmit(formValues))} 
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
					<button className="ui blue button">{props.buttonContent}</button>
					<Link to={props.cancelURL} className="ui button">Cancel</Link>
				</form>
			</div>
		</div>
	);
};

export default ProductForm;