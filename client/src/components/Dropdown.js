import React from "react";

const Dropdown = ({label, input, options}) => {
    if(!options || options.length === 0) {
        return null;
    };

    return (
        <span>
            <label>{label}</label>
            <select {...input} className="ui selection dropdown menu">
                {
                    options.map(option => {
                        return (
                            <option className="item" value={option} key={option}>
                                {option}
                            </option>
                        );
                    })
                }
            </select>
        </span>
    );
};

export default Dropdown;