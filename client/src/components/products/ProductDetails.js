import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, addToCart} from "../../actions";
import axios from "axios";

const ProductDetails = ({fetchProduct, addToCart, match, product, user}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	const renderAuth = () => {
		if(user.isAdmin) { 
			return (
				<React.Fragment>
					<Link to={`/products/${product._id}/edit`} className="ui tiny yellow button">Edit</Link>
					<Link to={`/products/${product._id}/delete`} className="ui tiny red button">Delete</Link>
				</React.Fragment>
			);
		}
	}

	const renderCartButton = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.includes(match.params.productId)) {
			return <button onClick={() => addToCart(match.params.productId, false)} className="ui red button">Remove from Cart</button>
		} else {
			return <button onClick={() => addToCart(match.params.productId, true)} className="ui blue button">Add to Cart</button>
		}
	}

	if(!product) {
		return null;
	};

	return (
		<div>
			{product.title}
			{product.price}
			{renderAuth()}
			{renderCartButton()}
			<button onClick={() => axios.post("/api/checkout")} className="ui blue button">To Checkout</button>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {product: state.products[ownProps.match.params.productId], user: state.user};
};

export default connect(mapStateToProps, {fetchProduct, addToCart})(ProductDetails);