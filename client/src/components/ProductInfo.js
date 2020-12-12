import React from "react";
import {Link} from "react-router-dom";
import CartForm from "./CartForm";
import KebabMenu from "./KebabMenu";
import Stars from "./Stars";
import "./ProductInfo.css";

const ProductInfo = ({product, user}) => {
    const renderKebab = () => {
		if(user.isAdmin) { 
			return (
				<KebabMenu>
					<Link to={`/products/${product._id}/edit`} className="item">Edit</Link>
					<Link to={`/products/${product._id}/delete`} className="item">Delete</Link>
                </KebabMenu>
			);
		};
	};

    return (
        <div className="info">
            <h1 className="ui header">
                {renderKebab()}
                <span className="title">{product.title}</span>
                {product.ratings && product.ratings.length > 0 &&
                    <Stars rating={product.ratings.reduce((a, b) => a + b) / product.ratings.length} />
                }
            </h1>
            <div className="ui divider"></div>
            <div className="ui stackable grid">
                <div className="eight wide text column">
                    <div className="ui contentTop divider"></div>
                    <CartForm product={product} />
                </div>
                <div className="eight wide image column">
                    <div className="ui fluid image">
                        <img src={product.image.url} alt={product.title} />
                    </div>
                </div>
            </div>
            <div className="ui divider"></div>
            <div className="description">
                <h3>Details:</h3>
                {product.description}
            </div>
        </div>
    );
};

export default ProductInfo;