import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../history";
import {fetchProducts, logout} from "../actions";
import Search from "./Search";
import "./Header.css";

const Header = ({isLoggedIn, isAdmin, products, fetchProducts, logout}) => {
	//Sidebar Variables
	const [sideOpen, setSideOpen] = useState(false);
	const sideVisible = sideOpen ? "visible" : "";
	const hamburgerRef = useRef();

	//Closes sidebar when page is clicked
	useEffect(() => {
		fetchProducts();

		const onBodyClick = e => {
			if(!hamburgerRef.current.contains(e.target)) {
				setSideOpen(false);
			};
		};
		document.body.addEventListener("click", onBodyClick);

		//Cleans up click listener when app is closed
		return () => {
			document.body.removeEventListener("click", onBodyClick)
		}
	}, [fetchProducts]);

	//Logs user out
	const onLogoutClick = (e) => {
		e.preventDefault();
		logout();
		if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
			window.gapi.auth2.getAuthInstance().signOut();
		};
		history.push("/");
	};

	//Renders product create button for admins
	const renderCreate = (atTop) => {
		const createText = atTop ? <i className="plus icon" /> : "Create New Product";
		
		if(isAdmin) {
			return <Link to="/products/new" className="create item">{createText}</Link>
		};
	};

	//Renders right-side buttons
	const renderAuth = (top) => {
		const cartText = top ? <i className="shopping cart icon"/> : "Cart";

		if(isLoggedIn === null) {
			return;
		} else if(isLoggedIn) {
			return (
				<React.Fragment>
					<Link to="/cart" className="item">{cartText}</Link>
					<Link to="#" className="item" onClick={(e) => onLogoutClick(e)}>Logout</Link>
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

	return (
		<React.Fragment>
			<div className="ui inverted top fixed secondary pointing menu" id="header">
				<Link to="/" className="item">GenShop</Link>
				<Search 
					searchList={products} 
					searchProperty="title"
					searchDest="/"
					suggestionDest="/products/" />
				<div className="right menu">
					{renderCreate(true)}
					{renderAuth(true)}
				</div>
				<Link to="#" className="hamburger item" ref={hamburgerRef} onClick={() => setSideOpen(!sideOpen)}>
					<i className="fas fa-bars"></i>
				</Link>
			</div>
			<div className={`ui ${sideVisible} right sidebar vertical menu`} id="sidebar">
				{renderCreate(false)}
				{renderAuth(false)}
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn, 
		isAdmin: state.user.isAdmin,
		products: Object.values(state.products)
	};
};

export default connect(mapStateToProps, {fetchProducts, logout})(Header);