import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import Price from "./Price";
import Stars from "./Stars";
import "./ProductCard.css";

const ProductCard = ({product, children}) => {
    return (
        <div className="product card">
            <Link to={`/products/${product._id}`} className="image">
                    <img src={product.image.url} alt={product.title} />
            </Link>
            <div className="content">
                <div className="header">
                    <Link to={`/products/${product._id}`}>{product.title}</Link>
                </div>
                {product.ratings && product.ratings.length > 0 &&
                    <Stars rating={product.ratings.reduce((a, b) => a + b) / product.ratings.length} />
                }
                <div className="meta">
                    <Price product={product} />
                    {product.discount &&
                        <div className="discountDate">Until {moment(product.expireAt).format("MMM Do")}</div>
                    }
                </div>
                {children}
            </div>
        </div>
    );
};

export default ProductCard;