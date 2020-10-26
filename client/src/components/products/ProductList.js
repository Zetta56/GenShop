import React, {useEffect} from "react";
import {connect} from "react-redux";
import {fetchProducts} from "../../actions";

const ProductList = ({fetchProducts, products}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map((product) => {
			return (
				<div key={product._id}>
					{product.title}
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