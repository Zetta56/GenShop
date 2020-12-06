import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import history from "../history";

const Header = ({searchList, searchProperty, destination}) => {
	//Local state
	const [term, setTerm] = useState("");
	const [debouncedTerm, setDebouncedTerm] = useState(term);
	const [suggestions, setSuggestions] = useState([]);
	const [focused, setFocused] = useState(false);
	const searchRef = useRef();
	const stretch = focused ? "stretch" : "";

	//Debounces search term
	useEffect(() => {
		const debounceId = setTimeout(() => setDebouncedTerm(term), 500);
		return () => clearTimeout(debounceId)
	}, [term]);
	//Suggests products that match given search term
	useEffect(() => {
		if(debouncedTerm.length > 0) {
			//Escapes characters only when finding suggestions
			const search = debouncedTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			const searchRe = new RegExp("^" + search.toLowerCase());
			const matches = searchList.filter(item => {
				return searchRe.test(item[searchProperty].toLowerCase());
			});

			setSuggestions(matches.length > 5 ? matches.slice(0, 5) : matches);
		} else {
			setSuggestions([]);
		}
	}, [debouncedTerm, searchList, searchProperty]);

	//Redirects with search query
	const onSearchPress = (e) => {
		if(e.key === "Enter") {
			const path = e.target.value.length > 0 ? `${destination}?search=${e.target.value}` : "";
			setTerm("");
			history.push(path);
		};
	};

	//Renders array of suggestions
	const renderSuggestions = () => {
		if(focused) {
			return suggestions.map(suggestion => {
				const ellipsis = suggestion[searchProperty].length >= 15 ? "..." : "";

				return (
					<Link 
						to={`${destination}?search=${suggestion[searchProperty]}`}
						key={suggestion._id}
					>
						{suggestion[searchProperty].substring(0, 15) + ellipsis}
					</Link>
				);
			});
		};
	};

	return (
		<div className={`ui search ${stretch}`}>
			<div className={`ui icon input ${stretch}`} ref={searchRef}>
				<input 
					type="text" 
					placeholder="Search..." 
					value={term} 
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onChange={e => setTerm(e.target.value)}
					onKeyPress={e => onSearchPress(e)} />
				<i className="ui search icon" />
			</div>
			<ul className={`resultBox ${stretch}`}>{renderSuggestions()}</ul>
		</div>
	);
};

export default Header;