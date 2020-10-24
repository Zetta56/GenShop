import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import "./Modal.css";

const Modal = ({header, content, actions, onDismiss, id}) => {
	return ReactDOM.createPortal(
		<div className="ui active dimmer" onClick={() => onDismiss()}>
			<div className="ui active modal" id={id} onClick={(e) => e.stopPropagation()}>
				<div className="header">{header}</div>
				<div className="content">{content}</div>
				{actions && <div className="actions">{actions}</div>}
			</div>
		</div>,
		document.querySelector("#modal")
	);
};

export default Modal;