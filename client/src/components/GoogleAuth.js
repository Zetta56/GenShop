import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {login, logout} from "../actions";

//Set actionType to none to only load oauth2 client
const GoogleAuth = ({login, logout, actionType}) => {
    useEffect(() => {
        if(process.env.REACT_APP_GOOGLE_CLIENTID) {
            window.gapi.load("client:auth2", () => {
                window.gapi.client.init({
                    clientId: process.env.REACT_APP_GOOGLE_CLIENTID,
                    scope: "email"
                }).then(() => {
                    if(window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        login({googleId: window.gapi.auth2.getAuthInstance().currentUser.get()}, "initial");
                    }
                });
            });
        }
    }, [login]);

    const onLogoutClick = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        logout();
    };

    const onLoginClick = async () => {
        await window.gapi.auth2.getAuthInstance().signIn();
        login({googleToken: window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token});
    };

    if(!process.env.REACT_APP_GOOGLE_CLIENTID) {
        return null;
    };
    
    switch(actionType) {
        case "login":
            return (
                <React.Fragment>
                    <div className="ui horizontal divider">Or</div>
                    <button className="googleLogin" onClick={() => onLoginClick()}></button>
                </React.Fragment>
            )
        case "logout":
            return <Link to="/" className="item" onClick={() => onLogoutClick()}>Logout</Link>
        default:
            return null
    };
};

export default connect(null, {login, logout})(GoogleAuth);