import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, fetchReviews} from "../../actions";
import ProductCartForm from "./CartForm";
import ReviewSection from "../reviews/ReviewSection";
import Stars from "../Stars";
import "./ProductDetails.css";

const ProductDetails = ({fetchProduct, fetchReviews, match, product, reviews, user}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
		fetchReviews(match.params.productId);
	}, [fetchProduct, fetchReviews, match]);

	//Renders edit & delete buttons
	const renderAdmin = () => {
		if(user.isAdmin) { 
			return (
				<div className="ui dropdown">
					<i className="fas fa-ellipsis-v" />
					<div className="menu">
						<Link to={`/products/${product._id}/edit`} className="item">Edit</Link>
						<Link to={`/products/${product._id}/delete`} className="item">Delete</Link>
					</div>
				</div>
			);
		};
	};

	if(!product) {
		return <div className="ui active centered inline loader"></div>
	};

	return (
		<div id="productDetails">
			<div className="details">
				<h1 className="ui header">
					{product.title}
					{renderAdmin()}
					{product.ratings.length > 0 &&
						<Stars rating={product.ratings.reduce((a, b) => a + b) / product.ratings.length} />
					}
				</h1>
				<div className="ui divider"></div>
				<div className="ui stackable grid">
					<div className="eight wide details column">
						<div className="ui contentTop divider"></div>
						<ProductCartForm 
							product={product} 
							user={user} 
							match={match} />
					</div>
					<div className="eight wide image column">
						<div className="ui fluid image">
							<img src={`data:${product.image.contentType};base64,${product.image}`} alt={product.title} />
						</div>
					</div>
				</div>
				<div className="ui divider"></div>
				<div className="description">
					<h3>Details:</h3>
					{product.description}
				</div>
			</div>
			<ReviewSection 
				reviews={reviews} 
				match={match}
				user={user}
				product={product} />
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: {quantity: 1},
		product: state.products[ownProps.match.params.productId], 
		reviews: state.reviews,
		user: state.user
	};
};

export default connect(mapStateToProps, {fetchProduct, fetchReviews})(ProductDetails);