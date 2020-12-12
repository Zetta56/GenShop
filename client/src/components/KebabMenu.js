import React, {useEffect, useState, useRef} from "react";

const KebabMenu = ({children}) => {
    const [open, setOpen] = useState(false);
    const block = open ? "block" : "";
    const menuRef = useRef();

    useEffect(() => {
        const onBodyClick = e => {
			if(!menuRef.current.contains(e.target)) {
				setOpen(false);
			};
		};
		document.body.addEventListener("click", onBodyClick);

		//Cleans up click listener when app is closed
		return () => {
			document.body.removeEventListener("click", onBodyClick)
		}
    }, []);

    return (
        <div className="ui kebab dropdown" ref={menuRef}>
            <i className="fas fa-ellipsis-v" onClick={() => setOpen(!open)} />
            <div className={`${block} menu`}>
                {children}
            </div>
        </div>
    );
};

export default KebabMenu;