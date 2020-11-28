import React, {useState} from "react";
import {connect} from "react-redux";
import {reduxForm, Field, reset, formValueSelector} from "redux-form";

const ReviewForm = ({handleSubmit, onFormSubmit, ratings, buttonText, cancel}) => {
	const [hoverRatings, setHoverRatings] = useState(null);

	//Closes the form on cancel button click
	const onCancelClick = (e) => {
		e.preventDefault();
		cancel();
	};

	//Renders 5-star rating with radio buttons
	const renderRatings = () => {
		const el = [];
		for(let i = 1; i <= 5; i++) {
			const yellow = i <= ratings ? "yellow" : "";
			const orange = i <= hoverRatings ? "orange" : "";
			const intRating = ratings && typeof ratings === "string" ? Number.parseInt(ratings) : ratings ;

			el.push(
				<React.Fragment key={i}>
					<label 
						onMouseEnter={() => setHoverRatings(i)} 
						onMouseLeave={() => setHoverRatings(null)}
						onClick={() => setHoverRatings(null)}
					>
						<Field 
							name="ratings" 
							component="input" 
							type="radio"
							value={i}
							checked={i === intRating}
							required />
						<i className={`${yellow} ${orange} fas fa-star`}></i>
					</label>
				</React.Fragment>
			);
		};
		return <div className="ratings">{el}</div>
	};

	return (
		<form className="ui form" onSubmit={handleSubmit(formValues => onFormSubmit(formValues))}>
			{renderRatings()}
			<Field name="comment" component="textarea" placeholder="Add a comment..." required />
			<button className="ui blue create button">{buttonText}</button>
			{cancel &&
				<button onClick={(e) => onCancelClick(e)} className="ui button">Cancel</button>
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