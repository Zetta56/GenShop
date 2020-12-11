import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../history";
import {fetchProduct, deleteProduct} from "../actions";
import Modal from "../components/Modal";

const ProductDelete = ({fetchProduct, deleteProduct, match, loading}) => {
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
				<Link to={`/products/${match.params.productId}`} className="ui button">Cancel</Link>
			</React.Fragment>
		);
	};

	return (
		<Modal 
			header="Confirm Deletion" 
			content={`Are you sure you want to permanently delete this product? This action cannot be undone.`}
			actions={renderButtons()}
			onDismiss={() => history.push(`/products/${match.params.productId}`)} />
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProduct, deleteProduct})(ProductDelete);