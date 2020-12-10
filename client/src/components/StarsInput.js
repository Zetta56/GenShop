import React, {useState} from "react";
import {Field} from "redux-form";

const StarsInput = ({ratings}) => {
    const [hoverRatings, setHoverRatings] = useState(null);

    const el = [];
    for(let i = 1; i <= 5; i++) {
        const yellow = i <= ratings ? "yellow" : "";
        const orange = i <= hoverRatings ? "orange" : "";
        const intRating = ratings && typeof ratings === "string" ? Number.parseInt(ratings) : ratings ;

        el.push(
            <React.Fragment key={i}>
                <label 
                    onMouseEnter={() => setHoverRatings(i)} 
                    onMouseLeave={() => setHoverRatings(null)}
                    onClick={() => setHoverRatings(null)}
                >
                    <Field 
                        name="ratings" 
                        component="input" 
                        type="radio"
                        value={i}
                        checked={i === intRating}
                        required />
                    <i className={`${yellow} ${orange} fas fa-star`}></i>
                </label>
            </React.Fragment>
        );
    };

    return <div className="ratings">{el}</div>
};

export default StarsInput;