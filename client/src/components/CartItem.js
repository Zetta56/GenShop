import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {alterCart} from "../actions";

const cartItem = ({alterCart, product, variation, quantity, itemTotal}) => {
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
                <button onClick={() => alterCart(false, product._id, null)} className="ui red button">
                    <i className="trash icon" />
                </button>
            </td>
        </tr>
    );
};

export default connect(null, {alterCart})(cartItem);