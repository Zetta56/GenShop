import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../../history";
import {fetchProduct, deleteProduct} from "../../actions";
import Modal from "../Modal";

const ProductDelete = ({fetchProduct, deleteProduct, match, product, loading}) => {
	const buttonContent = loading ? <div className="ui mini active inline loader"></div> : "Confirm";

	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	const renderButtons = () => {
		return (
			<React.Fragment>
				<button onClick={() => deleteProduct(match.params.productId)} className="ui red button">
					{buttonContent}
				</button>
				<Link to={`/products/${product._id}`} className="ui button">Cancel</Link>
			</React.Fragment>
		);
	};

	if(!product) {
		return null;
	};

	return (
		<Modal 
			header="Confirm Deletion" 
			content={`Are you sure you want to permanently delete '${product.title}'? This action cannot be undone.`}
			actions={renderButtons()}
			onDismiss={() => history.push(`/products/${product._id}`)} />
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		product: state.products[ownProps.match.params.productId], 
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProduct, deleteProduct})(ProductDelete);