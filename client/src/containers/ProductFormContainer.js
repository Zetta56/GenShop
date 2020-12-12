import React, {useEffect, useRef} from "react";
import {reduxForm, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import moment from "moment";
import ProductForm from "../components/ProductForm";

const ProductFormContainer = (props) => {
	const buttonContent = props.loading ? <div className="ui mini active inverted inline loader"></div> : props.buttonText;
	const variationsRef = useRef(null);

	//Re-focuses variations input on re-render(ex. when Enter key is pressed)
	useEffect(() => {
		if(variationsRef.current) {
			variationsRef.current.focus();
		}
	}, [props.formValues.variations]);
	
	return <ProductForm 
				{...props} 
				buttonContent={buttonContent} 
				variationsRef={variationsRef} />
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
})(ProductFormContainer);

const mapStateToProps = (state, ownProps) => {
	const selector = formValueSelector("UpsertProduct");

	return {
		initialValues: ownProps.initial || {title: null, variations: [], description: null, discount: null},
		formValues: selector(state, "variations", "discount", "description"),
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps)(formWrapped);