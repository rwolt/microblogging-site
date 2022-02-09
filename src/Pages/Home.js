import React from "react";
import PostInputBox from "../components/PostInputBox";
import SignUpBox from "../components/SignUpBox";
import AuthPopup from "../components/AuthPopup";
import Header from "../components/Header";
import { Container } from "../components/styled/Container.styled";

const Home = (props) => {
  return (
    <Container>
      <Header
        pageTitle="Home"
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      {props.user ? <PostInputBox user={props.user} /> : ""}
      {props.showPopup ? (
        <AuthPopup
          showRegisterForm={props.showRegisterForm}
          setShowRegisterForm={props.setShowRegisterForm}
          handleLogin={props.handleLogin}
          handleGoogleLogin={props.handleGoogleLogin}
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
