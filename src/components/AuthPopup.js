import React from "react";
import { Popup } from "./styled/Popup.styled";
import { AiOutlineClose } from "react-icons/ai";
import LoginForm from "./LoginForm";
import { Flex } from "./styled/Flex.styled";
import { Button } from "./styled/Button.styled";

const AuthPopup = (props) => {
  return (
    <Popup>
      <Flex justifyContent={"flex-end"}>
        <Button
          width={"30px"}
          height={"30px"}
          borderRadius={"50%"}
          onClick={() => props.setShowPopup(false)}
        >
          <AiOutlineClose />
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
