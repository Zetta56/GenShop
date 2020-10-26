import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts} from "../../actions";

const ProductList = ({fetchProducts, products, isAdmin}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map((product) => {
			return (
				<div key={product._id}>
					<Link to={`/products/${product._id}`}>{product.title}</Link>
					{product.price}
				</div>
			);
		});
	};

	if(!products) {
		return null;
	};

	return (
		<div>
			{renderList()}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {products: Object.values(state.products)};
};

export default connect(mapStateToProps, {fetchProducts})(ProductList);