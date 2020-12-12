import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {editCart} from "../actions";

const CartRow = ({editCart, product, variation, quantity}) => {
    const discountPercent = product.discount ? product.discount : 0;
	const itemTotal = product.price - Math.round(product.price * discountPercent) / 100;
    
    return (
        <tr>
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
                {variation && variation.length > 0 &&
                    <em> ({variation})</em>
                }
            </td>
            <td className="price">
                <span className="label">Price: </span>
                ${(itemTotal).toFixed(2)}
            </td>
            <td className="quantity">
                <span className="label">Quantity: </span>{quantity}
            </td>
            <td className="subtotal">
                <span className="label">Subtotal: </span>${(quantity * itemTotal).toFixed(2)}
            </td>
            <td className="remove">
                <button onClick={() => editCart(product._id, null)} className="ui red button">
                    <i className="trash icon" />
                </button>
            </td>
        </tr>
    );
};

export default connect(null, {editCart})(CartRow);