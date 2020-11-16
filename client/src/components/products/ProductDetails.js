import React, {useEffect, useCallback} from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {fetchProduct} from "../../actions";
import ProductCartForm from "./CartForm";
import "./ProductDetails.css";

const ProductDetails = ({fetchProduct, match, product, user}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

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
	);
};

const formWrapped = reduxForm({
	form: "alterCart"
})(ProductDetails);

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: {quantity: 1},
		product: state.products[ownProps.match.params.productId], 
		user: state.user
	};
};

export default connect(mapStateToProps, {fetchProduct})(formWrapped);