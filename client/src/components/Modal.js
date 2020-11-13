import React from "react";
import ReactDOM from "react-dom";

const Modal = ({header, content, actions, onDismiss}) => {
	return ReactDOM.createPortal(
		<div className="ui active dimmer" onClick={() => onDismiss()}>
			<div className="ui active modal" onClick={(e) => e.stopPropagation()}>
				<div className="header">{header}</div>
				<div className="content">{content}</div>
				{actions && <div className="actions">{actions}</div>}
			</div>
		</div>,
		document.querySelector("#modal")
	);
};

export default Modal;