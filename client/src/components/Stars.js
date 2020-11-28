import React from "react";

const Stars = ({rating}) => {
    const el = [];

    for(let i = 1; i <= 5; i++) {
        const yellow = i <= rating ? "yellow" : "";

        el.push(
            <i key={i} className={`${yellow} fas fa-star`} />
        );
    };

    return <div>{el}</div>
};

export default Stars;