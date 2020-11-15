import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import history from "../history";

const Header = ({searchList, searchProperty, searchDest, suggestionDest}) => {
	//Local state
	const [term, setTerm] = useState("");
	const [debouncedTerm, setDebouncedTerm] = useState(term);
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchRef = useRef();

	//Hides suggestions on page click
	useEffect(() => {
		const onBodyClick = e => {
			if(!searchRef.current.contains(e.target)) {
				setShowSuggestions(false);
			};
		};
		document.body.addEventListener("click", onBodyClick);

		//Cleans up click listener when app is closed
		return () => {
			document.body.removeEventListener("click", onBodyClick)
		}
	}, []);

	//Debounces search term and fetches search suggestions
	useEffect(() => {
		const debounceId = setTimeout(() => setDebouncedTerm(term), 500);
		return () => clearTimeout(debounceId)
	}, [term]);
	useEffect(() => {
		if(debouncedTerm.length > 0) {
			const searchRe = new RegExp("^" + debouncedTerm);
			const matches = searchList.filter(item => {
				return searchRe.test(item[searchProperty]);
			});
			setSuggestions(matches.length > 5 ? matches.slice(0, 5) : matches);
		} else {
			setSuggestions([]);
		}
	}, [debouncedTerm, searchList, searchProperty]);

	//Redirects with search query
	const onSearchPress = (e) => {
		if(e.key === "Enter") {
			const path = e.target.value.length > 0 ? `${searchDest}?search=${e.target.value}` : "";
			history.push(path);
			e.target.value = "";
		};
	};

	const renderSuggestions = () => {
		if(showSuggestions) {
			return suggestions.map(suggestion => {
				const ellipsis = suggestion[searchProperty].length >= 15 ? "..." : "";

				return (
					<Link to={suggestionDest + suggestion._id} key={suggestion._id}>
						{suggestion[searchProperty].substring(0, 15) + ellipsis}
					</Link>
				);
			});
		};
	};

	return (
		<div className="ui search">
			<div className="ui icon input" ref={searchRef}>
				<input 
					type="text" 
					placeholder="Search..." 
					value={term} 
					onFocus={() => setShowSuggestions(true)}
					onChange={e => setTerm(e.target.value)}
					onKeyPress={e => onSearchPress(e)} />
				<i className="ui search icon" />
			</div>
			<ul className="resultBox">{renderSuggestions()}</ul>
		</div>
	);
};

export default Header;