import React, {useState} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import {editReview, deleteReview} from "../../actions";
import ReviewForm from "./ReviewForm";
import avatar from "../../assets/defaultAvatar.jpg";

const Review = ({editReview, deleteReview, product, review, user}) => {
	const [editing, setEditing] = useState(null);

	const renderStars = (rating) => {
		const el = [];

		for(let i = 1; i <= 5; i++) {
			const yellow = i <= rating ? "yellow" : "";

			el.push(
				<i key={i} className={`${yellow} fas fa-star`} />
			);
		};

		return <React.Fragment>{el}</React.Fragment>
	};

	const renderComment = (review, editing) => {
		if(editing === review._id) {
			return <ReviewForm 
						form={`${review._id} Review`}
						onFormSubmit={formValues => editReview(product._id, review._id, formValues)}
						buttonText="Update"
						cancel={() => setEditing(null)}
						initial={{ratings: review.ratings, comment: review.comment}} />
		} else {
			return (
				<div className="text">
					<div>{renderStars(review.ratings)}</div>
					<div className="body">{review.comment}</div>
				</div>
			);
		};
	};

	const renderManipulate = (review) => {
		if(user._id === review.user.id && !editing) {
			return (
				<div className="ui dropdown">
					<i className="fas fa-ellipsis-v" />
					<div className="menu">
						<Link to="#" onClick={() => setEditing(review._id)} className="item">
							Edit
						</Link>
						<Link to="#" onClick={() => deleteReview(product._id, review._id)} className="item">
							Delete
						</Link>
					</div>
				</div>
			);
		}
    };
    
    return (
        <div className="comment">
            <div className="avatar">
                <img src={avatar} alt={review.user.username} />
            </div>
            <div className="content">
                <span className="author">{review.user.username}</span>
                <div className="metadata">
                    <span className="date">
                        {moment(review.created).fromNow()}
                    </span>
                    {renderManipulate(review)}
                </div>
                {renderComment(review, editing)}
            </div>
        </div>
    );
};

export default connect(null, {editReview, deleteReview})(Review);