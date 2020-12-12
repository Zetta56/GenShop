import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts, logout} from "../actions";
import Search from "../components/Search";
import HeaderRight from "../components/HeaderRight";

const Header = ({fetchProducts, ...props}) => {
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

	return (
		<React.Fragment>
			<div className="ui inverted top fixed secondary pointing menu" id="header">
				<Link to="/" className="item">GenShop</Link>
				<Search searchList={props.products} searchProperty="title" destination="/" />
				<div className="right menu">
					<HeaderRight {...props} top />
				</div>
				<Link to="#" className="hamburger item" ref={hamburgerRef} onClick={() => setSideOpen(!sideOpen)}>
					<i className="fas fa-bars"></i>
				</Link>
			</div>
			<div className={`ui ${sideVisible} right sidebar vertical menu`} id="sidebar">
				<HeaderRight {...props} />
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