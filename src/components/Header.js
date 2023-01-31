import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Button } from "./styled/Button.styled";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { StyledPageHeader } from "./styled/Header.styled";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const borderStyle = props.user ? {} : { borderBottom: "1px solid #e5e5e5" };
  return (
    <StyledPageHeader style={borderStyle}>
      <Flex justifyContent="flex-start" padding="6px">
        {location.pathname !== "/" ? (
          <FaArrowLeft
            size="1rem"
            onClick={() => navigate(-1)}
            style={{ marginRight: "1rem", cursor: "pointer" }}
          />
        ) : (
          ""
        )}
        <h2>{props.pageTitle}</h2>
      </Flex>
      <Flex justifyContent="flex-end" padding="0">
        {!props.user ? (
          <Button
            id="register-button"
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
          id="login-button"
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
    </StyledPageHeader>
  );
};

export default Header;
