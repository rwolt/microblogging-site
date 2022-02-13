import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AuthPopup from "../components/AuthPopup";
import { Container } from "../components/styled/Container.styled";
import { useParams } from "react-router-dom";

const Profile = (props) => {
  const [user, setUser] = useState("");
  const params = useParams();
  useEffect(() => {
    const getUserInfo = async (uid) => {
      // console.log(props.getUserInfo(params.uid));
      const userDoc = await props.getUserInfo(uid);
      setUser(userDoc);
    };
    getUserInfo(params.uid);
  }, []);
  return (
    <Container>
      <Header
        pageTitle={user.name}
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
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

export default Profile;
