import React, {useEffect, useCallback} from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {fetchProduct, alterCart} from "../../actions";
import "./ProductDetails.css";

const ProductDetails = ({handleSubmit, fetchProduct, alterCart, match, product, user, loading}) => {
	const addButtonContent = loading 
		  ? <div className="ui mini active inverted inline loader"></div> 
		  : "Add to Cart";

	useEffect(() => {
		fetchProduct(match.params.productId);
	}, [fetchProduct, match]);

	const onRemoveClick = (e) => {
		e.preventDefault();
		alterCart(false, match.params.productId, null);
	};

	const renderAuth = () => {
		if(user.isAdmin) { 
			return (
				<div className="ui auth buttons">
					<Link to={`/products/${product._id}/edit`} className="ui tiny yellow button">Edit</Link>
					<Link to={`/products/${product._id}/delete`} className="ui tiny red button">Delete</Link>
				</div>
			);
		};
	};

	const renderInput = useCallback(({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input {...input} type={inputType} min={1} step={1} required />
			</div>
		);
	}, []);

	const renderCartButton = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.filter(item => item.product === match.params.productId).length > 0) {
			return <button onClick={e => onRemoveClick(e)} className="ui red button">Remove from Cart</button>
		} else {
			return (
				<button className="ui blue button">{addButtonContent}</button>
			);
		}
	}

	if(!product) {
		return <div className="ui active centered inline loader"></div>
	};

	return (
		<div id="productDetails">
			{renderAuth()}
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
					<form className="cartForm" onSubmit={handleSubmit(formValues => alterCart(true, match.params.productId, formValues))}>
						<div className="price">Unit Price: ${product.price}</div>
						<Field name="quantity" component={renderInput} label="Quantity: " inputType="number" required />
						{renderCartButton()}
					</form>
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
		user: state.user,
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProduct, alterCart})(formWrapped);