import React from "react";

const Price = ({product}) => {
    if(product.discount) {
        return (
            <React.Fragment>
                <span className="strikeThrough">${product.price}</span>
                <span className="red">
                    ${(Math.round((product.price - product.price * (product.discount / 100)) * 100) / 100).toFixed(2)}
                    ({product.discount}% off)
                </span>
            </React.Fragment>
        )
    } else {
        return <React.Fragment>${(product.price).toFixed(2)}</React.Fragment>
    };
}

export default Price;