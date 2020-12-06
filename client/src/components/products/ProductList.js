import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import {fetchProducts} from "../../actions";
import Price from "../Price";
import Stars from "../Stars";
import "./ProductList.css";

const ProductList = ({fetchProducts, products, loading, location}) => {
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const renderList = () => {
		return products.map(product => {
			return (
				<div className="card" key={product._id}>
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
					</div>
				</div>
			);
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