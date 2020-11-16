import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {alterCart} from "../../actions";

const CartTable = ({alterCart, products, user, total}) => {
	const renderItems = () => {
		return products.map(product => {
			const cartItem = user.cart.find(item => item.product === product._id);

			return (
				<tr key={product._id}>
					<td className="image">
						<img 
							src={`data:${product.image.contentType};base64,${product.image}`} 
							alt={product.title}
							id="productImage" />
					</td>
					<td className="name">
						<strong>
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</strong>
						<em> ({cartItem.variation})</em>
					</td>
					<td className="price">
						<span className="label">Price: </span>${product.price}
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

	if(!products || products.length <= 0) {
		return <div className="empty">Your cart is empty</div>
	}

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