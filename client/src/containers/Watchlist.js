import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts, editWatchlist, deleteWatchlist} from "../actions";
import KebabMenu from "../components/KebabMenu";
import ProductCard from "../components/ProductCard";

const Watchlist = ({products, user, fetchProducts, editWatchlist, deleteWatchlist}) => {
    useEffect(() => {
        fetchProducts(user._id, "watchlist");
    }, [fetchProducts, user]);

    const renderList = () => {
        return products.map(product => {
            return (
                <ProductCard product={product} key={product._id}>
                    <button className="ui red button" onClick={() => editWatchlist(product._id)}>
                        <i className="trash icon" />
                    </button>
                </ProductCard>
            );
        });
    };

    if(!products || products.length < 1) {
        return <div className="emptyMessage">Your watchlist is empty.</div>
    }

    return (
        <div id="watchlist">
            <h2>
                My Watchlist
                <KebabMenu>
					<Link to="#" className="item" onClick={() => deleteWatchlist()}>Reset</Link>
				</KebabMenu>
            </h2>
            <div className="ui stackable cards">{renderList()}</div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        products: Object.values(state.products).filter(item => state.user.watchlist.includes(item._id))
    }
};

export default connect(mapStateToProps, {fetchProducts, editWatchlist, deleteWatchlist})(Watchlist);