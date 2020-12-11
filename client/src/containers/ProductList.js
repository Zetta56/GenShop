import React, {useEffect} from "react";
import {connect} from "react-redux";
import {fetchProducts} from "../actions";
import ProductCard from "../components/ProductCard";

const ProductList = ({fetchProducts, products, loading, location}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map(product => {
			return <ProductCard product={product} key={product._id} />
		});
	};

	if(loading) {
		return <div className="ui active centered inline loader"></div>
	};

	if(location.search && products.length < 1) {
		return <div className="emptyMessage">No products were found that match your search.</div>
	}

	return (
		<div className="ui stackable four cards" id="productList">
			{renderList()}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	//Finds products that match search query
	const search = decodeURI(ownProps.location.search)
					.substring(ownProps.location.search.indexOf("=") + 1)
					.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	const searchRe = new RegExp("^" + search.toLowerCase());
	const filteredProducts = ownProps.location.search
		? Object.values(state.products).filter(product => searchRe.test(product.title.toLowerCase()))
		: Object.values(state.products);

	return {
		products: filteredProducts, 
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProducts})(ProductList);