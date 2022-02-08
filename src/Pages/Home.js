import React from "react";
import PostInputBox from "../components/PostInputBox";
import SignUpBox from "../components/SignUpBox";
import AuthPopup from "../components/AuthPopup";
import { Header } from "../components/styled/Header.styled";
import { Container } from "../components/styled/Container.styled";

const Home = (props) => {
  return (
    <Container>
      <Header>Home</Header>
      {props.user ? (
        <PostInputBox />
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
        />
      ) : (
        ""
      )}
    </Container>
  );
};

export default Home;
