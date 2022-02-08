import React from "react";
import { Popup } from "./styled/Popup.styled";
import LoginForm from "./LoginForm";

const AuthPopup = (props) => {
  return (
    <Popup>
      <LoginForm
        showRegisterForm={props.showRegisterForm}
        setShowRegisterForm={props.setShowRegisterForm}
      />
    </Popup>
  );
};

export default AuthPopup;
