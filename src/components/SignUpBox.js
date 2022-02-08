import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Button } from "./styled/Button.styled";

const SignUpBox = (props) => {
  return (
    <Flex>
      <Button onClick={() => props.setShowPopup(true)}>Sign In</Button>
      <Button
        onClick={() => {
          props.setShowPopup(true);
          props.setShowRegisterForm(true);
        }}
      >
        Register
      </Button>
    </Flex>
  );
};

export default SignUpBox;
