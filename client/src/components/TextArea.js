import React from "react";

const TextArea = ({input, meta, label, placeholder, maxLength, initial}) => {
    return (
        <div className="field">
            <label>{label}</label>
            <textarea {...input} placeholder={placeholder} maxLength={maxLength} required>
                {initial}
            </textarea>
            {meta.touched && meta.error &&
                <div className="errorLabel">{meta.error}</div>
            }
        </div>
    );
};

export default TextArea;