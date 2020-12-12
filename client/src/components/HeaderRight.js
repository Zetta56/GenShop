import React from "react";
import {Link} from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import "./HeaderRight.css";

const HeaderRight = ({isLoggedIn, isAdmin, logout, top}) => {
	const createText = top ? <i className="plus icon" /> : "Create Listing";
    const watchlistText = top ? <i className="list icon" /> : "Watchlist";
    const cartText = top ? <i className="shopping cart icon"/> : "Cart";

	const renderLogout = () => {
		if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
			return <GoogleAuth actionType="logout" />
		} else {
			return <Link to="/" className="item" onClick={() => logout()}>Logout</Link>
		};
	};

    if(isLoggedIn === null) {
        return null;
    }

	//Renders right-side buttons
	if(isLoggedIn) {
        return (
            <React.Fragment>
                {isAdmin &&
                    <Link to="/products/new" className="create item">{createText}</Link>
                }
                <Link to="/watchlist" className="item">{watchlistText}</Link>
                <Link to="/cart" className="item">{cartText}</Link>
                {renderLogout()}
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Link to="/login" className="item">Login</Link>
                <Link to="/register" className="item">Sign Up</Link>
            </React.Fragment>
        );
    };
};

export default HeaderRight;