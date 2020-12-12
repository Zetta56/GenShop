import React from "react";

const TextArea = ({input, meta, initial, label, placeholder}) => {
    return (
        <div className="field">
            <label>{label}</label>
            <textarea {...input} placeholder={placeholder} required>
                {initial}
            </textarea>
            {meta.touched && meta.error &&
                <div className="errorLabel">{meta.error}</div>
            }
        </div>
    );
};

export default TextArea;