import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {createReview} from "../actions";
import ReviewForm from "./ReviewForm";
import Review from "./ReviewItem";
import "./ReviewSection.css";

//Props: product, reviews, user
const ReviewSection = ({createReview, product, reviews, user}) => {
	//Render new review form or sign in button
	const renderTop = () => {
		if(!user.isLoggedIn) {
			return (
				<Link to="/login" className="ui login button">
					Sign in to leave a review
				</Link>
			);
		} else {
			return (
				<React.Fragment>
					<h3>Write a Review</h3>
					<ReviewForm 
						form="CreateReview"
						onFormSubmit={formValues => createReview(product._id, formValues)}
						buttonText="Add Comment" />
				</React.Fragment>
			);
		}
	};

	//Renders list of reviews
	const renderReviews = () => {
		return reviews.map(review => {
			return (
				<Review
					key={review._id}
					product={product}
					review={review}
					user={user}
				/>
			);
		});
	};

	return (
		<div id="reviews">
			{renderTop()}
			<div className="ui comments">
				{renderReviews()}
			</div>
		</div>
	);
};

export default connect(null, {createReview})(ReviewSection);