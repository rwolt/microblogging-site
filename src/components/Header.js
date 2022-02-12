import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Button } from "./styled/Button.styled";

const Header = (props) => {
  const borderStyle = props.user ? {} : { borderBottom: "1px solid #e5e5e5" };
  return (
    <Flex justifyContent="space-between" style={borderStyle}>
      <h2>{props.pageTitle}</h2>
      <Flex justifyContent="flex-end" padding="0">
        {!props.user ? (
          <Button
            onClick={() => {
              props.setShowPopup(true);
              props.setShowRegisterForm(true);
            }}
          >
            Register
          </Button>
        ) : (
          ""
        )}
        <Button
          onClick={
            props.user
              ? props.handleLogout
              : () => {
                  props.setShowPopup(true);
                  props.setShowRegisterForm(false);
                }
          }
        >
          {props.user ? "Logout" : "Login"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
