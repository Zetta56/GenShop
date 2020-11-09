import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts} from "../../actions";
import "./ProductList.css";

const ProductList = ({fetchProducts, products, loading}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map(product => {
			return (
				<div className="card" key={product._id}>
					<Link to={`/products/${product._id}`} className="image">
							<img src={`data:${product.image.contentType};base64,${product.image}`} alt={product.title} />
					</Link>
					<div className="content">
						<div className="meta">${product.price}</div>
						<div className="header">
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</div>
					</div>
				</div>
			);
		});
	};

	if(!products || loading) {
		return <div className="ui active centered inline loader"></div>
	};

	return (
		<div className="ui stackable three cards" id="productList">
			{renderList()}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {products: Object.values(state.products), loading: state.alert.loading};
};

export default connect(mapStateToProps, {fetchProducts})(ProductList);

//<img src={`${imageData}`} alt={product.title} />