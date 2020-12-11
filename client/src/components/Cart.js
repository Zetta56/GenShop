import React from "react";
import CartRow from "./CartRow";
import "./Cart.css";

const Cart = ({user, products, total, onCheckoutClick}) => {
	const renderItems = () => {
		return products.map(product => {
			const {variation, quantity} = user.cart.find(item => item.product === product._id);
			const discountPercent = product.discount ? product.discount : 0;
			const itemTotal = product.price - product.price * (discountPercent / 100);

			return <CartRow 
						product={product}
						variation={variation} 
						quantity={quantity}
						itemTotal={itemTotal}
						key={product._id} />
		});
	};

	if(!products || products.length < 1) {
		return <div className="emptyMessage">Your cart is empty.</div>
	};

	return (
		<div id="cart">
			<table className="ui table">
				<thead>
					<tr>
						<th>Image</th>
						<th>Name</th>
						<th>Price</th>
						<th>Qty.</th>
						<th>Item Total</th>
					</tr>
				</thead>
				<tbody>
					{renderItems()}
					<tr>
						<td colSpan="6" className="bottomRow">
							<div className="total">
								Total: ${total.toFixed(2)}
								<button className="ui blue checkout button" onClick={() => onCheckoutClick()}>
									Checkout <i className="angle right icon" />
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="checkout">
				
			</div>
		</div>
	);
};

export default Cart;