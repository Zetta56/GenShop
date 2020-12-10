import React, {useEffect} from "react";
import {connect} from "react-redux";
import {fetchProduct, fetchReviews} from "../actions";
import ProductInfo from "../components/ProductInfo";
import ReviewSection from "../components/ReviewSection";
import "./ProductDetails.css";

const ProductDetails = ({fetchProduct, fetchReviews, match, product, reviews, user}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
		fetchReviews(match.params.productId);
	}, [fetchProduct, fetchReviews, match]);

	//Renders edit & delete buttons
	if(!product) {
		return <div className="ui active centered inline loader"></div>
	};
	
	return (
		<div id="productDetails">
			<ProductInfo
				product={product}
				user={user}
				match={match} />
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
		product: state.products[ownProps.match.params.productId], 
		reviews: state.reviews,
		user: state.user
	};
};

export default connect(mapStateToProps, {fetchProduct, fetchReviews})(ProductDetails);