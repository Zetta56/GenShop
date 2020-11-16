import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts} from "../../actions";
import "./ProductList.css";

const ProductList = ({fetchProducts, products, loading, location}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts, location]);

	const renderList = () => {
		return products.map(product => {
			return (
				<div className="card" key={product._id}>
					<Link to={`/products/${product._id}`} className="image">
							<img src={`data:${product.image.contentType};base64,${product.image}`} alt={product.title} />
					</Link>
					<div className="content">
						<div className="header">
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</div>
						<div className="meta">${product.price}</div>
					</div>
				</div>
			);
		});
	};

	if(!products || loading) {
		return <div className="ui active centered inline loader"></div>
	};

	return (
		<div className="ui stackable four cards" id="productList">
			{renderList()}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	//Finds products that match search
	const search = decodeURI(ownProps.location.search)
					.substring(ownProps.location.search.indexOf("=") + 1)
					.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	const searchRe = new RegExp("^" + search);
	const filteredProducts = ownProps.location.search
		? Object.values(state.products).filter(product => searchRe.test(product.title))
		: Object.values(state.products)

	return {
		products: filteredProducts, 
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {fetchProducts})(ProductList);