import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../../history";
import {deleteReview} from "../../actions";
import Modal from "../Modal";

const ReviewDelete = ({deleteReview, match}) => {
	const renderButtons = () => {
		return (
			<React.Fragment>
                <button 
                    onClick={() => deleteReview(match.params.productId, match.params.reviewId)} 
                    className="ui red button"
                >
					Delete
				</button>
				<Link to={`/products/${match.params.productId}`} className="ui button">Cancel</Link>
			</React.Fragment>
		);
	};

	return (
		<Modal 
			header="Confirm Deletion" 
			content="Are you sure you want to permanently delete this review?"
			actions={renderButtons()}
			onDismiss={() => history.push(`/products/${match.params.productId}`)} />
	);
};

export default connect(null, {deleteReview})(ReviewDelete);