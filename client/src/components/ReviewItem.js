import React, {useState} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import {editReview} from "../actions";
import ReviewForm from "./ReviewForm";
import Stars from "./Stars";
import avatar from "../assets/defaultAvatar.jpg";

const Review = ({editReview, product, review, user}) => {
	const [editing, setEditing] = useState(null);

	//Renders edit form or comment text
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
					<Stars rating={review.ratings} />
					<div className="body">{review.comment}</div>
				</div>
			);
		};
	};

	//Renders review actions menu
	const renderManipulate = (review) => {
		if((user._id === review.user.id || user.isAdmin) && !editing) {
			return (
				<div className="ui three-dot dropdown">
					<i className="fas fa-ellipsis-v" />
					<div className="menu">
						{user._id === review.user.id &&
							<Link to="#" onClick={() => setEditing(review._id)} className="item">
								Edit
							</Link>
						}
						<Link to={`/products/${product._id}/reviews/${review._id}/delete`} className="item">
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

export default connect(null, {editReview})(Review);