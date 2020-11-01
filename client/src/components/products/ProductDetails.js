import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {fetchProduct, addToCart} from "../../actions";

const ProductDetails = ({handleSubmit, fetchProduct, addToCart, match, product, user}) => {
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
		};
	};

	const renderInput = ({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input {...input} type={inputType} min={0} step={1} />
			</div>
		);
	};

	const renderCartForm = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.filter(product => product._id === match.params.productId).length > 0) {
			return <button onClick={() => addToCart(false, match.params.productId)} className="ui red button">Remove from Cart</button>
		} else {
			return (
				<form>
					<Field name="amount" component={renderInput} label="Amount" inputType="number" required />
					<button 
						onClick={handleSubmit(formValues => addToCart(true, match.params.productId, formValues))} 
						className="ui blue button"
					>
						Add to Cart
					</button>
				</form>
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
			{renderCartForm()}
		</div>
	);
};

const formWrapped = reduxForm({
	form: "AddToCart"
})(ProductDetails);

const mapStateToProps = (state, ownProps) => {
	return {product: state.products[ownProps.match.params.productId], user: state.user};
};

export default connect(mapStateToProps, {fetchProduct, addToCart})(formWrapped);