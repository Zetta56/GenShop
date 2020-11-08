import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts} from "../../actions";

const ProductList = ({fetchProducts, products, loading}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map(product => {
			const imageData = `data:${product.image.contentType};base64,${arrayBufferToBase64(product.image.data.data)}`;
			
			return (
				<div key={product._id}>
					<Link to={`/products/${product._id}`}>{product.title}</Link>
					{product.price}
					<img src={`${imageData}`} alt={product.title} />
				</div>
			);
		});
	};

	if(!products || loading) {
		return <div className="ui active centered inline loader"></div>;
	};

	return (
		<div>
			{renderList()}
		</div>
	);
};

const arrayBufferToBase64 = (buffer) => {
    let characters = "";
    //Convert binary buffer to 8-bit array (0-255) by calling Array.Prototype.slice (from start to end)
    const bytes = [].slice.call(new Uint8Array(buffer));
    //Convert byte number to UTF-16 character
    bytes.forEach(b => characters += String.fromCharCode(b));
    //Convert UTF-16 character to Base64 (printable) ASCII character
    return window.btoa(characters);
};

const mapStateToProps = (state) => {
	return {products: Object.values(state.products), loading: state.alert.loading};
};

export default connect(mapStateToProps, {fetchProducts})(ProductList);