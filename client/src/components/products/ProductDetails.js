import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, fetchReviews} from "../../actions";
import ProductCartForm from "./CartForm";
import ReviewSection from "./ReviewSection";
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
				<div className="ui admin buttons">
					<Link to={`/products/${product._id}/edit`} className="ui tiny yellow button">Edit</Link>
					<Link to={`/products/${product._id}/delete`} className="ui tiny red button">Delete</Link>
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
				{renderAdmin()}
				<h1 className="ui header">{product.title}</h1>
				<div className="ui divider"></div>
				<div className="ui stackable grid">
					<div className="eight wide details column">
						<div className="ui contentTop divider"></div>
						<div className="content">
							<div className="description">
								<h3>Description:</h3>
								{product.description}
							</div>
						</div>
						<div className="ui divider"></div>
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
			</div>
			<ReviewSection reviews={reviews} match={match} />
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