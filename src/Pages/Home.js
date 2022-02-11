import React, { useEffect, useState } from "react";
import PostInputBox from "../components/PostInputBox";
import SignUpBox from "../components/SignUpBox";
import AuthPopup from "../components/AuthPopup";
import Header from "../components/Header";
import { Container } from "../components/styled/Container.styled";
import { Flex } from "../components/styled/Flex.styled";

const Home = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    setPosts(await props.getMessages());
  }, []);

  return (
    <Container>
      <Header
        pageTitle="Home"
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      {props.user ? (
        <PostInputBox
          user={props.user}
          postMessage={props.postMessage}
          getMessages={props.getMessages}
          setPosts={setPosts}
        />
      ) : (
        ""
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
      {posts.map((post) => {
        return (
          <Flex key={post.id}>
            <p>{post.message}</p>
          </Flex>
        );
      })}
    </Container>
  );
};

export default Home;
