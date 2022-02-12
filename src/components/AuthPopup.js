import React from "react";
import { Popup } from "./styled/Popup.styled";
import LoginForm from "./LoginForm";
import { Flex } from "./styled/Flex.styled";
import { Button } from "./styled/Button.styled";

const AuthPopup = (props) => {
  return (
    <Popup>
      <Flex justifyContent={"flex-end"}>
        <Button width={"40px"} onClick={() => props.setShowPopup(false)}>
          x
        </Button>
      </Flex>
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
