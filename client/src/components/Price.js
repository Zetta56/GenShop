import React from "react";

const Price = ({product}) => {
    if(product.discount) {
        return (
            <React.Fragment>
                <span className="strikeThrough">${product.price}</span>
                <span className="red">
                    ${Math.round((product.price - product.price * (product.discount / 100)) * 100) / 100}
                    ({product.discount}% off)
                </span>
            </React.Fragment>
        )
    } else {
        return <React.Fragment>${product.price}</React.Fragment>
    };
}

export default Price;