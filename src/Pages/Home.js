import React from "react";
import PostInputBox from "../components/PostInputBox";
import SignUpBox from "../components/SignUpBox";
import AuthPopup from "../components/AuthPopup";
import { Header } from "../components/styled/Header.styled";
import { Container } from "../components/styled/Container.styled";
import { Button } from "../components/styled/Button.styled";

const Home = (props) => {
  return (
    <Container>
      <Header>
        Home
        <Button onClick={props.handleLogout}> Logout </Button>
      </Header>
      {props.user ? (
        <PostInputBox user={props.user} />
      ) : (
        <SignUpBox
          setShowPopup={props.setShowPopup}
          setShowRegisterForm={props.setShowRegisterForm}
        />
      )}
      {props.showPopup ? (
        <AuthPopup
          showRegisterForm={props.showRegisterForm}
          setShowRegisterForm={props.setShowRegisterForm}
          handleLogin={props.handleLogin}
          handleRegister={props.handleRegister}
          setShowPopup={props.setShowPopup}
        />
      ) : (
        ""
      )}
    </Container>
  );
};

export default Home;
