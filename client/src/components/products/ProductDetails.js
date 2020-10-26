import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct} from "../../actions";

const ProductDetails = ({fetchProduct, match, product, isAdmin}) => {
	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	const renderAuth = () => {
		if(isAdmin) { 
			return (
				<React.Fragment>
					<Link to={`/products/${product._id}/edit`} className="ui tiny yellow button">Edit</Link>
					<Link to={`/products/${product._id}/delete`} className="ui tiny red button">Delete</Link>
				</React.Fragment>
			);
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
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {product: state.products[ownProps.match.params.productId], isAdmin: state.auth.isAdmin};
};

export default connect(mapStateToProps, {fetchProduct})(ProductDetails);