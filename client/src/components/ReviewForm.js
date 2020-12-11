import React from "react";
import {connect} from "react-redux";
import {reduxForm, Field, reset, formValueSelector} from "redux-form";
import StarsInput from "./StarsInput";
import TextArea from "./TextArea";

const ReviewForm = ({handleSubmit, onFormSubmit, ratings, buttonText, cancel}) => {
	return (
		<form className="ui form" onSubmit={handleSubmit(formValues => onFormSubmit(formValues))}>
			<StarsInput ratings={ratings} />
			<Field name="comment" component={TextArea} placeholder="Add a comment..." required />
			<button className="ui blue create button">{buttonText}</button>
			{cancel &&
				<button type="button" onClick={() => cancel()} className="ui button">Cancel</button>
			}
		</form>
	);
};

const formWrapped = reduxForm({
	//Resets or closes form on submit
	onSubmitSuccess: (result, dispatch, props) => {
		props.cancel ? props.cancel() : dispatch(reset(props.form));
	}
})(ReviewForm);

const mapStateToProps = (state, ownProps) => {
	const selector = formValueSelector(ownProps.form);
	
	//initialValues populates fields initially and ratings selector maintains current rating
	return {
		ratings: selector(state, "ratings"),
		initialValues: ownProps.initial
	};
};

export default connect(mapStateToProps)(formWrapped);