import React, {useState} from "react";
import {connect} from "react-redux";
import {createReview, editReview, deleteReview} from "../../actions";

const ProductEdit = ({createReview, editReview, deleteReview, match}) => {
	const [rating, setRating] = useState(null);
	const [comment, setComment] = useState("");

	return (
		<div className="reviews">
			<form 
				className="ui form" 
				onSubmit={() => createReview(match.params.productId, {rating, comment})}
			>
				<textarea onChange={(e) => setComment(e.target.value)}></textarea>
				<button className="ui blue button">Add Review</button>
			</form>
		</div>
	);
};

export default connect(null, {createReview, editReview, deleteReview})(ProductEdit);