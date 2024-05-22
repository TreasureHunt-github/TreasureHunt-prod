import React from "react"; 

import "./Page404.css";

export const Page404 = () => {
    return (
        <div className="image-container">
            <img alt="404" className="full-width-image" src={require(`../../images/image404.jpg`)} />
        </div>
    )
}