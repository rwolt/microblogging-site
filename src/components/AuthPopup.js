import React from "react";
import { Popup } from "./styled/Popup.styled";
import LoginForm from "./LoginForm";

const AuthPopup = (props) => {
  return (
    <Popup>
      <LoginForm
        handleLogin={props.handleLogin}
        handleRegister={props.handleRegister}
        showRegisterForm={props.showRegisterForm}
        setShowRegisterForm={props.setShowRegisterForm}
        setShowPopup={props.setShowPopup}
      />
    </Popup>
  );
};

export default AuthPopup;
