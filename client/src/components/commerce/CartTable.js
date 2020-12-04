import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {alterCart} from "../../actions";

const CartTable = ({alterCart, products, user, total}) => {
	const renderVariation = (cartItem) => {
		if(cartItem.variation && cartItem.variation.length > 0) {
			return <em> ({cartItem.variation})</em>;
		};
	};

	const renderItems = () => {
		return products.map(product => {
			const cartItem = user.cart.find(item => item.product === product._id);
			const discountPercent = product.discount ? product.discount : 0;

			return (
				<tr key={product._id}>
					<td className="image">
						<img 
							src={product.image.url} 
							alt={product.title}
							id="productImage" />
					</td>
					<td className="name">
						<strong>
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</strong>
						{renderVariation(cartItem)}
					</td>
					<td className="price">
						<span className="label">Price: </span>
						${Math.round((product.price - product.price * (discountPercent / 100)) * 100) / 100}
					</td>
					<td className="quantity">
						<span className="label">Quantity: </span>{cartItem.quantity}
					</td>
					<td className="subtotal">
						<span className="label">Subtotal: </span>${cartItem.quantity * product.price}
					</td>
					<td className="remove">
						<button onClick={e => alterCart(false, product._id, null)} className="ui red button">
							<i className="trash icon" />
						</button>
					</td>
				</tr>
			);
		});
	};

	return (
		<table className="ui table">
			<thead>
				<tr>
					<th>Image</th>
					<th>Name</th>
					<th>Price</th>
					<th>Qty.</th>
					<th>Item Total</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{renderItems()}
				<tr>
					<td colSpan="5">
						<div className="total">Total: ${total}</div>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default connect(null, {alterCart})(CartTable);