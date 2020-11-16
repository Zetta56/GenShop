import React, {useCallback} from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {alterCart} from "../../actions";
import Input from "../Input";

const CartForm = ({handleSubmit, alterCart, match, product, user, loading}) => {
	const addButtonContent = loading 
		  ? <div className="ui mini active inverted inline loader"></div> 
		  : "Add to Cart";

	//Removes product from cart
	const onRemoveClick = (e) => {
		e.preventDefault();
		alterCart(false, match.params.productId, null);
	};

	const renderRadioInput = useCallback(({input, label}) => {
		return (
			<div className="grouped fields">
				<label>{label}</label>
				{product.variations.map(option => {
					return (
						<div className="field" key={option}>
							<div className="ui radio checkbox">
								<input 
									{...input} 
									type="radio" 
									name="variation"
									value={option}
									onChange={() => input.onChange(option)} 
									required />
								<label>{option}</label>
							</div>
						</div>
					);
				})}
			</div>
		);
	}, [product]);

	//Conditionally renders button in cart form
	const renderCartButton = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.filter(item => item.product === match.params.productId).length > 0) {
			return <button onClick={e => onRemoveClick(e)} className="ui red button">Remove from Cart</button>
		} else {
			return (
				<button className="ui blue button">{addButtonContent}</button>
			);
		};
	};

	return (
		<form className="cartForm" onSubmit={handleSubmit(formValues => alterCart(true, match.params.productId, formValues))}>
			<div className="price">Unit Price: ${product.price}</div>
			<Field
				name="variation"
				component={renderRadioInput}
				label="Select Variation: "
				required />
			<Field 
				name="quantity" 
				component={Input} 
				label="Quantity: " 
				hiddenPlaceholder={true}
				inputType="number"
				min={0}
				step={1}
				required />
			{renderCartButton()}
		</form>
	);
};

const formWrapped = reduxForm({
	form: "AlterCart"
})(CartForm);

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: {quantity: 1},
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {alterCart})(formWrapped);